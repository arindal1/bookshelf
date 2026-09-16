import { BookCard } from "@/components/books/BookCard";
import { getAuthorById, getShelfForBook } from "@/lib/mock-data";
import type { Book } from "@/types";

export function BookGrid({ books, showShelf = false }: { books: Book[]; showShelf?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          author={getAuthorById(book.authorId)}
          shelf={showShelf ? getShelfForBook(book.id) : undefined}
        />
      ))}
    </div>
  );
}