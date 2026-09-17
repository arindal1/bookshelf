import { SectionMarker } from "@/components/ui/HairlineRule";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
      <div className="mb-10">
        <SectionMarker number="-" label="Bookshelf" />
      </div>
      {children}
    </div>
  );
}