import type { Metadata } from "next";
import { Noto_Serif_JP, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/PostHogProvider";

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-headline",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bankai — Discover Your Zanpakuto",
  description:
    "Every soul carries a blade. Answer the call of your spirit and unlock your Zanpakuto.",
  openGraph: {
    title: "Bankai — Discover Your Zanpakuto",
    description: "Every soul carries a blade. Find yours.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSerifJP.variable} ${spaceGrotesk.variable} ${geistMono.variable} antialiased bg-[#131313] text-[#e5e2e1]`}
        style={{ fontFamily: "var(--font-body)" }}
      >
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
