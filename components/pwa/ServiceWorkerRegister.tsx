"use client";

import { useEffect } from "react";

/** Registers the offline-fallback service worker (see public/sw.js). */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failures shouldn't block the app from rendering.
      });
    }
  }, []);

  return null;
}