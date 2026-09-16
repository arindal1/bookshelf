import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/ui/BookCover";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Tag } from "@/components/ui/Tag";
import { SectionMarker } from "@/components/ui/HairlineRule";
import { ShelfSelector } from "@/components/books/ShelfSelector";
import { formatMinutes, cn } from "@/lib/utils";
import { getAuthorById, getBookBySlug, getShelfForBook } from "@/lib/mock-data";

export default async function BookDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  const author = getAuthorById(book.authorId);
  const shelf = getShelfForBook(book.id);

  return (
    <div className="px-6 py-16 md:px-10">
      <div className="mx-auto grid max-w-350 gap-12 md:grid-cols-[320px_1fr]">
        <div>
          <BookCover title={book.title} tone={book.coverTone} className="max-w-sm" />
          <div className="mt-6 space-y-3">
            <Link href={`/reader/${book.id}`}>
              <Button className="w-full">
                {shelf?.status === "CURRENTLY_READING" ? "Continue reading" : "Read book"}
              </Button>
            </Link>
            {shelf && (
              <div className="border-2 border-line p-3">
                <p className="font-mono-label mb-2 text-[10px] text-ink-muted">Your progress</p>
                <ProgressBar percent={shelf.progressPercent} />
              </div>
            )}
            <ShelfSelector bookId={book.id} status={shelf?.status} />
          </div>
        </div>

        <div>
          <SectionMarker number={String(book.publishedYear)} label={book.genre} />
          <h1 className="font-display mt-4 text-4xl md:text-6xl">{book.title}</h1>
          <p className="font-mono-label mt-3 text-sm text-ink-muted">{author?.name}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {book.tags.map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 border-y-2 border-line py-6 sm:grid-cols-4">
            <Stat label="Pages" value={String(book.pageCount)} />
            <Stat label="Reading time" value={formatMinutes(book.readingTimeMinutes)} />
            <Stat label="Language" value={book.language} />
            <Stat label="Published" value={String(book.publishedYear)} />
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <p className="font-mono-label mb-2 text-[10px] text-ink-muted">Description</p>
              <p className="max-w-[65ch] leading-relaxed text-ink/90">{book.description}</p>
            </div>
            <div>
              <p className="font-mono-label mb-2 text-[10px] text-ink-muted">Summary</p>
              <p className="max-w-[65ch] leading-relaxed text-ink/90">{book.summary}</p>
            </div>
            {author && (
              <div>
                <p className="font-mono-label mb-2 text-[10px] text-ink-muted">About the author</p>
                <p className="max-w-[65ch] leading-relaxed text-ink/90">{author.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className={cn(className)}>
      <p className="font-mono-label text-[10px] text-ink-muted">{label}</p>
      <p className="font-display mt-1 text-xl">{value}</p>
    </div>
  );
}