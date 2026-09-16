import { cn } from "@/lib/utils";

export function HairlineRule({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-line", className)} />;
}

export function SectionMarker({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-baseline gap-4">
      <span className="font-mono-label text-xs text-accent">{number}</span>
      <span className="font-mono-label text-xs text-ink-muted">{label}</span>
    </div>
  );
}