"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronDown, Loader2, X } from "lucide-react";
import { useModal } from "@/context/ModalContext";

const GOAL_OPTIONS = ["Weight Loss", "Strength", "Functional", "Kids"] as const;

type Status = "idle" | "submitting" | "success" | "error";

const RESET_DELAY_MS = 300; // matches the panel's exit transition

/**
 * Global "2-Day FREE Trial" booking modal. Rendered once in
 * app/layout.tsx and controlled entirely through ModalContext — call
 * `useModal().open()` from any CTA to pop this same instance.
 *
 * Submits to POST /api/trial-inquiries, which writes into the same
 * `trial_inquiries` table the Vapi phone receptionist uses.
 */
export default function BookingModal() {
  const { isOpen, close } = useModal();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState<(typeof GOAL_OPTIONS)[number]>(GOAL_OPTIONS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Close on Escape while open.
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Reset form state after the close animation finishes, so reopening
  // doesn't flash the previous success/error state.
  useEffect(() => {
    if (isOpen) return;
    const timeout = setTimeout(() => {
      setName("");
      setPhone("");
      setGoal(GOAL_OPTIONS[0]);
      setStatus("idle");
      setErrorMessage(null);
    }, RESET_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/trial-inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, goal }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="absolute inset-0 bg-[#0A0A0A]/90 backdrop-blur-xl"
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-3xl border border-white/10 bg-[#111111] p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 text-gray-400 transition-colors hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            {status === "success" ? (
              <div className="flex flex-col items-center py-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-brand-gold" />
                <h2 className="mt-4 text-xl font-bold text-foreground">You&apos;re all set!</h2>
                <p className="mt-2 text-sm text-gray-400">
                  We&apos;ve got your details — our team will call you shortly to book your
                  2-Day FREE Trial.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 rounded-full bg-brand-gold px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 id="booking-modal-title" className="text-xl font-bold text-foreground">
                  Claim Your <span className="text-brand-gold">2-Day FREE Trial</span>
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Tell us a bit about your goals and we&apos;ll be in touch to get you started.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                  <div>
                    <label htmlFor="booking-name" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Name
                    </label>
                    <input
                      id="booking-name"
                      type="text"
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-gray-500 outline-none transition-colors focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label htmlFor="booking-phone" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Phone Number
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      placeholder="+973 3926 8852"
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground placeholder:text-gray-500 outline-none transition-colors focus:border-brand-gold"
                    />
                  </div>

                  <div>
                    <label htmlFor="booking-goal" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Goal
                    </label>
                    <div className="relative">
                      <select
                        id="booking-goal"
                        value={goal}
                        onChange={(event) => setGoal(event.target.value as (typeof GOAL_OPTIONS)[number])}
                        className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-brand-gold"
                      >
                        {GOAL_OPTIONS.map((option) => (
                          <option key={option} value={option} className="bg-[#111111]">
                            {option}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    </div>
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-red-400">{errorMessage}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-2 flex items-center justify-center gap-2 rounded-full bg-brand-gold px-6 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 disabled:opacity-70"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Claim My Free Trial"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
