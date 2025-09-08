// components/PhotoStrip.tsx
"use client";

import Image from "next/image";
import React from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function PhotoStrip({
  photos = [],
}: {
  photos: { src: string; alt?: string }[];
}) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  return (
    <section className="relative px-6">
      {/* Mobile-friendly soft top gradient to lift text over dark photos */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/35 to-transparent sm:hidden" />

      <div className="max-w-4xl mx-auto">
        {/* 🔑 Force light text here */}
        <h2 className="h-heading mb-3 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,.5)]">
          Moments
        </h2>
        <p className="text-sm text-white/85 mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,.5)]">
          A few pictures of our little star ✨ (tap to view)
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => setLightboxIndex(i)}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow bg-gray-100 group focus:outline-none"
            >
              <Image
                src={p.src}
                alt={p.alt || "photo"}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          open
          index={lightboxIndex}
          close={() => setLightboxIndex(null)}
          slides={photos.map((p) => ({ src: p.src }))}
          carousel={{ finite: false }}
        />
      )}
    </section>
  );
}
