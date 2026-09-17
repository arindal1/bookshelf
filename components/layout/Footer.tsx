import { HairlineRule } from "@/components/ui/HairlineRule";

export function Footer() {
  return (
    <footer className="mt-auto border-t-2 border-line">
      <div className="mx-auto max-w-350 px-6 py-10 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-display text-2xl">BOOKSHELF</p>
            <p className="font-mono-label mt-2 text-[10px] text-ink-muted">
              A LIBRARY THAT REMEMBERS WHERE YOU STOPPED
            </p>
          </div>
          <div className="font-mono-label flex gap-6 text-[10px] text-ink-muted">
            <span>© 2026</span>
            <span>BUILT ON NEXT.JS</span>
            <span>Arindal Char</span>
          </div>
        </div>
        <HairlineRule className="mt-8" />
      </div>
    </footer>
  );
}