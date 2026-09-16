"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="en" className="h-full">
      <body
        className="flex min-h-full flex-col items-center justify-center gap-4 px-6 text-center"
        style={{ background: "#0a0a0b", color: "#f2efe9", fontFamily: "system-ui, sans-serif" }}
      >
        <p style={{ fontSize: "0.7rem", letterSpacing: "0.08em", color: "#c6f84e", textTransform: "uppercase" }}>
          Critical error
        </p>
        <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>The app failed to load.</h1>
        <p style={{ maxWidth: 420, color: "#8b8b90", fontSize: "0.875rem" }}>
          {error.digest ? `Ref: ${error.digest}` : "An unexpected error occurred."}
        </p>
        <button
          type="button"
          onClick={() => retry()}
          style={{
            border: "2px solid #c6f84e",
            background: "#c6f84e",
            color: "#0a0a0b",
            padding: "0.6rem 1.25rem",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}