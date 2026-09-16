import { notFound } from "next/navigation";
import { BookGrid } from "@/components/books/BookGrid";
import { SectionMarker } from "@/components/ui/HairlineRule";
import { Tag } from "@/components/ui/Tag";
import { books, profile } from "@/lib/mock-data";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  if (username !== profile.username) notFound();

  return (
    <div className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-350">
        <SectionMarker number="—" label="Profile" />
        <div className="mt-6 flex flex-col gap-6 border-2 border-line p-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-4xl">{profile.name}</h1>
            <p className="font-mono-label mt-1 text-xs text-ink-muted">@{profile.username}</p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-muted">{profile.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.favoriteGenres.map((g) => (
                <Tag key={g}>{g}</Tag>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14">
          <SectionMarker number="01" label="Public shelf" />
          <h2 className="font-display mt-3 mb-8 text-3xl">All books</h2>
          <BookGrid books={books} showShelf />
        </div>
      </div>
    </div>
  );
}