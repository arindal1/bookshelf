import localFont from "next/font/local";

// Self-hosted (latin-subset variable woff2) instead of next/font/google: this
// build environment's Node TLS stack gets reset connecting to
// fonts.googleapis.com (proxy/DPI interference — confirmed via direct fetch
// test), even though the same host is reachable outside Node. Self-hosting
// also removes an external network dependency from the production build.
export const display = localFont({
  src: "./fonts/space-grotesk-variable.ttf",
  variable: "--font-display",
  weight: "500 700",
  display: "swap",
});

export const text = localFont({
  src: "./fonts/inter-tight-variable.ttf",
  variable: "--font-text",
  weight: "400 600",
  display: "swap",
});

export const mono = localFont({
  src: "./fonts/jetbrains-mono-variable.ttf",
  variable: "--font-mono",
  weight: "400 500",
  display: "swap",
});