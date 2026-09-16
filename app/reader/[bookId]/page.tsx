import { notFound } from "next/navigation";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { books, generateBookPages, getShelfForBook } from "@/lib/mock-data";

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = books.find((b) => b.id === bookId);
  if (!book) notFound();

  const pages = generateBookPages(book);
  const shelf = getShelfForBook(book.id);
  const initialPage = shelf?.currentPage && shelf.currentPage > 0 ? shelf.currentPage : 1;

  return <ReaderShell book={book} pages={pages} initialPage={Math.min(initialPage, pages.length)} />;
}