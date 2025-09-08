// ArchedTitle.tsx
"use client";
import React from "react";
import { dancing } from "@/lib/fonts";

type Props = {
  text: string;
  spread?: number;      // logical width for the arc path
  baseY?: number;       // baseline Y
  arcHeight?: number;   // arch height (+up, -down)
  letterSpacing?: number;
  stroke?: string;
  fill?: string;
  shadow?: boolean;
  align?: "center" | "left" | "right";
  viewPad?: number;     // EXTRA GUTTER on both sides of the viewBox
};

export default function ArchedTitle({
  text,
  spread = 640,
  baseY = 180,
  arcHeight = 120,
  letterSpacing = 0.02,
  stroke = "rgba(0,0,0,0.35)",
  fill = "#ffffff",
  shadow = true,
  align = "center",
  viewPad = 140,        // 👈 generous gutters
}: Props) {
  const pathId = React.useId();

  const margin = Math.max(64, Math.floor(spread * 0.08));
  const x0 = margin;
  const x1 = spread - margin;
  const cx = spread / 2;
  const cy = baseY - arcHeight;

  const d = `M ${x0} ${baseY} Q ${cx} ${cy} ${x1} ${baseY}`;

  const startOffset = align === "center" ? "50%" : align === "left" ? "0%" : "100%";
  const textAnchor  = align === "center" ? "middle" : align === "left" ? "start" : "end";

  return (
    <div className="mx-auto w-full flex justify-center"> 
        <defs>
          <path id={pathId} d={d} fill="none" />
          {shadow && (
            <filter id={`${pathId}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,.35)" />
            </filter>
          )}
        </defs>

        <text
          className={dancing.className}
          style={{ fontSize: "clamp(20px, 9vw, 80px)" }} // BIG on phones too
          fontWeight={700}
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          paintOrder="stroke fill"
          letterSpacing={`${letterSpacing}em`}
          filter={shadow ? `url(#${pathId}-shadow)` : undefined}
        >
          <textPath href={`#${pathId}`} startOffset={startOffset} textAnchor={textAnchor}>
            {text}
          </textPath>
        </text>
    </div>
  );
}
