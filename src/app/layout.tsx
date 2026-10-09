import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

// ─── Font Definitions ────────────────────────────────────────────────────────

/** Plus Jakarta Sans — headings & display text */
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

/** Inter — body copy & UI elements */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

/** Space Grotesk — data labels, metrics & price streams */
const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "Forge | Private Market & Pre-IPO Trading",
    template: "%s | Forge",
  },
  description:
    "Forge is the leading platform for trading private market stocks and pre-IPO shares. Access exclusive deals, real-time data, and institutional-grade execution.",
  keywords: [
    "private market",
    "pre-IPO",
    "stock trading",
    "secondary market",
    "private equity",
    "venture capital",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Forge",
    title: "Forge | Private Market & Pre-IPO Trading",
    description:
      "The leading platform for trading private market stocks and pre-IPO shares.",
  },
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={[
        plusJakartaSans.variable,
        inter.variable,
        spaceGrotesk.variable,
        "h-full antialiased",
      ].join(" ")}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
