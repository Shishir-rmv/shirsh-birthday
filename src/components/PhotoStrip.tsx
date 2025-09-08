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
  // single source of truth
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const openAt = (i: number) => setLightboxIndex(i);
  const close = () => setLightboxIndex(null);

  return (
    <section className="px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="h-heading mb-3">Moments</h2>
        <p className="text-sm text-gray-600 mb-4">
          A few pictures of our little star ✨ (tap to view)
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {photos.map((p, i) => (
            <button
              key={i}
              onClick={() => openAt(i)}
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

      {/* render when there's a selected index */}
      {lightboxIndex !== null && (
        <Lightbox
          open
          index={lightboxIndex}
          close={close}
          slides={photos.map((p) => ({ src: p.src }))}
          carousel={{ finite: false }} // loop
        />
      )}
    </section>
  );
}
