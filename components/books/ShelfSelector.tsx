"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { moveToShelf } from "@/lib/actions/shelf";
import { cn } from "@/lib/utils";
import type { ShelfStatus } from "@/types";

const OPTIONS: { status: ShelfStatus; label: string }[] = [
  { status: "WANT_TO_READ", label: "Want to read" },
  { status: "CURRENTLY_READING", label: "Currently reading" },
  { status: "FINISHED", label: "Finished" },
  { status: "RE_READING", label: "Re-reading" },
  { status: "ON_HOLD", label: "On hold" },
  { status: "DROPPED", label: "Dropped" },
];

// Lets a signed-in reader move a book between shelves (PRD.md §9). Calls the
// moveToShelf server action then refreshes the route so server-rendered shelf
// state (dashboard, this page) reflects the change.
export function ShelfSelector({ bookId, status }: { bookId: string; status?: ShelfStatus }) {
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState<ShelfStatus | undefined>(status);
  const router = useRouter();

  return (
    <div className="border-2 border-line p-3">
      <p className="font-mono-label mb-2 text-[10px] text-ink-muted">Shelf</p>
      <select
        value={current ?? ""}
        disabled={pending}
        onChange={(e) => {
          const next = e.target.value as ShelfStatus;
          setCurrent(next);
          startTransition(async () => {
            await moveToShelf(bookId, next);
            router.refresh();
          });
        }}
        className={cn(
          "w-full border-2 border-line bg-transparent px-3 py-2 text-sm text-ink outline-none",
          "focus:border-accent disabled:opacity-50"
        )}
      >
        {!current && (
          <option value="" disabled>
            Add to a shelf…
          </option>
        )}
        {OPTIONS.map((o) => (
          <option key={o.status} value={o.status} className="bg-surface">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}