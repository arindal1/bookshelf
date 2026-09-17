"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const TONE_MAP: Record<string, string> = {
  lime: "linear-gradient(180deg, #1a2410 0%, #0a0a0b 70%)",
  ink: "linear-gradient(180deg, #1c1c1f 0%, #0a0a0b 70%)",
  rust: "linear-gradient(180deg, #2a1710 0%, #0a0a0b 70%)",
  cold: "linear-gradient(180deg, #101a22 0%, #0a0a0b 70%)",
};

/**
 * Book cover: renders the real cover image (if a valid `src` is provided and
 * loads successfully), duotone-treated and scrimmed to match the brutalist
 * design system. Falls back to the generated gradient panel - used when no
 * `src` is given, or if the remote image fails to load (broken URL, dead
 * host, etc.) - so a bad cover URL never renders a broken-image icon.
 */
export function BookCover({
  title,
  tone,
  src,
  className,
}: {
  title: string;
  tone: string;
  src?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative flex aspect-2/3 w-full items-end overflow-hidden border-2 border-line p-3",
        className
      )}
      style={!showImage ? { backgroundImage: TONE_MAP[tone] ?? TONE_MAP.ink } : undefined}
    >
      {showImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary
              external hosts from DB content; next/image would need every
              host allow-listed up front, so a plain img with a graceful
              onError fallback is the safer/simpler fit here. */}
          <img
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover grayscale-[70%] contrast-125"
          />
          <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0b] via-[#0a0a0b]/10 to-transparent" />
        </>
      )}
      <span className="relative font-display text-lg text-ink/90">{title}</span>
    </div>
  );
}