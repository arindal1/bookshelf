export default function Loading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 py-16">
      <div className="h-1 w-40 overflow-hidden bg-line">
        <div className="h-full w-1/3 animate-[loading-bar_1.1s_ease-in-out_infinite] bg-accent" />
      </div>
      <p className="font-mono-label text-[10px] text-ink-muted">Loading</p>
    </div>
  );
}