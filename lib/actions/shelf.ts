"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { setReadingProgress, setShelfStatus } from "@/server/services/shelf-service";
import { getBookForReader } from "@/server/services/book-service";
import type { ShelfStatus } from "@/types";

// Server action contract for shelf/progress mutations (PRD.md §9, §13).
// Persists to Prisma's Shelf table, scoped to the authenticated session's
// userId - see docs/DECISIONS.md ADR-010 (supersedes the ADR-002/ADR-006
// mock-singleton implementation). Function signatures are the stable
// contract callers (ReaderShell, ShelfSelector) already depend on.
//
// Server actions are public network-reachable endpoints regardless of which
// component calls them, so inputs are validated here rather than trusting
// the client-side types, and every mutation requires a real session.
const bookIdSchema = z.string().trim().min(1).max(100);
const pageNumberSchema = z.number().int().min(0).max(1_000_000);
const shelfStatusSchema = z.enum([
  "WANT_TO_READ",
  "CURRENTLY_READING",
  "FINISHED",
  "RE_READING",
  "ON_HOLD",
  "DROPPED",
]);

type ActionResult = { ok: true } | { ok: false; error: string };

export async function saveReadingProgress(bookId: string, pageNumber: number): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "You must be signed in." };

  const parsedBookId = bookIdSchema.parse(bookId);
  const parsedPageNumber = pageNumberSchema.parse(pageNumber);

  const bookResult = await getBookForReader(parsedBookId);
  if (!bookResult) return { ok: false, error: "Book not found." };

  await setReadingProgress(session.user.id, parsedBookId, parsedPageNumber, bookResult.book.pageCount);
  revalidatePath("/dashboard");
  return { ok: true };
}

export async function moveToShelf(bookId: string, status: ShelfStatus): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "You must be signed in." };

  const parsedBookId = bookIdSchema.parse(bookId);
  const parsedStatus = shelfStatusSchema.parse(status);
  await setShelfStatus(session.user.id, parsedBookId, parsedStatus);
  revalidatePath("/dashboard");
  return { ok: true };
}