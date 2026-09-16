"use client";

import dynamic from "next/dynamic";
import { GrainOverlay } from "@/components/visual/GrainOverlay";
import { CursorDot } from "@/components/visual/CursorDot";

const GLBackground = dynamic(
  () => import("@/components/visual/GLBackground").then((m) => m.GLBackground),
  { ssr: false }
);

/** Mounts all global visual chrome once, kept out of the RSC tree. */
export function VisualChrome() {
  return (
    <>
      <GLBackground />
      <GrainOverlay />
      <CursorDot />
    </>
  );
}