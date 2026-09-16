import { BookGrid } from "@/components/books/BookGrid";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { books, getShelvesByStatus } from "@/lib/mock-data";
import type { ShelfStatus } from "@/types";

const BOARDS: { status: ShelfStatus; label: string }[] = [
  { status: "CURRENTLY_READING", label: "Currently reading" },
  { status: "WANT_TO_READ", label: "Want to read" },
  { status: "ON_HOLD", label: "On hold" },
  { status: "FINISHED", label: "Finished" },
];

export function ShelfBoard() {
  return (
    <div className="space-y-14">
      {BOARDS.map((board, i) => {
        const entries = getShelvesByStatus(board.status);
        if (entries.length === 0) return null;
        const shelfBooks = entries
          .map((e) => books.find((b) => b.id === e.bookId))
          .filter((b): b is NonNullable<typeof b> => Boolean(b));

        return (
          <section key={board.status}>
            <SectionHeader
              number={String(i + 1).padStart(2, "0")}
              label="Shelf"
              title={board.label}
            />
            <BookGrid books={shelfBooks} showShelf />
          </section>
        );
      })}
    </div>
  );
}