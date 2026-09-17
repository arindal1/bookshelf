"use client";

import { useState, useTransition } from "react";
import { updateBio } from "@/lib/actions/profile";

export function BioForm({ initialBio }: { initialBio: string }) {
  const [bio, setBio] = useState(initialBio);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        setSaved(false);
        startTransition(async () => {
          const result = await updateBio(bio);
          if (result.ok) {
            setSaved(true);
          } else {
            setError(result.error);
          }
        });
      }}
      className="mt-4 max-w-lg"
    >
      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={280}
        rows={3}
        placeholder="Tell people what you're reading…"
        className="w-full resize-none border-2 border-line bg-transparent p-3 text-sm leading-relaxed text-ink-muted outline-none focus:border-accent"
      />
      <div className="mt-2 flex items-center gap-4">
        <button
          type="submit"
          disabled={isPending}
          className="font-mono-label border-2 border-line px-4 py-2 text-xs hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save bio"}
        </button>
        {saved && <p className="text-xs text-ink-muted">Saved.</p>}
        {error && <p className="text-xs text-accent">{error}</p>}
      </div>
    </form>
  );
}