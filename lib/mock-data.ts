import type { Author, Book, BookPage, Profile, ShelfEntry } from "@/types";

// Demo content standing in for the Neon-backed data layer (see
// docs/DECISIONS.md ADR-002). Swapping to Prisma repositories later is a
// drop-in change — components only ever import from this module's shape.

export const currentUserId = "u_reader";

export const authors: Author[] = [
  {
    id: "a_2",
    name: "Herman Melville",
    bio: "Herman Melville (born Melvill; August 1, 1819 – September 28, 1891) was an American writer of the American Renaissance period. Among his best-known works are Moby-Dick (1851), Typee (1846), a romanticized account of his experiences in Polynesia, and Billy Budd, Sailor, a posthumously published novella. At the time of his death, Melville was not well known to the public, but 1919, the centennial of his birth, was the starting point of a Melville revival. Moby-Dick would eventually be considered one of the Great American Novels.",
    country: "American",
    photoUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e8/Herman_Melville_by_Joseph_O_Eaton.jpg/250px-Herman_Melville_by_Joseph_O_Eaton.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
  {
    id: "a_3",
    name: "Franz Kafka",
    bio: "Franz Kafka (3 July 1883 – 3 June 1924) was a German-language Jewish Czech writer and novelist born in Prague, in the Austro-Hungarian Empire. Widely regarded as a major figure of 20th-century literature, his works fuse elements of realism and the fantastique, and typically feature isolated protagonists facing bizarre or surreal predicaments and incomprehensible bureaucratic powers. He is also celebrated for his brief fables and aphorisms, which frequently incorporated comedic elements alongside the darker themes of his longer works. His work has widely influenced artists, philosophers, composers, filmmakers, literary historians, religious scholars, and cultural theorists.",
    country: "Czech",
    photoUrl: "https://thumb.wikimedia.org/wikipedia/commons/thumb/2/26/Franz_Kafka%2C_1923.jpg/250px-Franz_Kafka%2C_1923.jpg?utm_source=en.wikipedia.org&utm_campaign=parser&utm_content=thumbnail",
  },
];

export const books: Book[] = [
  {
    id: "b_2",
    slug: "moby-dick",
    title: "Moby Dick",
    authorId: "a_2",
    language: "English",
    genre: "Adventure Fiction",
    tags: ["Obsession", "Revenge", "Fate", "The Sea", "Nature", "Madness", "Religion", "Adventure", "Sublime"],
    coverImage: "https://imgs.search.brave.com/9vr-eIvDEHF05QRegSTY9DwRgFyQ063bbpFNOVQNZSA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjE1Z1lBTURIUUwu/anBn",
    coverTone: "blue",
    pageCount: 286,
    publishedYear: 1851,
    description:
      "Crime and Punishment is a novel by the Russian author Fyodor Dostoevsky. It was first published in the literary journal The Russian Messenger in twelve monthly installments during 1866.[1] It was later published in a single volume. It is the second of Dostoevsky's full-length novels following his return from ten years of exile in Siberia. Crime and Punishment is considered the first great novel of his mature period of writing and is often cited as one of the greatest works of world literature.",
    summary:
      "Crime and Punishment follows the mental anguish and moral dilemmas of Rodion Raskolnikov, an impoverished former law student in Saint Petersburg who plans to kill an unscrupulous pawnbroker, an old woman who stores money and valuable objects in her flat. He theorises that with the money he could liberate himself from poverty and go on to perform great deeds, and seeks to convince himself that certain crimes are justifiable if they are committed in order to remove obstacles to the higher goals of 'extraordinary' men. Once the deed is done, however, he finds himself wracked with confusion, paranoia, and disgust. His theoretical justifications lose all their power as he struggles with guilt and horror and is confronted with both internal and external consequences of his deed.",
    readingTimeMinutes: 1560,
  },
];

export const shelves: ShelfEntry[] = [
  {
    userId: currentUserId,
    bookId: "b_1",
    status: "CURRENTLY_READING",
    currentPage: 184,
    progressPercent: 59,
    startedAt: "2026-08-02",
    finishedAt: null,
  },
];

export const profile: Profile = {
  id: currentUserId,
  username: "m.arlen",
  name: "Marion Arlen",
  bio: "Reads two books at once and finishes neither on schedule. Structural engineer by day.",
  avatarUrl: "",
  favoriteGenres: ["Speculative Fiction", "Literary Fiction", "Fantasy"],
};

export function getBookBySlug(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getBookById(id: string): Book | undefined {
  return books.find((b) => b.id === id);
}

export function getAuthorById(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}

export function getShelfForBook(bookId: string): ShelfEntry | undefined {
  return shelves.find((s) => s.bookId === bookId && s.userId === currentUserId);
}

export function getShelvesByStatus(status: ShelfEntry["status"]): ShelfEntry[] {
  return shelves.filter((s) => s.status === status && s.userId === currentUserId);
}

const today = () => new Date().toISOString().slice(0, 10);

// Mutates the in-memory shelves array so shelf moves / reading progress are
// interactive in a single dev/server process (see docs/DECISIONS.md ADR-002).
// Not durable across serverless cold starts or multiple instances — swap for
// ShelfRepository (Prisma) calls once DATABASE_URL is live.
export function setShelfStatus(bookId: string, status: ShelfEntry["status"]): ShelfEntry {
  const existing = shelves.find((s) => s.bookId === bookId && s.userId === currentUserId);
  if (existing) {
    existing.status = status;
    if (status === "CURRENTLY_READING" && !existing.startedAt) existing.startedAt = today();
    if (status === "FINISHED" && !existing.finishedAt) existing.finishedAt = today();
    return existing;
  }
  const created: ShelfEntry = {
    userId: currentUserId,
    bookId,
    status,
    currentPage: 0,
    progressPercent: 0,
    startedAt: status === "CURRENTLY_READING" || status === "FINISHED" ? today() : null,
    finishedAt: status === "FINISHED" ? today() : null,
  };
  shelves.push(created);
  return created;
}

export function setReadingProgress(bookId: string, pageNumber: number): ShelfEntry {
  const book = getBookById(bookId);
  const pageCount = book?.pageCount ?? pageNumber;
  const progressPercent = Math.min(100, Math.round((pageNumber / pageCount) * 100));
  const finished = progressPercent >= 100;
  const existing = shelves.find((s) => s.bookId === bookId && s.userId === currentUserId);
  if (existing) {
    existing.currentPage = pageNumber;
    existing.progressPercent = progressPercent;
    if (!existing.startedAt) existing.startedAt = today();
    if (existing.status === "WANT_TO_READ") existing.status = "CURRENTLY_READING";
    if (finished) {
      existing.status = "FINISHED";
      existing.finishedAt = existing.finishedAt ?? today();
    }
    return existing;
  }
  const created: ShelfEntry = {
    userId: currentUserId,
    bookId,
    status: finished ? "FINISHED" : "CURRENTLY_READING",
    currentPage: pageNumber,
    progressPercent,
    startedAt: today(),
    finishedAt: finished ? today() : null,
  };
  shelves.push(created);
  return created;
}

export function generateBookPages(book: Book): BookPage[] {
  const pages: BookPage[] = [];
  const paragraphs = [
    book.summary,
    book.description,
    "The rest of this chapter is placeholder reading content generated for demo purposes — real book content is stored page-by-page per docs/ARCHITECTURE.md and PRD.md §18 once ingestion is wired.",
  ];
  for (let i = 1; i <= Math.min(book.pageCount, 40); i++) {
    pages.push({
      bookId: book.id,
      pageNumber: i,
      content: `${paragraphs[i % paragraphs.length]} — page ${i} of ${book.pageCount}.`,
    });
  }
  return pages;
}