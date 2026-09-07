-- Perform Better Fitness Center
-- Migration: allow website-submitted trial inquiries
--
-- The BookingModal (components/ui/BookingModal.tsx) now submits
-- "2-Day FREE Trial" requests directly from the website's booking
-- form via POST /api/trial-inquiries. Widen trial_inquiries.source to
-- accept that alongside the existing Vapi-sourced values.

alter table public.trial_inquiries
  drop constraint if exists trial_inquiries_source_check;

alter table public.trial_inquiries
  add constraint trial_inquiries_source_check
  check (source in ('vapi_tool_call', 'vapi_call_summary', 'website_form'));
