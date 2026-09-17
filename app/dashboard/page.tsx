import { ContinueReadingRail } from "@/components/dashboard/ContinueReadingRail";
import { ShelfBoard } from "@/components/dashboard/ShelfBoard";
import { SectionMarker } from "@/components/ui/HairlineRule";
import { auth } from "@/lib/auth";
import { profile } from "@/lib/mock-data";

export default async function DashboardPage() {
  const session = await auth();
  const displayName = session?.user?.name ?? profile.name;

  return (
    <div className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-350 space-y-16">
        <div>
          <SectionMarker number="-" label="Dashboard" />
          <h1 className="font-display mt-4 text-4xl md:text-5xl">
            Welcome back, {displayName.split(" ")[0]}
          </h1>
        </div>
        <ContinueReadingRail />
        <ShelfBoard />
      </div>
    </div>
  );
}