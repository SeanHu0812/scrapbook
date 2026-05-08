import type { Metadata, Viewport } from "next";
import { Patrick_Hand, Caveat, Gaegu } from "next/font/google";
import "./globals.css";

const patrick = Patrick_Hand({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patrick",
  display: "swap",
});

const caveat = Caveat({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const gaegu = Gaegu({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gaegu",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Scrapbook — collect little moments, together",
  description:
    "A private shared memory app for couples and close friends. Cozy hand-drawn scrapbook style.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FFF9EF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${patrick.variable} ${caveat.variable} ${gaegu.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
