import type { Metadata } from "next";
import { Instrument_Serif, Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import localFont from "next/font/local";
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
const sourceSerif = Source_Serif_4({
  variable: "--font-doc",
  subsets: ["latin"],
});
const libreCaslon = localFont({
  src: [
    { path: "../public/fonts/LibreCaslonText-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/LibreCaslonText-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/fonts/LibreCaslonText-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-caslon",
});
const inter = localFont({
  src: [
    { path: "../public/fonts/Inter-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Inter-Italic.ttf", weight: "400", style: "italic" },
    { path: "../public/fonts/Inter-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Inter-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/Inter-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/Inter-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../public/fonts/Inter-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-inter",
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
      className={`${instrumentSerif.variable} ${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${libreCaslon.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans bg-ivory text-ink">{children}</body>
    </html>
  );
}