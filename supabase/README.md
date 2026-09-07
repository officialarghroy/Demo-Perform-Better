# Supabase setup

## Applying migrations

`migrations/0001_referrals_and_inquiries.sql` creates the `referrals` and
`trial_inquiries` tables used by:

- [`app/api/referrals/route.ts`](../app/api/referrals/route.ts) and
  [`app/api/referrals/[id]/route.ts`](../app/api/referrals/[id]/route.ts) —
  the "Refer a Friend" program.
- [`app/api/vapi/route.ts`](../app/api/vapi/route.ts) — the Vapi AI
  receptionist webhook.

Apply it either:

- **Supabase SQL editor** — open your project's SQL editor, paste the
  contents of the migration file, and run it.
- **Supabase CLI** — `supabase link` to this project, then `supabase db push`.

## Required environment variables

Set these in `.env.local` for development and in your hosting provider's
environment settings for production (see `.env.local.example` and
`env.d.ts`):

| Variable | Used by | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, `lib/supabase-admin.ts` | Project URL, safe to expose to the browser. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts` | Public anon key, safe to expose. RLS blocks it from touching `referrals` / `trial_inquiries`. |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase-admin.ts` | **Secret.** Bypasses Row Level Security. Server-only — never import `lib/supabase-admin.ts` from a Client Component. |
| `ADMIN_API_SECRET` | `app/api/referrals/[id]/route.ts` | **Secret.** Shared secret staff tooling sends as `x-admin-secret` to update a referral's status. |
| `VAPI_WEBHOOK_SECRET` | `app/api/vapi/route.ts` | **Secret.** Must match the token configured on the Vapi assistant's Server URL credential. |

## Wiring up the Vapi assistant

In the Vapi dashboard, configure the assistant's **Server URL** to point at
`https://<your-domain>/api/vapi`, with a Custom Credential (Bearer Token)
whose token matches `VAPI_WEBHOOK_SECRET`. The route also accepts the
legacy `x-vapi-secret` header for backward compatibility.

Then add a **tool** the assistant can call when a caller wants to claim the
2-Day FREE Trial, named `save_trial_inquiry`, with parameters:

```json
{
  "callerName": "string",
  "callerPhone": "string",
  "preferredClass": "string (optional)",
  "notes": "string (optional)"
}
```

See `app/api/vapi/route.ts` for the exact request/response shapes.
