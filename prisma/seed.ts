// Seeds a live Neon/Postgres database from the same demo content that
// powers lib/mock-data.ts (see docs/DECISIONS.md ADR-002). Run once
// DATABASE_URL is provisioned and `npx prisma migrate dev` has been applied:
//
//   npx prisma db seed
//
// Upserts are keyed on stable IDs/slugs so the script is safe to re-run.

import { PrismaClient } from "@prisma/client";
import {
  authors,
  books,
  shelves,
  profile,
  generateBookPages,
} from "../lib/mock-data";

const prisma = new PrismaClient();

async function seedAuthors() {
  for (const author of authors) {
    await prisma.author.upsert({
      where: { id: author.id },
      update: {
        name: author.name,
        bio: author.bio,
        country: author.country,
        photoUrl: author.photoUrl || null,
      },
      create: {
        id: author.id,
        name: author.name,
        bio: author.bio,
        country: author.country,
        photoUrl: author.photoUrl || null,
      },
    });
  }
}

async function seedBooksWithPages() {
  for (const book of books) {
    await prisma.book.upsert({
      where: { slug: book.slug },
      update: {
        title: book.title,
        description: book.description,
        summary: book.summary,
        authorId: book.authorId,
        language: book.language,
        genre: book.genre,
        coverImage: book.coverImage || null,
        pageCount: book.pageCount,
        publishedYear: book.publishedYear,
      },
      create: {
        id: book.id,
        slug: book.slug,
        title: book.title,
        description: book.description,
        summary: book.summary,
        authorId: book.authorId,
        language: book.language,
        genre: book.genre,
        coverImage: book.coverImage || null,
        pageCount: book.pageCount,
        publishedYear: book.publishedYear,
      },
    });

    for (const page of generateBookPages(book)) {
      await prisma.bookPage.upsert({
        where: { bookId_pageNumber: { bookId: page.bookId, pageNumber: page.pageNumber } },
        update: { content: page.content },
        create: { bookId: page.bookId, pageNumber: page.pageNumber, content: page.content },
      });
    }
  }
}

async function seedDemoUserAndShelves() {
  await prisma.user.upsert({
    where: { id: profile.id },
    update: {
      name: profile.name,
      username: profile.username,
      avatarUrl: profile.avatarUrl || null,
      bio: profile.bio,
    },
    create: {
      id: profile.id,
      name: profile.name,
      username: profile.username,
      email: `${profile.username}@example.com`,
      avatarUrl: profile.avatarUrl || null,
      bio: profile.bio,
    },
  });

  for (const shelf of shelves) {
    await prisma.shelf.upsert({
      where: { userId_bookId: { userId: shelf.userId, bookId: shelf.bookId } },
      update: {
        status: shelf.status,
        currentPage: shelf.currentPage,
        progressPercent: shelf.progressPercent,
        startedAt: shelf.startedAt ? new Date(shelf.startedAt) : null,
        finishedAt: shelf.finishedAt ? new Date(shelf.finishedAt) : null,
      },
      create: {
        userId: shelf.userId,
        bookId: shelf.bookId,
        status: shelf.status,
        currentPage: shelf.currentPage,
        progressPercent: shelf.progressPercent,
        startedAt: shelf.startedAt ? new Date(shelf.startedAt) : null,
        finishedAt: shelf.finishedAt ? new Date(shelf.finishedAt) : null,
      },
    });
  }
}

async function main() {
  await seedAuthors();
  await seedBooksWithPages();
  await seedDemoUserAndShelves();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });