"use client";

import Image from "next/image";
import React from "react";

export default function Lightbox({
  photos,
  index,
  onClose,
}: {
  photos: { src: string; alt?: string }[];
  index: number;
  onClose: () => void;
}) {
  const [i, setI] = React.useState(index);
  const len = photos.length;

  React.useEffect(() => setI(index), [index]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((v) => (v + 1) % len);
      if (e.key === "ArrowLeft") setI((v) => (v - 1 + len) % len);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [len, onClose]);

  const prev = () => setI((v) => (v - 1 + len) % len);
  const next = () => setI((v) => (v + 1) % len);

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <button aria-label="Close" onClick={onClose} className="absolute top-4 right-4 text-white/90 text-2xl">✕</button>

      <button aria-label="Previous" onClick={prev} className="absolute left-3 sm:left-6 text-white/90 text-3xl px-3 py-2">‹</button>
      <button aria-label="Next" onClick={next} className="absolute right-3 sm:right-6 text-white/90 text-3xl px-3 py-2">›</button>

      <div className="relative w-[90vw] h-[70vh] max-w-5xl rounded-2xl overflow-hidden shadow-2xl">
        <Image
          key={photos[i].src}
          src={photos[i].src}
          alt={photos[i].alt || "photo"}
          fill
          sizes="100vw"
          className="object-contain"
          priority
        />
      </div>

      <div className="absolute bottom-6 text-white/80 text-sm">{i + 1} / {len}</div>
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
    </div>
  );
}
