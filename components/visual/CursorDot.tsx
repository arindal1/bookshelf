"use client";

import { useEffect, useRef } from "react";

/** Hard-edged brutalist cursor dot; snaps rather than glides. Desktop-only. */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;
    const el = ref.current;
    if (!el) return;

    const move = (e: PointerEvent) => {
      el.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-100 hidden h-2 w-2 bg-accent md:block"
    />
  );
}