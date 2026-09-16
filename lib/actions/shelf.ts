"use server";

import { revalidatePath } from "next/cache";
import { setReadingProgress, setShelfStatus } from "@/lib/mock-data";
import type { ShelfStatus } from "@/types";

// Server action contract for shelf/progress mutations (PRD.md §9, §13). Mutates
// the in-memory mock data module for now — see docs/DECISIONS.md ADR-002 and
// ADR-006. Not durable across serverless cold starts or multiple instances;
// swap the bodies below for ShelfService/ShelfRepository (Prisma) calls once
// DATABASE_URL is live. Function signatures are the stable contract callers
// (ReaderShell, ShelfSelector) already depend on.

export async function saveReadingProgress(bookId: string, pageNumber: number) {
  setReadingProgress(bookId, pageNumber);
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function moveToShelf(bookId: string, status: ShelfStatus) {
  setShelfStatus(bookId, status);
  revalidatePath("/dashboard");
  return { ok: true as const };
}