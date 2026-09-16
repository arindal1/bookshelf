import { SectionMarker } from "@/components/ui/HairlineRule";

export const metadata = {
  title: "Offline — Bookshelf",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col justify-center px-6 py-16 md:px-10">
      <div className="mx-auto w-full max-w-350">
        <SectionMarker number="—" label="Offline" />
        <h1 className="font-display mt-4 text-4xl md:text-6xl">No connection.</h1>
        <p className="mt-4 max-w-md text-sm text-ink-muted">
          Bookshelf couldn&apos;t reach the network. Reconnect and reload to keep reading.
        </p>
      </div>
    </div>
  );
}