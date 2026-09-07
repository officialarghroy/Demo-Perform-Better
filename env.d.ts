export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // --- Supabase --------------------------------------------------
      /** Project URL. Safe to expose to the browser. */
      readonly NEXT_PUBLIC_SUPABASE_URL: string;
      /** Public anon key. Safe to expose; RLS governs what it can touch. */
      readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
      /**
       * Service-role key. Bypasses Row Level Security — secret, server-only.
       * Used by lib/supabase-admin.ts. Never expose to the browser.
       */
      readonly SUPABASE_SERVICE_ROLE_KEY: string;

      // --- Vapi AI receptionist ---------------------------------------
      /**
       * Shared secret the Vapi assistant's Server URL credential sends
       * back to app/api/vapi/route.ts (as `Authorization: Bearer <secret>`
       * or the legacy `x-vapi-secret` header). Secret, server-only.
       */
      readonly VAPI_WEBHOOK_SECRET: string;
      /**
       * Vapi private API key, for making outbound API calls to Vapi
       * (e.g. managing assistants/calls from a server). Not currently
       * used by any route in this project, but typed for when it is.
       */
      readonly VAPI_API_KEY?: string;

      // --- Internal admin tooling --------------------------------------
      /**
       * Shared secret required (as `x-admin-secret`) to update a
       * referral's status via app/api/referrals/[id]/route.ts. Secret,
       * server-only.
       */
      readonly ADMIN_API_SECRET: string;
    }
  }
}
