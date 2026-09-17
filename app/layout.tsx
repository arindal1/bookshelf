import type { Metadata, Viewport } from "next";
import { display, text, mono } from "@/app/fonts";
import { Providers } from "@/components/Providers";
import { VisualChrome } from "@/components/visual/VisualChrome";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { siteUrl } from "@/lib/utils";
import "./globals.css";

const title = "Bookshelf";
const description = "A personal digital library - read, track, and discover books in the browser.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: `%s - ${title}` },
  description,
  applicationName: title,
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: title,
    title,
    description,
    url: siteUrl,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${text.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <VisualChrome />
          <ServiceWorkerRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}