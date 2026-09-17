"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookCover } from "@/components/ui/BookCover";
import { SectionMarker } from "@/components/ui/HairlineRule";
import { profile } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Author, Book } from "@/types";

export function SearchClient({ books, authors }: { books: Book[]; authors: Author[] }) {
  const [query, setQuery] = useState("");
  const authorsById = useMemo(() => new Map(authors.map((a) => [a.id, a])), [authors]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { books: [], users: [] };
    return {
      books: books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          authorsById.get(b.authorId)?.name.toLowerCase().includes(q)
      ),
      users: profile.username.toLowerCase().includes(q) || profile.name.toLowerCase().includes(q)
        ? [profile]
        : [],
    };
  }, [query, books, authorsById]);

  return (
    <div className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-350">
        <SectionMarker number="-" label="Search" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books, authors, or people…"
          className={cn(
            "font-display mt-6 w-full border-b-2 border-line bg-transparent pb-4 text-3xl outline-none",
            "focus:border-accent md:text-5xl"
          )}
        />

        {query && (
          <div className="mt-12 space-y-14">
            <section>
              <p className="font-mono-label mb-4 text-[10px] text-ink-muted">
                Books ({results.books.length})
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                {results.books.map((b) => (
                  <Link key={b.id} href={`/books/${b.slug}`} className="group">
                    <BookCover title={b.title} tone={b.coverTone} src={b.coverImage} />
                    <p className="mt-2 font-display text-sm group-hover:text-accent">{b.title}</p>
                  </Link>
                ))}
                {results.books.length === 0 && (
                  <p className="col-span-full text-sm text-ink-muted">No matching books.</p>
                )}
              </div>
            </section>

            <section>
              <p className="font-mono-label mb-4 text-[10px] text-ink-muted">
                People ({results.users.length})
              </p>
              <div className="space-y-2">
                {results.users.map((u) => (
                  <Link
                    key={u.id}
                    href={`/profile/${u.username}`}
                    className="block border-2 border-line p-4 hover:border-accent"
                  >
                    <p className="font-display text-lg">{u.name}</p>
                    <p className="font-mono-label text-[10px] text-ink-muted">@{u.username}</p>
                  </Link>
                ))}
                {results.users.length === 0 && (
                  <p className="text-sm text-ink-muted">No matching people.</p>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}