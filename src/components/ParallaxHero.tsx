// components/ParallaxHero.tsx
"use client";

import Image from "next/image";
import React from "react";

export default function ParallaxHero({
  img = "/photos/hero.jpg", // put your favorite portrait here
  title,
  subtitle,
}: {
  img?: string;
  title: string;
  subtitle?: string;
}) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setOffset(y * 0.25); // subtle parallax
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
      {/* Background image */}
      <div
        ref={ref}
        style={{ transform: `translateY(${offset * 0.5}px)` }}
        className="absolute inset-0 scale-105"
      >
        <Image
          src={img}
          alt="Birthday hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Title card */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="max-w-3xl text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg [text-wrap:balance]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 text-lg sm:text-xl text-white/90">{subtitle}</p>
          )}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/90 text-gray-800 px-4 py-2 shadow">
            🎉 You’re invited
          </div>
        </div>
      </div>

      {/* Soft wave divider */}
      <svg className="absolute bottom-[-1px] left-0 right-0 w-full" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden>
        <path fill="white" d="M0,64L80,69.3C160,75,320,85,480,101.3C640,117,800,139,960,144C1120,149,1280,139,1360,133.3L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"/>
      </svg>
    </header>
  );
}
