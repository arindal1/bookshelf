import { prisma } from "@/lib/prisma";
import type { ShelfStatus } from "@/types";

// Shelf/reading-progress persistence - see docs/DECISIONS.md ADR-010.
// Scoped per userId (Shelf.@@unique([userId, bookId])); replaces the
// single-singleton mock shelves array (ADR-002/ADR-006).

export function findShelvesByUserId(userId: string) {
  return prisma.shelf.findMany({ where: { userId } });
}

export function findShelfByUserAndBook(userId: string, bookId: string) {
  return prisma.shelf.findUnique({ where: { userId_bookId: { userId, bookId } } });
}

export function upsertShelf(
  userId: string,
  bookId: string,
  data: {
    status: ShelfStatus;
    currentPage?: number;
    progressPercent?: number;
    startedAt?: Date | null;
    finishedAt?: Date | null;
  }
) {
  return prisma.shelf.upsert({
    where: { userId_bookId: { userId, bookId } },
    update: data,
    create: { userId, bookId, ...data },
  });
}