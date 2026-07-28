import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "ACT Tutor — Mr. Kim",
  description: "An adaptive AI ACT tutor that builds you a personalized study plan.",
};

// Applies saved accessibility accommodations to <html> before first paint
// (not after hydration) so large-text/high-contrast/reduced-motion users
// don't see a flash of the un-accommodated page. Mirrors applyAccommodations
// in src/lib/accessibility.ts — inlined here since it must run as a plain
// script tag, before any React code loads.
const A11Y_INIT_SCRIPT = `
(function () {
  try {
    var raw = localStorage.getItem("act-tutor-accommodations");
    var p = raw ? JSON.parse(raw) : {};
    var root = document.documentElement;
    root.dataset.a11yMotion = p.reducedMotion ? "reduced" : "full";
    root.dataset.a11yText = p.largeText ? "large" : "default";
    root.dataset.a11yContrast = p.highContrast ? "high" : "default";
    root.dataset.a11yKeyboard = p.keyboardOnly ? "strong" : "default";
    root.dataset.a11yDistraction = p.distractionReduced ? "reduced" : "default";
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: the beforeInteractive script below intentionally
    // mutates <html>'s data-a11y-* attributes before React hydrates (same
    // sanctioned pattern Next.js recommends for dark-mode-flash prevention),
    // so a mismatch here is expected, not a bug.
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <Script id="a11y-init" strategy="beforeInteractive">
          {A11Y_INIT_SCRIPT}
        </Script>
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <NavBar />
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
      </body>
    </html>
  );
}
