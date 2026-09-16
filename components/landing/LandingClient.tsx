"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/ui/BookCover";
import { SectionMarker } from "@/components/ui/HairlineRule";
import { books, getAuthorById } from "@/lib/mock-data";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function LandingClient() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const trending = books.slice(0, 6);

  return (
    <div ref={rootRef}>
      {/* Hero */}
      <section className="border-b-2 border-line px-6 py-24 md:px-10 md:py-36">
        <div className="mx-auto max-w-350">
          <SectionMarker number="00" label="Bookshelf" />
          <h1 className="font-display mt-6 max-w-4xl text-[clamp(2.5rem,8vw,7rem)]">
            A LIBRARY THAT
            <br />
            REMEMBERS WHERE
            <br />
            YOU <span className="text-accent">STOPPED.</span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
            Build your own shelf, read entire books in the browser, and pick up
            exactly where you left off — no app, no PDF, no friction.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/signup">
              <Button>Create your shelf</Button>
            </Link>
            <Link href="/explore">
              <Button variant="ghost">Explore books</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="overflow-hidden border-b-2 border-line py-3">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {[...trending, ...trending].map((b, i) => (
            <span key={`${b.id}-${i}`} className="font-mono-label text-xs text-ink-muted">
              {b.title} · {getAuthorById(b.authorId)?.name}
            </span>
          ))}
        </div>
      </div>

      {/* Trending */}
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-350">
          <div data-reveal>
            <SectionMarker number="01" label="Trending" />
            <h2 className="font-display mt-4 text-3xl md:text-5xl">What people are reading now</h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {trending.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.slug}`}
                data-reveal
                className="group block border-2 border-line p-3 hover:border-accent"
              >
                <BookCover title={book.title} tone={book.coverTone} />
                <p className="mt-3 font-display text-sm group-hover:text-accent">{book.title}</p>
                <p className="font-mono-label text-[10px] text-ink-muted">
                  {getAuthorById(book.authorId)?.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto row */}
      <section className="border-t-2 border-line px-6 py-24 md:px-10">
        <div className="mx-auto grid max-w-350 gap-10 md:grid-cols-3">
          {[
            {
              n: "02",
              title: "Read, full page",
              body: "Clean typography, fast transitions, and a progress bar that never lies.",
            },
            {
              n: "03",
              title: "Shelves, not folders",
              body: "Want to read, currently reading, finished, on hold — moved freely, tracked automatically.",
            },
            {
              n: "04",
              title: "Discover through people",
              body: "Search readers, not just titles. See what a shelf says about a person.",
            },
          ].map((item) => (
            <div key={item.n} data-reveal>
              <SectionMarker number={item.n} label="Feature" />
              <h3 className="font-display mt-4 text-2xl">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}