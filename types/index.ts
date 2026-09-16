export type ShelfStatus =
  | "WANT_TO_READ"
  | "CURRENTLY_READING"
  | "FINISHED"
  | "RE_READING"
  | "ON_HOLD"
  | "DROPPED";

export interface Author {
  id: string;
  name: string;
  bio: string;
  country: string;
  photoUrl: string;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  authorId: string;
  language: string;
  genre: string;
  tags: string[];
  coverImage: string;
  coverTone: string;
  pageCount: number;
  publishedYear: number;
  description: string;
  summary: string;
  readingTimeMinutes: number;
}

export interface BookPage {
  bookId: string;
  pageNumber: number;
  content: string;
}

export interface ShelfEntry {
  userId: string;
  bookId: string;
  status: ShelfStatus;
  currentPage: number;
  progressPercent: number;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface Profile {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  favoriteGenres: string[];
}