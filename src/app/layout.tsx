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
    default: "Forge Capital | High-Growth Fixed Savings & Capital Accumulation",
    template: "%s | Forge Capital",
  },
  description:
    "Forge Capital empowers individuals to turn small capital into significant wealth through disciplined fixed-term savings, compound growth plans, and multi-asset yield infrastructure.",
  keywords: [
    "high-growth savings",
    "fixed-term savings",
    "capital accumulation",
    "compound interest",
    "wealth simulation",
    "digital assets",
    "forge capital",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Forge Capital",
    title: "Forge Capital | High-Growth Fixed Savings & Capital Accumulation",
    description:
      "Turn small capital into significant wealth through disciplined fixed-term savings and guaranteed compound yields.",
  },
  icons: {
    icon: [
      { url: "/FRGE.png", sizes: "any" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/FRGE.png",
    apple: "/FRGE.png",
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
