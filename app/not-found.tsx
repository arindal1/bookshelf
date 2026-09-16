import Link from "next/link";
import { SectionMarker } from "@/components/ui/HairlineRule";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col justify-center px-6 py-16 md:px-10">
      <div className="mx-auto w-full max-w-350">
        <SectionMarker number="404" label="Not found" />
        <h1 className="font-display mt-4 text-5xl md:text-7xl">Page missing.</h1>
        <p className="mt-4 max-w-md text-sm text-ink-muted">
          There&apos;s no shelf at this address. It may have been moved, renamed, or never existed.
        </p>
        <div className="mt-8">
          <Link
            href="/"
            className="font-mono-label inline-flex items-center justify-center border-2 border-accent bg-accent px-5 py-2.5 text-xs font-medium text-accent-ink hover:bg-surface hover:text-accent"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}