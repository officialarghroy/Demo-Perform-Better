import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type PlanInterest = "gym_only" | "gym_f50";

interface ReferralRequestBody {
  referrerMemberId?: unknown;
  referrerName?: unknown;
  newMemberName?: unknown;
  newMemberPhone?: unknown;
  newMemberEmail?: unknown;
  planInterest?: unknown;
}

const PHONE_PATTERN = /^[0-9+()\-\s]{6,20}$/;
const PLAN_VALUES: PlanInterest[] = ["gym_only", "gym_f50"];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * POST /api/referrals
 *
 * Public endpoint backing the "Refer a Friend" promo on the Pricing page:
 * "Refer a friend for 3 months F50 Group classes, get 1 month FREE!"
 *
 * Securely links the referrer's member ID to the new signup's details by
 * writing through the service-role client (lib/supabase-admin.ts) — the
 * `referrals` table has RLS enabled with no public policies, so this
 * route is the only way the row gets created. The reward itself isn't
 * granted here; a referral starts as "pending" and a staff member (or
 * future automation) verifies the new signup and moves it to
 * "reward_issued" via PATCH /api/referrals/[id].
 */
export async function POST(req: NextRequest) {
  let body: ReferralRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const referrerMemberId = body.referrerMemberId;
  const referrerName = body.referrerName;
  const newMemberName = body.newMemberName;
  const newMemberPhone = body.newMemberPhone;
  const newMemberEmail = body.newMemberEmail;
  const planInterest = body.planInterest;

  if (!isNonEmptyString(referrerMemberId)) {
    return NextResponse.json(
      { error: "referrerMemberId is required." },
      { status: 400 }
    );
  }
  if (!isNonEmptyString(newMemberName)) {
    return NextResponse.json(
      { error: "newMemberName is required." },
      { status: 400 }
    );
  }
  if (!isNonEmptyString(newMemberPhone) || !PHONE_PATTERN.test(newMemberPhone)) {
    return NextResponse.json(
      { error: "newMemberPhone is required and must be a valid phone number." },
      { status: 400 }
    );
  }
  if (referrerName !== undefined && typeof referrerName !== "string") {
    return NextResponse.json({ error: "referrerName must be a string." }, { status: 400 });
  }
  if (newMemberEmail !== undefined && typeof newMemberEmail !== "string") {
    return NextResponse.json({ error: "newMemberEmail must be a string." }, { status: 400 });
  }
  if (
    planInterest !== undefined &&
    !PLAN_VALUES.includes(planInterest as PlanInterest)
  ) {
    return NextResponse.json(
      { error: `planInterest must be one of: ${PLAN_VALUES.join(", ")}.` },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();

  // Cheap idempotency / spam guard: if this referrer already referred this
  // same phone number in the last 24h, return the existing referral
  // instead of creating a duplicate.
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: existing, error: lookupError } = await supabase
    .from("referrals")
    .select("id, status, created_at")
    .eq("referrer_member_id", referrerMemberId)
    .eq("new_member_phone", newMemberPhone)
    .gte("created_at", since)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error("[api/referrals] lookup failed:", lookupError);
    return NextResponse.json({ error: "Failed to check for duplicate referral." }, { status: 500 });
  }

  if (existing) {
    return NextResponse.json(
      { id: existing.id, status: existing.status, duplicate: true },
      { status: 200 }
    );
  }

  const { data: inserted, error: insertError } = await supabase
    .from("referrals")
    .insert({
      referrer_member_id: referrerMemberId,
      referrer_name: referrerName ?? null,
      new_member_name: newMemberName,
      new_member_phone: newMemberPhone,
      new_member_email: newMemberEmail ?? null,
      plan_interest: planInterest ?? null,
    })
    .select("id, status, created_at")
    .single();

  if (insertError || !inserted) {
    console.error("[api/referrals] insert failed:", insertError);
    return NextResponse.json({ error: "Failed to create referral." }, { status: 500 });
  }

  return NextResponse.json(
    { id: inserted.id, status: inserted.status, duplicate: false },
    { status: 201 }
  );
}
