import { cn } from "@/lib/utils";

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "font-mono-label inline-block border border-line px-2 py-1 text-[10px] text-ink-muted",
        className
      )}
    >
      {children}
    </span>
  );
}