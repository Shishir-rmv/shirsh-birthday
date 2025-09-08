import ParallaxHeroLayers from "@/components/ParallaxHeroLayers";
import PhotoStrip from "@/components/PhotoStrip";
import InviteForm from "@/components/InviteForm";
import ArchedTitle from "@/components/ArchedTitle";

const PARTY = {
  kidName: "Shirsh",
  turning: 3,
  dateLabel: "Sunday, 21 September 2025",
  timeLabel: "12:30 PM – 3:30 PM (Lunch)",
  venueName: "Asia Alive - DoubleTree Suites by Hilton",
  venueAddress: "Iblur Gate, Outer Ring Road Marathahalli-Bellandur-Sarjapur Outer Ring Road, Bengaluru, Karnataka 560102",
  mapsUrl: "https://maps.app.goo.gl/NDqFC3Mgv1wrLtDZ8",
};

export default function Page() {
  return (
    <main className="min-h-screen">
      <ParallaxHeroLayers
        bg={{ src: "/photos/bg-soft.jpg", speed: 0.15 }}
        bgConfetti={{ src: "/photos/confetti1.png", speed: 0.22 }}   // BEHIND cutout
        subject={{ src: "/photos/hero-cutout.png", speed: 0.25 }}
        fgConfetti={{ src: "/photos/confetti2.png", speed: 0.38 }}   // ABOVE cutout (masked)

        title={
          <ArchedTitle
            text="Shirsh turns 3!"
            spread={680}
            baseY={180}
            arcHeight={120}
            fill="#fff"
            stroke="rgba(0,0,0,0.35)"
            align="center"
            shadow
          />
        }
        subtitle={`${PARTY.dateLabel} • ${PARTY.timeLabel}`}

        // Position the hole over your son (center/bottom-ish)
        holeX="50%"      // x-position of hole center
        holeY="78%"      // y-position of hole center
        holeInner={220}  // fully clear radius in px
        holeFeather={40} // feather for soft edge in px
      />
      
      <section className="px-6 -mt-14 sm:-mt-20 relative z-10">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8">
            <h2 className="h-heading mb-4">Details</h2>
            <ul className="space-y-3 text-gray-700">
              <li>📅 <strong>{PARTY.dateLabel}</strong></li>
              <li>🕰️ {PARTY.timeLabel}</li>
              <li>📍 {PARTY.venueName}</li>
              <li className="text-sm text-gray-600">{PARTY.venueAddress}</li>
              <li>
                <a className="text-indigo-600 underline" href={PARTY.mapsUrl} target="_blank">Open in Google Maps</a>
              </li>
            </ul>
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <blockquote className="text-gray-700 text-sm bg-gradient-to-br from-indigo-50 to-pink-50 border border-indigo-100 rounded-2xl p-4">
              We’d love your RSVP to plan food & seating comfortably. Thank you! 🙏
            </blockquote>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 md:p-8">
            <h2 className="h-heading mb-4">RSVP</h2>
            <InviteForm />
          </div>
        </div>
      </section>

      <div className="mt-10 sm:mt-14 space-y-10">
        <PhotoStrip
          photos={[
            { src: "/photos/1.jpg" },
            { src: "/photos/2.jpg" },
            { src: "/photos/3.jpg" },
            { src: "/photos/4.jpg" },
            { src: "/photos/5.jpg" },
            { src: "/photos/6.jpg" },
          ]}
        />
      </div>

      <div className="h-16" />
    </main>
  );
}
