"use client";

import React from "react";

type Props = {
  backSrc: string;   // e.g. "/photos/confetti1.png"
  frontSrc: string;  // e.g. "/photos/confetti2.png" (can be same as back)
  backSpeed?: number;   // smaller = slower
  frontSpeed?: number;  // larger = faster
  backOpacity?: number;
  frontOpacity?: number;
  tileSize?: number;    // px size of the repeating tile
};

export default function SiteConfettiBackground({
  backSrc,
  frontSrc,
  backSpeed = 0.05,
  frontSpeed = 0.12,
  backOpacity = 0.25,
  frontOpacity = 0.35,
  tileSize = 600,
}: Props) {
  const backRef = React.useRef<HTMLDivElement>(null);
  const frontRef = React.useRef<HTMLDivElement>(null);
  const reduceMotion = React.useRef(false);

  React.useEffect(() => {
    // Respect prefers-reduced-motion
    reduceMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  React.useEffect(() => {
    if (reduceMotion.current) return;

    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY;
      // Use backgroundPosition for parallax without layout thrash
      if (backRef.current) {
        backRef.current.style.backgroundPosition = `0px ${y * backSpeed}px`;
      }
      if (frontRef.current) {
        frontRef.current.style.backgroundPosition = `0px ${y * frontSpeed}px`;
      }
    };
    const onScrollRAF = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(onScroll);
    };

    onScroll(); // initial
    window.addEventListener("scroll", onScrollRAF, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollRAF);
      cancelAnimationFrame(raf);
    };
  }, [backSpeed, frontSpeed]);

  const layerBase =
    "pointer-events-none fixed inset-0 -z-10 will-change-transform";

  return (
    <>
      {/* BACK layer (slow) */}
      <div
        ref={backRef}
        aria-hidden
        className={layerBase}
        style={{
          backgroundImage: `url(${backSrc})`,
          backgroundRepeat: "repeat",
          backgroundSize: `${tileSize}px ${tileSize}px`,
          opacity: backOpacity,
          mixBlendMode: "normal", // or "screen" if you like it brighter
        }}
      />
      {/* FRONT layer (faster) */}
      <div
        ref={frontRef}
        aria-hidden
        className={layerBase}
        style={{
          backgroundImage: `url(${frontSrc})`,
          backgroundRepeat: "repeat",
          backgroundSize: `${tileSize}px ${tileSize}px`,
          opacity: frontOpacity,
          mixBlendMode: "normal",
        }}
      />
    </>
  );
}
