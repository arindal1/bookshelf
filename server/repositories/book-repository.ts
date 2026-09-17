import { prisma } from "@/lib/prisma";

// Book/Author/BookPage reads - see docs/DECISIONS.md ADR-009. Kept as thin
// Prisma queries; view-shaping (defaults, derived fields) lives in
// server/services/book-service.ts.

export function findAllBooks() {
  return prisma.book.findMany({ orderBy: { createdAt: "desc" } });
}

export function findAllAuthors() {
  return prisma.author.findMany();
}

export function findBookBySlug(slug: string) {
  return prisma.book.findUnique({ where: { slug } });
}

export function findBookById(id: string) {
  return prisma.book.findUnique({ where: { id } });
}

export function findAuthorById(id: string) {
  return prisma.author.findUnique({ where: { id } });
}

export function findBookPagesByBookId(bookId: string) {
  return prisma.bookPage.findMany({ where: { bookId }, orderBy: { pageNumber: "asc" } });
}