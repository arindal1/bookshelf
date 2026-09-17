import { BookGrid } from "@/components/books/BookGrid";
import { SectionHeader } from "@/components/dashboard/SectionHeader";
import { getCatalog } from "@/server/services/book-service";
import { Tag } from "@/components/ui/Tag";

export default async function ExplorePage() {
  const { books, authors } = await getCatalog();
  const trending = [...books].sort((a, b) => b.publishedYear - a.publishedYear).slice(0, 6);
  const recent = books.slice(0, 4);

  return (
    <div className="px-6 py-16 md:px-10">
      <div className="mx-auto max-w-350 space-y-16">
        <section>
          <SectionHeader number="01" label="Trending" title="Trending books" />
          <BookGrid books={trending} authors={authors} />
        </section>

        <section>
          <SectionHeader number="02" label="New" title="Recently added" />
          <BookGrid books={recent} authors={authors} />
        </section>

        <section>
          <SectionHeader number="03" label="Catalog" title="All books" />
          <BookGrid books={books} authors={authors} />
        </section>

        <section>
          <SectionHeader number="04" label="Authors" title="Popular authors" />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {authors.map((a) => (
              <div key={a.id} className="border-2 border-line p-4">
                <p className="font-display text-lg">{a.name}</p>
                <Tag className="mt-2">{a.country}</Tag>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}