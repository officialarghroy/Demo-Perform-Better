"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface ModalContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const ModalContext = createContext<ModalContextValue | undefined>(undefined);

/**
 * Global open/closed state for the site-wide BookingModal
 * (components/ui/BookingModal.tsx). Wrap the app in this once (see
 * app/layout.tsx) and call `useModal().open()` from any CTA — the
 * "BOOK YOUR INTRO SESSION" buttons in Navbar and Hero, for instance —
 * to pop the same modal instance rather than each button owning its
 * own local isOpen state.
 */
export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModal(): ModalContextValue {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModal must be used within a <ModalProvider>.");
  }
  return ctx;
}
