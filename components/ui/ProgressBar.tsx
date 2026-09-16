import { cn } from "@/lib/utils";

export function ProgressBar({
  percent,
  className,
  showLabel = true,
}: {
  percent: number;
  className?: string;
  showLabel?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, percent));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-1 flex-1 bg-line">
        <div
          className="h-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="font-mono-label text-[10px] tabular-nums text-ink-muted">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}