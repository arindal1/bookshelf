import { notFound } from "next/navigation";
import { ReaderShell } from "@/components/reader/ReaderShell";
import { auth } from "@/lib/auth";
import { getBookForReader } from "@/server/services/book-service";
import { getShelfForUserAndBook } from "@/server/services/shelf-service";

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const [result, session] = await Promise.all([getBookForReader(bookId), auth()]);
  if (!result) notFound();

  const { book, pages } = result;
  const shelf = session?.user?.id
    ? await getShelfForUserAndBook(session.user.id, book.id)
    : undefined;
  const initialPage = shelf?.currentPage && shelf.currentPage > 0 ? shelf.currentPage : 1;

  return <ReaderShell book={book} pages={pages} initialPage={Math.min(initialPage, pages.length)} />;
}