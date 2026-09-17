// Imports real manuscript text into the BookPage table for a single book,
// replacing the placeholder content generateBookPages() produces (see
// docs/DECISIONS.md ADR-002 and lib/mock-data.ts).
//
// Convention: raw text lives at content/books/<slug>.txt, one page per
// paragraph-separated block, with pages divided by a line containing only
// "---PAGE---". Trailing/leading blank lines around a break are ignored.
//
// Usage:
//   npx tsx scripts/import-book-content.ts <slug> [path/to/file.txt]
//
// If the file path is omitted, defaults to content/books/<slug>.txt.
// The book (by slug) must already exist - run `npm run db:seed` first, or
// create the Book row another way. Book.pageCount is updated to match the
// number of pages actually imported, and any stale pages beyond that count
// (e.g. left over from placeholder seeding) are deleted.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

const PAGE_BREAK = /\r?\n---PAGE---\r?\n/;

async function main() {
  const [slug, filePathArg] = process.argv.slice(2);
  if (!slug) {
    console.error("Usage: npx tsx scripts/import-book-content.ts <slug> [path/to/file.txt]");
    process.exit(1);
  }

  const filePath = resolve(filePathArg ?? `content/books/${slug}.txt`);
  const raw = readFileSync(filePath, "utf-8");
  const pages = raw
    .split(PAGE_BREAK)
    .map((page) => page.trim())
    .filter((page) => page.length > 0);

  if (pages.length === 0) {
    console.error(`No pages found in ${filePath} (check the ---PAGE--- delimiters).`);
    process.exit(1);
  }

  const prisma = new PrismaClient();
  try {
    const book = await prisma.book.findUnique({ where: { slug } });
    if (!book) {
      console.error(`No Book found with slug "${slug}". Seed or create it first.`);
      process.exit(1);
    }

    for (let i = 0; i < pages.length; i++) {
      const pageNumber = i + 1;
      await prisma.bookPage.upsert({
        where: { bookId_pageNumber: { bookId: book.id, pageNumber } },
        update: { content: pages[i] },
        create: { bookId: book.id, pageNumber, content: pages[i] },
      });
    }

    await prisma.bookPage.deleteMany({
      where: { bookId: book.id, pageNumber: { gt: pages.length } },
    });

    await prisma.book.update({
      where: { id: book.id },
      data: { pageCount: pages.length },
    });

    console.log(`Imported ${pages.length} pages for "${slug}".`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});