import { BookGrid } from "@/components/books/BookGrid";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { auth } from "@/lib/auth";
import { getCatalog } from "@/server/services/book-service";
import { getShelfMapForUser } from "@/server/services/shelf-service";
import type { ShelfStatus } from "@/types";

const BOARDS: { status: ShelfStatus; label: string }[] = [
  { status: "CURRENTLY_READING", label: "Currently reading" },
  { status: "WANT_TO_READ", label: "Want to read" },
  { status: "ON_HOLD", label: "On hold" },
  { status: "FINISHED", label: "Finished" },
];

export async function ShelfBoard() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const [{ books, authors }, shelvesByBookId] = await Promise.all([
    getCatalog(),
    getShelfMapForUser(session.user.id),
  ]);

  return (
    <div className="space-y-14">
      {BOARDS.map((board, i) => {
        const shelfBooks = books.filter((b) => shelvesByBookId.get(b.id)?.status === board.status);
        if (shelfBooks.length === 0) return null;

        return (
          <section key={board.status}>
            <SectionHeader
              number={String(i + 1).padStart(2, "0")}
              label="Shelf"
              title={board.label}
            />
            <BookGrid books={shelfBooks} authors={authors} shelvesByBookId={shelvesByBookId} />
          </section>
        );
      })}
    </div>
  );
}