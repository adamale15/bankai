import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/providers/PostHogProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}>
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
