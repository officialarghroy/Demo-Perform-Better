import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type ReferralStatus = "pending" | "verified" | "reward_issued" | "rejected";

const VALID_TRANSITIONS: Record<ReferralStatus, ReferralStatus[]> = {
  pending: ["verified", "rejected"],
  verified: ["reward_issued", "rejected"],
  reward_issued: [],
  rejected: [],
};

interface PatchBody {
  status?: unknown;
}

/**
 * PATCH /api/referrals/[id]
 *
 * Staff-only endpoint that advances a referral through its reward
 * lifecycle (pending -> verified -> reward_issued, or -> rejected) and
 * is where the "1 month free" reward is actually triggered — moving a
 * referral to "reward_issued" stamps `reward_issued_at`, which is the
 * hook point for granting the credit in whatever membership/billing
 * system Perform Better uses.
 *
 * Protected by a shared secret rather than end-user auth, since there is
 * no staff login system in this project yet. Send the secret as the
 * `x-admin-secret` header.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminSecret = process.env.ADMIN_API_SECRET;
  const providedSecret = req.headers.get("x-admin-secret");
  if (!adminSecret || providedSecret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Missing referral id." }, { status: 400 });
  }

  let body: PatchBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const nextStatus = body.status;
  const validStatuses = Object.keys(VALID_TRANSITIONS) as ReferralStatus[];
  if (typeof nextStatus !== "string" || !validStatuses.includes(nextStatus as ReferralStatus)) {
    return NextResponse.json(
      { error: `status must be one of: ${validStatuses.join(", ")}.` },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  const { data: referral, error: fetchError } = await supabase
    .from("referrals")
    .select("id, status")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    console.error("[api/referrals/:id] fetch failed:", fetchError);
    return NextResponse.json({ error: "Failed to load referral." }, { status: 500 });
  }
  if (!referral) {
    return NextResponse.json({ error: "Referral not found." }, { status: 404 });
  }

  const currentStatus = referral.status as ReferralStatus;
  const allowedNext = VALID_TRANSITIONS[currentStatus];
  if (!allowedNext.includes(nextStatus as ReferralStatus)) {
    return NextResponse.json(
      {
        error: `Cannot move referral from "${currentStatus}" to "${nextStatus}".`,
        allowedNext,
      },
      { status: 409 }
    );
  }

  const updates: Record<string, unknown> = { status: nextStatus };
  if (nextStatus === "verified") updates.verified_at = new Date().toISOString();
  if (nextStatus === "reward_issued") updates.reward_issued_at = new Date().toISOString();

  const { data: updated, error: updateError } = await supabase
    .from("referrals")
    .update(updates)
    .eq("id", id)
    .select("id, status, verified_at, reward_issued_at")
    .single();

  if (updateError || !updated) {
    console.error("[api/referrals/:id] update failed:", updateError);
    return NextResponse.json({ error: "Failed to update referral." }, { status: 500 });
  }

  return NextResponse.json(updated, { status: 200 });
}
