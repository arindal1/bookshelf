import { BookGrid } from "@/components/books/BookGrid";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { books, getShelvesByStatus } from "@/lib/mock-data";

export function ContinueReadingRail() {
  const reading = getShelvesByStatus("CURRENTLY_READING");
  const shelfBooks = reading
    .map((e) => books.find((b) => b.id === e.bookId))
    .filter((b): b is NonNullable<typeof b> => Boolean(b));

  if (shelfBooks.length === 0) return null;

  return (
    <section>
      <SectionHeader number="01" label="Continue" title="Pick up where you left off" />
      <BookGrid books={shelfBooks} showShelf />
    </section>
  );
}