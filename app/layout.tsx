import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-syne",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "WaveClubs Open — Morocco Surf Competition Series 2026/2027",
  description:
    "Register for the WaveClubs Open surf competition series. Four stops across Morocco's Atlantic coastline. Open, Women's, Junior, and Business Cup categories.",
  openGraph: {
    title: "WaveClubs Open — Morocco Surf Competition Series 2026/2027",
    description:
      "Four stops, three categories, one Business Cup. Open to every surfer and every surf school.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${syne.variable} ${dmSans.variable} font-sans min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
