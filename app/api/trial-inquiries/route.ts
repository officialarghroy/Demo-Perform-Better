import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const GOAL_VALUES = ["Weight Loss", "Strength", "Functional", "Kids"] as const;
type Goal = (typeof GOAL_VALUES)[number];

interface TrialInquiryRequestBody {
  name?: unknown;
  phone?: unknown;
  goal?: unknown;
}

const PHONE_PATTERN = /^[0-9+()\-\s]{6,20}$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * POST /api/trial-inquiries
 *
 * Public endpoint backing the BookingModal's "2-Day FREE Trial" form
 * (components/ui/BookingModal.tsx). Writes through the service-role
 * client (lib/supabase-admin.ts) into the same `trial_inquiries` table
 * the Vapi AI receptionist webhook uses (app/api/vapi/route.ts) — RLS
 * has no public policies, so this route is the only way a row gets
 * created from the browser. Rows land with `status: 'new'` for staff
 * follow-up, tagged `source: 'website_form'` to distinguish them from
 * phone inquiries.
 */
export async function POST(req: NextRequest) {
  let body: TrialInquiryRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, phone, goal } = body;

  if (!isNonEmptyString(name)) {
    return NextResponse.json({ error: "name is required." }, { status: 400 });
  }
  if (!isNonEmptyString(phone) || !PHONE_PATTERN.test(phone)) {
    return NextResponse.json(
      { error: "phone is required and must be a valid phone number." },
      { status: 400 }
    );
  }
  if (!GOAL_VALUES.includes(goal as Goal)) {
    return NextResponse.json(
      { error: `goal must be one of: ${GOAL_VALUES.join(", ")}.` },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: inserted, error: insertError } = await supabase
    .from("trial_inquiries")
    .insert({
      source: "website_form",
      caller_name: name,
      caller_phone: phone,
      preferred_class: goal,
    })
    .select("id, status, created_at")
    .single();

  if (insertError || !inserted) {
    console.error("[api/trial-inquiries] insert failed:", insertError);
    return NextResponse.json({ error: "Failed to submit your request." }, { status: 500 });
  }

  return NextResponse.json({ id: inserted.id, status: inserted.status }, { status: 201 });
}
