"use client";

import { useEffect } from "react";
import { SectionMarker } from "@/components/ui/HairlineRule";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col justify-center px-6 py-16 md:px-10">
      <div className="mx-auto w-full max-w-350">
        <SectionMarker number="!" label="Something broke" />
        <h1 className="font-display mt-4 text-4xl md:text-6xl">This shelf gave way.</h1>
        <p className="mt-4 max-w-md text-sm text-ink-muted">
          An unexpected error occurred while rendering this page.
          {error.digest && <span className="block font-mono-label mt-2 text-[10px]">Ref: {error.digest}</span>}
        </p>
        <div className="mt-8">
          <button
            type="button"
            onClick={() => retry()}
            className="font-mono-label border-2 border-accent bg-accent px-5 py-2.5 text-xs font-medium text-accent-ink hover:bg-surface hover:text-accent"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}