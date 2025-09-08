"use client";

import Image from "next/image";
import React from "react";

type Layer = { src: string; speed?: number; alt?: string; className?: string };

export default function ParallaxHeroLayers({
  height = "h-[90vh] min-h-[460px]",
  bg,                   // slowest backdrop (blur/gradient/photo)
  bgConfetti,           // behind subject
  subject,              // your son's cutout (transparent PNG)
  fgConfetti,           // above subject (with mask hole)
  title,
  subtitle,

  // mask hole (foreground confetti)
  holeX = "50%",        // 0%-100% or px (center X)
  holeY = "78%",        // 0%-100% or px (center Y)
  holeInner = 200,      // inner fully transparent radius (px)
  holeFeather = 30,     // feather size (px) for soft edge
}: {
  height?: string;
  bg: Layer;
  bgConfetti?: Layer;
  subject: Layer;
  fgConfetti?: Layer;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  holeX?: string | number;
  holeY?: string | number;
  holeInner?: number;
  holeFeather?: number;
}) {
  const [y, setY] = React.useState(0);
  React.useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const spd = (v?: number) => (typeof v === "number" ? v : 0.25);

  const layerStyle = (speed?: number) =>
    ({
      transform: `translateY(${y * spd(speed)}px)`,
      willChange: "transform",
    } as React.CSSProperties);

  // Build mask gradient for the foreground confetti
  // Transparent hole from 0..inner, then fade to visible by inner+feather.
  const outer = holeInner + holeFeather;
  const toUnit = (v: string | number) => (typeof v === "number" ? `${v}px` : v);
  const maskValue = `radial-gradient(circle at ${toUnit(holeX)} ${toUnit(
    holeY
  )}, transparent 0 ${holeInner}px, black ${outer}px)`;

  return (
    <header className={`relative w-full overflow-hidden ${height}`}>
      {/* Background image */}
      <div className="absolute inset-0 scale-105" style={layerStyle(bg.speed)}>
        <Image src={bg.src} alt={bg.alt || "bg"} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Background confetti (behind subject) */}
      {bgConfetti && (
        <div
          className={`absolute inset-0 ${bgConfetti.className || ""}`}
          style={layerStyle(bgConfetti.speed)}
          aria-hidden
        >
          <Image
            src={bgConfetti.src}
            alt={bgConfetti.alt || "confetti back"}
            fill
            className="object-cover opacity-90 mix-blend-screen"
          />
        </div>
      )}

      {/* Subject (your son’s cutout) */}
      <div className="absolute inset-0 flex items-end justify-center" style={layerStyle(subject.speed)}>
        {/* Give the container a real height via aspect ratio */}
        <div className="relative aspect-[2/3] w-[360px] sm:w-[360px] md:w-[460px]">
            <Image
            src={subject.src}            // e.g., "/photos/hero-cutout.png"
            alt={subject.alt || "hero"}
            fill
            className="object-contain drop-shadow-2xl"
            priority
            />
        </div>
        </div>

      {/* Foreground confetti (masked hole so it avoids the cutout) */}
      {fgConfetti && (
        <div
          className={`absolute inset-0 pointer-events-none ${fgConfetti.className || ""}`}
          style={{
            ...layerStyle(fgConfetti.speed),
            maskImage: maskValue,
            WebkitMaskImage: maskValue,
          }}
          aria-hidden
        >
          <Image
            src={fgConfetti.src}
            alt={fgConfetti.alt || "confetti front"}
            fill
            className="object-cover opacity-95 mix-blend-screen"
          />
        </div>
      )}

      {/* Title / subtitle */}
      <div className="relative z-10 h-full px-6">
            <div
                className="
                    absolute 
                    left-1/2 
                    -translate-x-1/2 
                    text-center 
                    text-white 
                    drop-shadow-[0_4px_18px_rgba(0,0,0,.45)] 
                    w-[90vw] max-w-[1400px]   /* wide enough */
                "
                >
                {title}
                {subtitle && (
                <p className="mt-2 text-sm sm:text-lg md:text-xl text-white/90">
                    {subtitle}
                </p>
                )}
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/85 backdrop-blur px-4 py-1.5 text-gray-800 shadow">
                🎉 You’re invited
                </div>
            </div>
        </div>  

      {/* Wave divider */}
      <svg
        className="absolute left-0 right-0 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="white"
          d="M0,64L80,69.3C160,75,320,85,480,101.3C640,117,800,139,960,144C1120,149,1280,139,1360,133.3L1440,128L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
        />
      </svg>
    </header>
  );
}
