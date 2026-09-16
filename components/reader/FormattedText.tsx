import { Fragment } from "react";

// Splits book page content on dialogue ("..."), note/footnote (*...*), and
// heading (&...&) markers. Dialogue keeps its literal quote marks and renders
// slightly bolder; notes and headings have their markers stripped, with notes
// rendering in italics and headings rendering larger and bold.
const FORMAT_PATTERN = /("[^"]+")|(\*[^*]+\*)|(&[^&]+&)/g;

export function FormattedText({ text }: { text: string }) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(FORMAT_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(<Fragment key={key++}>{text.slice(lastIndex, index)}</Fragment>);
    }

    if (match[1]) {
      nodes.push(
        <span key={key++} className="font-medium">
          {match[1]}
        </span>
      );
    } else if (match[2]) {
      nodes.push(
        <em key={key++} className="italic">
          {match[2].slice(1, -1)}
        </em>
      );
    } else if (match[3]) {
      nodes.push(
        <span key={key++} className="text-xl font-bold">
          {match[3].slice(1, -1)}
        </span>
      );
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return <>{nodes}</>;
}
