"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { ExternalLink, Send, Check } from "lucide-react";
import { submitPrintablesRequest } from "@/lib/actions/printablesRequests";

const PRINTABLES_URL = "https://www.printables.com/";

export default function CustomPrintCTA() {
  const { data: session } = useSession();
  const [link, setLink] = useState("");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await submitPrintablesRequest({ link, email, note });
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSent(true);
  };

  return (
    <section className="border-t border-border px-5 py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-mono-label text-xs text-text-faint">Don&apos;t see what you want?</p>
        <h2 className="text-display mt-4 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.1] text-text">
          Somewhere on Printables, your design is already waiting.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-text-dim">
          Find it, paste the link below, and we&apos;ll quote it and get it printed for you.
        </p>

        <div className="mt-6 flex justify-center">
          <a
            href={PRINTABLES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border-strong px-5 text-sm font-medium text-text transition-colors hover:border-text"
          >
            Browse Printables
            <ExternalLink size={14} />
          </a>
        </div>

        {sent ? (
          <div className="mx-auto mt-8 flex max-w-sm items-center justify-center gap-2 rounded-lg border border-success/30 bg-success-soft px-5 py-4 text-sm text-success">
            <Check size={16} />
            Got it — we&apos;ll be in touch about your link.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 text-left">
            <input
              type="url"
              required
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Paste the Printables link"
              className="h-11 w-full rounded-lg border border-border-strong bg-surface px-4 text-sm text-text outline-none placeholder:text-text-faint focus:border-text"
            />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="h-11 w-full rounded-lg border border-border-strong bg-surface px-4 text-sm text-text outline-none placeholder:text-text-faint focus:border-text"
            />
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything else we should know? (optional)"
              rows={2}
              className="w-full resize-none rounded-lg border border-border-strong bg-surface px-4 py-3 text-sm text-text outline-none placeholder:text-text-faint focus:border-text"
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex h-11 items-center justify-center gap-2 self-center rounded-lg bg-text px-6 text-sm font-medium text-bg transition-colors hover:bg-text/85 disabled:opacity-50"
            >
              {submitting ? "Sending…" : "Send us the link"}
              {!submitting && <Send size={14} />}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
