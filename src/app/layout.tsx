import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Nav } from "@/components/Nav";
import { MotionProvider } from "@/components/MotionProvider";
import { RouteMemory } from "@/components/RouteMemory";
import { profile } from "@/content/profile";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Idan Pnuel - QA Engineer";
const description =
  "QA Engineer portfolio - test plans, automation frameworks, API/performance/security testing, and real case studies.";

// The link-preview image itself comes from `opengraph-image.tsx` (Next adds its tag); these keep the title,
// description and card type consistent for WhatsApp, LinkedIn, X and friends.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  openGraph: { title, description, siteName: title, type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: SITE_URL,
  sameAs: [profile.contact.linkedin, profile.contact.github].filter(Boolean),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <MotionProvider>
          <RouteMemory />
          <Nav />
          {children}
        </MotionProvider>
        <Analytics />
      </body>
    </html>
  );
}
