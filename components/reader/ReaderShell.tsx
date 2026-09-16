"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { FormattedText } from "@/components/reader/FormattedText";
import { formatMinutes } from "@/lib/utils";
import { saveReadingProgress } from "@/lib/actions/shelf";
import type { Book, BookPage } from "@/types";

export function ReaderShell({
  book,
  pages,
  initialPage = 1,
}: {
  book: Book;
  pages: BookPage[];
  initialPage?: number;
}) {
  const [pageNumber, setPageNumber] = useState(initialPage);
  const hudRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();
  const totalPages = pages.length;
  const currentPage = pages.find((p) => p.pageNumber === pageNumber) ?? pages[0];
  const percent = (pageNumber / book.pageCount) * 100;
  const minutesLeft = Math.round(
    (book.readingTimeMinutes * (book.pageCount - pageNumber)) / book.pageCount
  );

  const goTo = (n: number) => {
    setPageNumber(Math.max(1, Math.min(totalPages, n)));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(pageNumber + 1);
      if (e.key === "ArrowLeft") goTo(pageNumber - 1);
      if (e.key === "Home") goTo(1);
      if (e.key === "End") goTo(totalPages);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, totalPages]);

  // Debounced auto-save of reading progress — see docs/ARCHITECTURE.md §5.
  useEffect(() => {
    const t = window.setTimeout(() => {
      startTransition(() => {
        void saveReadingProgress(book.id, pageNumber);
      });
    }, 500);
    return () => window.clearTimeout(t);
  }, [pageNumber, book.id]);

  useEffect(() => {
    if (!hudRef.current) return;
    gsap.fromTo(
      hudRef.current,
      { opacity: 0, y: -8 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
    );
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div ref={hudRef} className="border-b-2 border-line px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-6">
          <p className="font-mono-label text-[10px] text-ink-muted">{book.title}</p>
          <p className="font-mono-label text-[10px] tabular-nums text-ink-muted">
            {minutesLeft > 0 ? `${formatMinutes(minutesLeft)} left` : "Finished"}
          </p>
        </div>
        <ProgressBar percent={percent} className="mx-auto mt-3 max-w-3xl" />
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.article
            key={pageNumber}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <p className="text-lg leading-[1.7] text-ink/90">
              {currentPage ? <FormattedText text={currentPage.content} /> : null}
            </p>
          </motion.article>
        </AnimatePresence>
      </main>

      <footer className="border-t-2 border-line px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <button
            onClick={() => goTo(pageNumber - 1)}
            disabled={pageNumber <= 1}
            className="font-mono-label text-xs text-ink-muted hover:text-accent disabled:opacity-30"
          >
            ← Previous
          </button>
          <span className="font-mono-label tabular-nums text-xs text-ink-muted">
            {pageNumber} / {totalPages}
          </span>
          <button
            onClick={() => goTo(pageNumber + 1)}
            disabled={pageNumber >= totalPages}
            className="font-mono-label text-xs text-ink-muted hover:text-accent disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </footer>
    </div>
  );
}
