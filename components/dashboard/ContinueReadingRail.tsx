import { BookGrid } from "@/components/books/BookGrid";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { auth } from "@/lib/auth";
import { getCatalog } from "@/server/services/book-service";
import { getShelvesByStatusForUser } from "@/server/services/shelf-service";

export async function ContinueReadingRail() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const reading = await getShelvesByStatusForUser(session.user.id, "CURRENTLY_READING");
  if (reading.length === 0) return null;

  const { books, authors } = await getCatalog();
  const shelvesByBookId = new Map(reading.map((s) => [s.bookId, s]));
  const shelfBooks = books.filter((b) => shelvesByBookId.has(b.id));

  if (shelfBooks.length === 0) return null;

  return (
    <section>
      <SectionHeader number="01" label="Continue" title="Pick up where you left off" />
      <BookGrid books={shelfBooks} authors={authors} shelvesByBookId={shelvesByBookId} />
    </section>
  );
}