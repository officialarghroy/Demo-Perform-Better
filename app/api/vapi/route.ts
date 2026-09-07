import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

// ---------------------------------------------------------------------
// Vapi sends one of many `message.type` values to this Server URL. We
// only act on two of them; everything else is acknowledged with a plain
// 200 so Vapi doesn't retry. See:
// https://docs.vapi.ai/server-url/events
// ---------------------------------------------------------------------

interface VapiToolCall {
  id: string;
  name: string;
  arguments?: Record<string, unknown>;
  parameters?: Record<string, unknown>; // older Vapi payloads used this key
}

interface VapiArtifactMessage {
  role?: string;
  message?: string;
}

interface VapiWebhookBody {
  message?: {
    type?: string;
    call?: { id?: string };
    toolCallList?: VapiToolCall[];
    artifact?: {
      transcript?: string;
      messages?: VapiArtifactMessage[];
    };
    analysis?: { summary?: string };
    summary?: string;
  };
}

const SAVE_TRIAL_INQUIRY_TOOL = "save_trial_inquiry";

function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.VAPI_WEBHOOK_SECRET;
  if (!expected) return false;

  const authHeader = req.headers.get("authorization");
  if (authHeader === `Bearer ${expected}`) return true;

  // Legacy credential mode still supported by Vapi for backward compatibility.
  const legacySecret = req.headers.get("x-vapi-secret");
  if (legacySecret === expected) return true;

  return false;
}

/**
 * POST /api/vapi
 *
 * Webhook for the Vapi AI receptionist. Configure this as the
 * assistant's Server URL in the Vapi dashboard (see supabase/README.md
 * for the full setup, including the `save_trial_inquiry` tool
 * definition the assistant should call).
 *
 * Two events matter for capturing "2-Day FREE Trial" inquiries:
 *
 *  - "tool-calls": the assistant explicitly calls `save_trial_inquiry`
 *    mid-call once it has the caller's details. This is the primary,
 *    structured path — we save immediately and speak a confirmation
 *    back through the `results[].result` field.
 *
 *  - "end-of-call-report": sent after every call ends, regardless of
 *    whether a tool was called. As a fallback (e.g. the assistant forgot
 *    to call the tool, or the call dropped early) we store the raw
 *    transcript/summary so staff can still follow up.
 */
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: VapiWebhookBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = body.message;
  if (!message?.type) {
    return NextResponse.json({ error: "Malformed payload: missing message.type." }, { status: 400 });
  }

  switch (message.type) {
    case "tool-calls":
      return handleToolCalls(message, body);
    case "end-of-call-report":
      return handleEndOfCallReport(message, body);
    default:
      // Acknowledge everything else (transcript, status-update, etc.)
      // without doing any work.
      return NextResponse.json({ received: true });
  }
}

async function handleToolCalls(
  message: NonNullable<VapiWebhookBody["message"]>,
  rawBody: VapiWebhookBody
) {
  const toolCalls = message.toolCallList ?? [];
  const relevantCalls = toolCalls.filter((call) => call.name === SAVE_TRIAL_INQUIRY_TOOL);

  if (relevantCalls.length === 0) {
    // Assistant called some other tool we don't handle here — nothing
    // to save, but still respond with an empty results array so Vapi
    // doesn't treat this as an error.
    return NextResponse.json({ results: [] });
  }

  const supabase = getSupabaseAdmin();
  const results = await Promise.all(
    relevantCalls.map(async (call) => {
      const args = (call.arguments ?? call.parameters ?? {}) as Record<string, unknown>;
      const callerName = typeof args.callerName === "string" ? args.callerName : null;
      const callerPhone = typeof args.callerPhone === "string" ? args.callerPhone : null;
      const preferredClass =
        typeof args.preferredClass === "string" ? args.preferredClass : null;
      const notes = typeof args.notes === "string" ? args.notes : null;

      const { error } = await supabase.from("trial_inquiries").insert({
        source: "vapi_tool_call",
        vapi_call_id: message.call?.id ?? null,
        caller_name: callerName,
        caller_phone: callerPhone,
        preferred_class: preferredClass,
        notes,
        raw_payload: rawBody as unknown as Record<string, unknown>,
      });

      if (error) {
        console.error("[api/vapi] failed to save trial inquiry:", error);
        return {
          toolCallId: call.id,
          result: "Sorry, I couldn't save that just now — please also text us your name and number.",
        };
      }

      return {
        toolCallId: call.id,
        result: `Thanks${callerName ? `, ${callerName}` : ""}! Your 2-Day FREE Trial request is saved and our team will call you back shortly.`,
      };
    })
  );

  return NextResponse.json({ results });
}

async function handleEndOfCallReport(
  message: NonNullable<VapiWebhookBody["message"]>,
  rawBody: VapiWebhookBody
) {
  const transcript =
    message.artifact?.transcript ??
    message.artifact?.messages
      ?.map((m) => `${m.role ?? "unknown"}: ${m.message ?? ""}`)
      .join("\n") ??
    null;
  const summary = message.analysis?.summary ?? message.summary ?? null;

  // Only worth a fallback record if the call mentioned the trial and no
  // tool call already captured it structured — a simple keyword check
  // keeps us from logging every unrelated call as a trial inquiry.
  const mentionsTrial = /trial/i.test(transcript ?? "") || /trial/i.test(summary ?? "");
  if (!mentionsTrial) {
    return NextResponse.json({ received: true });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("trial_inquiries").insert({
    source: "vapi_call_summary",
    vapi_call_id: message.call?.id ?? null,
    transcript,
    summary,
    raw_payload: rawBody as unknown as Record<string, unknown>,
  });

  if (error) {
    console.error("[api/vapi] failed to save call summary:", error);
    return NextResponse.json({ error: "Failed to save inquiry." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
