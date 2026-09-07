import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import SocialSidebar from "@/components/layout/SocialSidebar";
import Footer from "@/components/Footer";
import { BookingModal } from "@/components/ui";
import { ModalProvider } from "@/context/ModalContext";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Perform Better Fitness Center",
  description: "Perform Better Fitness Center — train harder, perform better.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} flex min-h-screen flex-col bg-background font-sans font-medium text-foreground antialiased`}
      >
        <ModalProvider>
          <Navbar />
          <SocialSidebar />
          <main className="flex-1">{children}</main>
          <Footer />
          <BookingModal />
        </ModalProvider>
      </body>
    </html>
  );
}
