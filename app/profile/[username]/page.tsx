import { notFound } from "next/navigation";
import { BookGrid } from "@/components/books/BookGrid";
import { BioForm } from "@/components/profile/BioForm";
import { SectionMarker } from "@/components/ui/HairlineRule";
import { Tag } from "@/components/ui/Tag";
import { auth } from "@/lib/auth";
import { profile as demoProfile } from "@/lib/mock-data";
import { findUserByUsername } from "@/server/repositories/user-repository";
import { getCatalog } from "@/server/services/book-service";
import { getShelfMapForUser } from "@/server/services/shelf-service";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [user, session, { books, authors }] = await Promise.all([
    findUserByUsername(username),
    auth(),
    getCatalog(),
  ]);
  if (!user) notFound();

  const shelvesByBookId = await getShelfMapForUser(user.id);
  const shelfBooks = books.filter((b) => shelvesByBookId.has(b.id));

  const isOwnProfile = session?.user?.username === username;
  const favoriteGenres = username === demoProfile.username ? demoProfile.favoriteGenres : [];

  return (
    <div className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-350">
        <SectionMarker number="-" label="Profile" />
        <div className="mt-6 flex flex-col gap-6 border-2 border-line p-8 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-display text-4xl">{user.name ?? user.username}</h1>
            <p className="font-mono-label mt-1 text-xs text-ink-muted">@{user.username}</p>
            {isOwnProfile ? (
              <BioForm initialBio={user.bio ?? ""} />
            ) : (
              user.bio && (
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-ink-muted">{user.bio}</p>
              )
            )}
            {favoriteGenres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {favoriteGenres.map((g) => (
                  <Tag key={g}>{g}</Tag>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-14">
          <SectionMarker number="01" label="Public shelf" />
          <h2 className="font-display mt-3 mb-8 text-3xl">
            {shelfBooks.length > 0 ? "Shelf" : "No books shelved yet"}
          </h2>
          {shelfBooks.length > 0 && (
            <BookGrid books={shelfBooks} authors={authors} shelvesByBookId={shelvesByBookId} />
          )}
        </div>
      </div>
    </div>
  );
}