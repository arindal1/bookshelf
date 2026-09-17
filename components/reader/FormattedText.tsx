import { Fragment } from "react";

type ReaderTheme = "dark" | "light";

// Splits book page content on:
// "..." or “...”   -> dialogue
// *...*             -> note/footnote
// &...&             -> heading
// %...%             -> monospace/code
const FORMAT_PATTERN = /("[^"\n]+"|“[^”\n]+”)|(\*[^*\n]+\*)|(&[^&\n]+&)|(%[^%\n]+%)/g;

export function FormattedText({
  text,
  theme,
}: {
  text: string;
  theme: ReaderTheme;
}) {
  const isDark = theme === "dark";

  const styles = {
    dialogue: isDark ? "font-medium text-accent-muted" : "font-medium text-amber-800",
    note: isDark ? "italic text-stone-400 font-display" : "italic text-stone-600 font-display",
    heading: isDark ? "text-2xl font-bold text-accent" : "text-2xl font-bold text-stone-950",
    code: isDark
      ? "font-mono rounded bg-stone-800 px-1 py-0.5 text-sm text-stone-100"
      : "font-mono rounded bg-stone-200 px-1 py-0.5 text-sm text-stone-900",
    plain: isDark ? "text-stone-200" : "text-stone-900",
  };

  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(FORMAT_PATTERN)) {
    const index = match.index ?? 0;

    if (index > lastIndex) {
      nodes.push(
        <Fragment key={key++}>
          {text.slice(lastIndex, index)}
        </Fragment>
      );
    }

    if (match[1]) {
      nodes.push(
        <span key={key++} className={styles.dialogue}>
          {match[1]}
        </span>
      );
    } else if (match[2]) {
      nodes.push(
        <em key={key++} className={styles.note}>
          {match[2].slice(1, -1)}
        </em>
      );
    } else if (match[3]) {
      nodes.push(
        <span key={key++} className={styles.heading}>
          {match[3].slice(1, -1)}
        </span>
      );
    } else if (match[4]) {
      nodes.push(
        <code key={key++} className={styles.code}>
          {match[4].slice(1, -1)}
        </code>
      );
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(
      <Fragment key={key++}>
        {text.slice(lastIndex)}
      </Fragment>
    );
  }

  return <span className={styles.plain}>{nodes}</span>;
}