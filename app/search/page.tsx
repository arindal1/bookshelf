import { SearchClient } from "@/components/search/SearchClient";
import { getCatalog } from "@/server/services/book-service";

export default async function SearchPage() {
  const { books, authors } = await getCatalog();
  return <SearchClient books={books} authors={authors} />;
}