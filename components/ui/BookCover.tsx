import { cn } from "@/lib/utils";

const TONE_MAP: Record<string, string> = {
  lime: "linear-gradient(180deg, #1a2410 0%, #0a0a0b 70%)",
  ink: "linear-gradient(180deg, #1c1c1f 0%, #0a0a0b 70%)",
  rust: "linear-gradient(180deg, #2a1710 0%, #0a0a0b 70%)",
  cold: "linear-gradient(180deg, #101a22 0%, #0a0a0b 70%)",
};

/**
 * Generated, art-directed "cover" — a duotone panel with the title set as
 * oversized display type. Deliberately not a stock photo (see
 * .github/skills/immersive-web-design SKILL.md §1 blacklist).
 */
export function BookCover({
  title,
  tone,
  className,
}: {
  title: string;
  tone: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-2/3 w-full items-end overflow-hidden border-2 border-line p-3",
        className
      )}
      style={{ backgroundImage: TONE_MAP[tone] ?? TONE_MAP.ink }}
    >
      <span className="font-display text-lg text-ink/90">{title}</span>
    </div>
  );
}