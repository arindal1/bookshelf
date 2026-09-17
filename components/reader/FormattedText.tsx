import { Fragment } from "react";

// Splits book page content on:
// "..." or “...”   -> dialogue
// *...*             -> note/footnote
// &...&             -> heading
// %...%             -> monospace/code
//
// Each pattern excludes newlines so a stray, unpaired delimiter (e.g. a
// footnote marker or "* * *" scene break in real imported manuscript text)
// can never swallow multiple paragraphs into one giant match.
const FORMAT_PATTERN = /("[^"\n]+"|“[^”\n]+”)|(\*[^*\n]+\*)|(&[^&\n]+&)|(%[^%\n]+%)/g;

export function FormattedText({ text }: { text: string }) {
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
      // "Dialogue" / “Dialogue”
      nodes.push(
        <span key={key++} className="font-medium text-accentmuted">
          {match[1]}
        </span>
      );
    } else if (match[2]) {
      // *Note*
      nodes.push(
        <em key={key++} className="italic">
          {match[2].slice(1, -1)}
        </em>
      );
    } else if (match[3]) {
      // &Heading&
      nodes.push(
        <span key={key++} className="text-xl font-bold">
          {match[3].slice(1, -1)}
        </span>
      );
    } else if (match[4]) {
      // %Monospace%
      nodes.push(
        <code
          key={key++}
          className="font-mono rounded bg-muted px-1 py-0.5 text-sm"
        >
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

  return <>{nodes}</>;
}