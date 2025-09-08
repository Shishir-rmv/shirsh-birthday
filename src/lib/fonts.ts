// src/lib/fonts.ts
import { Poppins, Dancing_Script } from "next/font/google";

// Dancing Script feels handwritten; swap to "Great_Vibes" or "Pacifico" if you prefer.
export const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const dancing = Dancing_Script({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-dancing",
});
