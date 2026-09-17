import Link from "next/link";
import { BookCover } from "@/components/ui/BookCover";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { Author, Book, ShelfEntry } from "@/types";

const STATUS_LABEL: Record<ShelfEntry["status"], string> = {
  WANT_TO_READ: "Want to read",
  CURRENTLY_READING: "Reading",
  FINISHED: "Finished",
  RE_READING: "Re-reading",
  ON_HOLD: "On hold",
  DROPPED: "Dropped",
};

export function BookCard({
  book,
  author,
  shelf,
}: {
  book: Book;
  author?: Author;
  shelf?: ShelfEntry;
}) {
  return (
    <Link
      href={`/books/${book.slug}`}
      className="group block border-2 border-line p-3 transition-none hover:border-accent"
    >
      <BookCover title={book.title} tone={book.coverTone} src={book.coverImage} />
      <div className="mt-3 space-y-1">
        <p className="font-display text-base leading-tight group-hover:text-accent">{book.title}</p>
        <p className="font-mono-label text-[10px] text-ink-muted">{author?.name ?? "Unknown author"}</p>
        {shelf && (
          <div className="pt-2">
            <p className="font-mono-label pb-1 text-[10px] text-ink-muted">
              {STATUS_LABEL[shelf.status]}
            </p>
            <ProgressBar percent={shelf.progressPercent} />
          </div>
        )}
      </div>
    </Link>
  );
}