"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Author photo with graceful fallback: renders nothing (letting the
 * initials-free text-only layout stand) if no `src` is given or the image
 * fails to load, instead of a broken-image icon.
 */
export function AuthorPhoto({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- arbitrary
    // external hosts from DB content; see BookCover for the same rationale.
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={cn("h-16 w-16 border-2 border-line object-cover grayscale contrast-125", className)}
    />
  );
}