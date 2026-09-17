import { BookCard } from "@/components/books/BookCard";
import type { Author, Book, ShelfEntry } from "@/types";

export function BookGrid({
  books,
  authors,
  shelvesByBookId,
}: {
  books: Book[];
  authors: Author[];
  shelvesByBookId?: Map<string, ShelfEntry>;
}) {
  const authorsById = new Map(authors.map((a) => [a.id, a]));

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          author={authorsById.get(book.authorId)}
          shelf={shelvesByBookId?.get(book.id)}
        />
      ))}
    </div>
  );
}