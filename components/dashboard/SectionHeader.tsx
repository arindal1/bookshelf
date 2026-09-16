import { SectionMarker } from "@/components/ui/HairlineRule";

export function SectionHeader({
  number,
  label,
  title,
}: {
  number: string;
  label: string;
  title: string;
}) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <SectionMarker number={number} label={label} />
      <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
    </div>
  );
}