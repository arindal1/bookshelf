export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  // Minimal chrome per docs/MAP.md — reader owns its own header/footer for a
  // distraction-free full-page reading experience (PRD.md §8).
  return <>{children}</>;
}