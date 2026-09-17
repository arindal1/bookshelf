import { generateBookPages } from "@/lib/mock-data";
import {
  findAllAuthors,
  findAllBooks,
  findAuthorById,
  findBookById,
  findBookBySlug,
  findBookPagesByBookId,
} from "@/server/repositories/book-repository";
import type { Author, Book, BookPage } from "@/types";

// Book/Author/BookPage domain is Prisma-backed (see docs/DECISIONS.md ADR-009,
// superseding the book portion of ADR-002). The Prisma `Book` model doesn't
// carry `tags` / `coverTone` / `readingTimeMinutes` - those were UI-only
// concerns invented for the mock-data phase and never modeled as columns.
// Rather than a schema migration, this layer derives stable, deterministic
// values for them from real columns so any Book row pushed to the DB renders
// correctly without further setup.
//
// Row types are inferred from the repository return values (rather than
// imported from `@prisma/client`) so this file type-checks even before
// `npx prisma generate` has produced the model types locally.
type PrismaBook = Awaited<ReturnType<typeof findBookById>> & {};
type PrismaAuthor = Awaited<ReturnType<typeof findAuthorById>> & {};

const COVER_TONES = ["ink", "lime", "rust", "cold"] as const;

function deriveCoverTone(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return COVER_TONES[hash % COVER_TONES.length];
}

function deriveReadingTimeMinutes(pageCount: number): number {
  return Math.max(5, Math.round(pageCount * 3));
}

function toBookView(book: NonNullable<PrismaBook>): Book {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    authorId: book.authorId,
    language: book.language,
    genre: book.genre ?? "Uncategorized",
    tags: book.genre ? [book.genre] : [],
    coverImage: book.coverImage ?? "",
    coverTone: deriveCoverTone(book.id),
    pageCount: book.pageCount,
    publishedYear: book.publishedYear ?? 0,
    description: book.description ?? "",
    summary: book.summary ?? "",
    readingTimeMinutes: deriveReadingTimeMinutes(book.pageCount),
  };
}

function toAuthorView(author: NonNullable<PrismaAuthor>): Author {
  return {
    id: author.id,
    name: author.name,
    bio: author.bio ?? "",
    country: author.country ?? "",
    photoUrl: author.photoUrl ?? "",
  };
}

export async function getCatalog(): Promise<{ books: Book[]; authors: Author[] }> {
  const [books, authors] = await Promise.all([findAllBooks(), findAllAuthors()]);
  return { books: books.map(toBookView), authors: authors.map(toAuthorView) };
}

export async function getBookDetails(
  slug: string
): Promise<{ book: Book; author: Author | null } | null> {
  const book = await findBookBySlug(slug);
  if (!book) return null;
  const author = await findAuthorById(book.authorId);
  return { book: toBookView(book), author: author ? toAuthorView(author) : null };
}

export async function getBookForReader(
  id: string
): Promise<{ book: Book; pages: BookPage[] } | null> {
  const book = await findBookById(id);
  if (!book) return null;
  const bookView = toBookView(book);
  const rows = await findBookPagesByBookId(id);
  const pages: BookPage[] =
    rows.length > 0
      ? rows.map((p: Awaited<ReturnType<typeof findBookPagesByBookId>>[number]) => ({
          bookId: p.bookId,
          pageNumber: p.pageNumber,
          content: p.content,
        }))
      : generateBookPages(bookView);
  return { book: bookView, pages };
}