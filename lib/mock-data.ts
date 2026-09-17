import type { Author, Book, BookPage, Profile, ShelfEntry } from "@/types";

// Demo content standing in for the Neon-backed data layer (see
// docs/DECISIONS.md ADR-002). Swapping to Prisma repositories later is a
// drop-in change - components only ever import from this module's shape.

export const currentUserId = "u_reader";

export const authors: Author[] = [
  {
    id: "a_22",
    name: "Mark Manson",
    bio: "Mark Manson (born March 9, 1984) is an American self-help author and blogger. As of 2026, he has authored or co-authored four books, three of which, The Subtle Art of Not Giving a F*ck, Everything Is F*cked: A Book About Hope, and Will, were New York Times bestsellers. Mark Manson was raised in Austin, Texas, in the United States, where he attended St. Andrews Episcopal School after his parents got a divorce. He moved to Boston, Massachusetts, to study international relations, and graduated from Boston University in 2007.",
    country: "America",
    photoUrl:
      "https://en.wikipedia.org/wiki/Mark_Manson#/media/File:Mark-manson-headshot-2018-1.jpg",
  },
];

export const books: Book[] = [
  {
    id: "b_30",
    slug: "rich-dad-poor-dad",
    title: "Rich Dad, Poor Dad",
    authorId: "a_21",
    language: "English",
    genre: "Self Help",
    tags: ["Self Help", "Psychology", "Financial"],
    coverImage:
      "https://en.wikipedia.org/wiki/Rich_Dad_Poor_Dad#/media/File:Rich_Dad_Poor_Dad.jpg",
    coverTone: "purple",
    pageCount: 154,
    publishedYear: 2000,
    description:
      "Rich Dad Poor Dad: What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not! is a 1997 book written by Robert T. Kiyosaki and Sharon Lechter. It advocates the importance of financial literacy (financial education), financial independence and building wealth through investing in assets, real estate investing, starting and owning businesses, as well as increasing one's financial intelligence (financial IQ).",
    summary:
      "Rich Dad Poor Dad is written in the style of a set of parables presented as autobiographical. The titular 'rich dad' is his best friend's father who accumulated wealth due to entrepreneurship and savvy investing, while the 'poor dad' is claimed to be Kiyosaki's own father who he says worked hard all his life but never obtained financial security.",
    readingTimeMinutes: 140,
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

export function getAuthorById(id: string): Author | undefined {
  return authors.find((a) => a.id === id);
}

export function generateBookPages(book: Book): BookPage[] {
  const pages: BookPage[] = [];
  const paragraphs = [
    book.summary,
    book.description,
    "The rest of this chapter is placeholder reading content generated for demo purposes - real book content is stored page-by-page per docs/ARCHITECTURE.md and PRD.md §18 once ingestion is wired.",
  ];
  for (let i = 1; i <= Math.min(book.pageCount, 40); i++) {
    pages.push({
      bookId: book.id,
      pageNumber: i,
      content: `${paragraphs[i % paragraphs.length]} - page ${i} of ${book.pageCount}.`,
    });
  }
  return pages;
}
