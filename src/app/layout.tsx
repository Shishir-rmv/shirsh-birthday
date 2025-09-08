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
  title: "Shirsh’s 3rd Birthday 🎉",
  description: "Join us on 21st September 2025 for a fun lunch party!",
  openGraph: {
    title: "Shirsh’s 3rd Birthday 🎉",
    description: "Lunch party • 21 Sep 2025 • 12:30–3:30 pm",
    url: "https://shirsh-birthday.vercel.app/", // 👈 update with your deployed URL
    siteName: "Shirsh’s Birthday Invite",
    images:
      {
        url: "https://shirsh-birthday.vercel.app/canva-invite.webp", // 👈 see below
        width: 200,
        height: 200,
        alt: "Shirsh’s Birthday Invite",
      },
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shirsh’s 3rd Birthday 🎉",
    description: "Join us for lunch on 21 Sep 2025!",
    images: ["https://shirsh-birthday.vercel.app/canva-invite.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${dancing.variable} font-sans bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-50 to-indigo-50`}
      style={{ colorScheme: "light" }}
      >
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
        <div className="relative z-10 isolate text-black">
          {children}
        </div>
      </body>
    </html>
  );
}
