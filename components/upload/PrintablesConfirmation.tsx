import { ExternalLink } from "lucide-react";

/**
 * We never fetch or scrape Printables, so we never claim to have "found"
 * or processed the model — this is honest about what actually happened:
 * the link was validated and stored, nothing more.
 */
export default function PrintablesConfirmation({ url }: { url: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-surface p-4">
      <div>
        <p className="text-sm font-medium text-text">Printables model link added</p>
        <p className="mt-0.5 text-xs text-text-faint">Source: Printables</p>
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-sm font-medium text-text underline underline-offset-2"
      >
        Open model
        <ExternalLink size={14} />
      </a>
    </div>
  );
}
