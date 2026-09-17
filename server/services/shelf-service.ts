import {
  findShelfByUserAndBook,
  findShelvesByUserId,
  upsertShelf,
} from "@/server/repositories/shelf-repository";
import type { ShelfEntry, ShelfStatus } from "@/types";

// Shelf/reading-progress business logic - see docs/DECISIONS.md ADR-010.
// Ports the status-transition rules that previously lived in
// lib/mock-data.ts (setShelfStatus/setReadingProgress) onto Prisma, scoped
// per authenticated userId instead of a single shared demo account.

type ShelfRow = Awaited<ReturnType<typeof findShelfByUserAndBook>>;

function toShelfEntry(row: NonNullable<ShelfRow>): ShelfEntry {
  return {
    userId: row.userId,
    bookId: row.bookId,
    status: row.status,
    currentPage: row.currentPage,
    progressPercent: row.progressPercent,
    startedAt: row.startedAt ? row.startedAt.toISOString().slice(0, 10) : null,
    finishedAt: row.finishedAt ? row.finishedAt.toISOString().slice(0, 10) : null,
  };
}

export async function getShelfMapForUser(userId: string): Promise<Map<string, ShelfEntry>> {
  const rows = await findShelvesByUserId(userId);
  return new Map(rows.map((row) => [row.bookId, toShelfEntry(row)]));
}

export async function getShelfForUserAndBook(
  userId: string,
  bookId: string
): Promise<ShelfEntry | undefined> {
  const row = await findShelfByUserAndBook(userId, bookId);
  return row ? toShelfEntry(row) : undefined;
}

export async function getShelvesByStatusForUser(
  userId: string,
  status: ShelfStatus
): Promise<ShelfEntry[]> {
  const rows = await findShelvesByUserId(userId);
  return rows.filter((row) => row.status === status).map(toShelfEntry);
}

export async function setShelfStatus(
  userId: string,
  bookId: string,
  status: ShelfStatus
): Promise<ShelfEntry> {
  const existing = await findShelfByUserAndBook(userId, bookId);
  const now = new Date();
  const startedAt =
    existing?.startedAt ?? (status === "CURRENTLY_READING" || status === "FINISHED" ? now : null);
  const finishedAt = existing?.finishedAt ?? (status === "FINISHED" ? now : null);

  const row = await upsertShelf(userId, bookId, {
    status,
    currentPage: existing?.currentPage ?? 0,
    progressPercent: existing?.progressPercent ?? 0,
    startedAt,
    finishedAt,
  });
  return toShelfEntry(row);
}

export async function setReadingProgress(
  userId: string,
  bookId: string,
  pageNumber: number,
  pageCount: number
): Promise<ShelfEntry> {
  const progressPercent = Math.min(100, Math.round((pageNumber / pageCount) * 100));
  const finished = progressPercent >= 100;
  const existing = await findShelfByUserAndBook(userId, bookId);

  let status: ShelfStatus = existing?.status ?? "CURRENTLY_READING";
  if (status === "WANT_TO_READ") status = "CURRENTLY_READING";
  if (finished) status = "FINISHED";

  const row = await upsertShelf(userId, bookId, {
    status,
    currentPage: pageNumber,
    progressPercent,
    startedAt: existing?.startedAt ?? new Date(),
    finishedAt: existing?.finishedAt ?? (finished ? new Date() : null),
  });
  return toShelfEntry(row);
}