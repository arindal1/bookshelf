import { LandingClient } from "@/components/landing/LandingClient";
import { getCatalog } from "@/server/services/book-service";

export default async function HomePage() {
  const { books, authors } = await getCatalog();
  return <LandingClient trending={books.slice(0, 6)} authors={authors} />;
}