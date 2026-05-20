import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-doc",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CV Builder",
  description: "Build ATS-friendly CVs in three themes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-ivory text-ink">{children}</body>
    </html>
  );
}