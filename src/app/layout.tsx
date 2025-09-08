import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteConfettiBackground from "@/components/SiteConfettiBackground";


import { poppins, dancing } from "@/lib/fonts";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Birthday Invite",
  description: "Join us to celebrate!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${dancing.variable} font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50 to-indigo-50`}>
        {/* Site-wide parallax confetti background */}
        <SiteConfettiBackground
          backSrc="/photos/confetti1.png"
          frontSrc="/photos/confetti2.png"
          backSpeed={0.06}
          frontSpeed={0.14}
          backOpacity={0.22}
          frontOpacity={0.32}
          tileSize={560} // adjust based on your PNG's density
        />

        {/* All your content stays above */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
