/**
 * Validates a pasted Printables.com model URL. We never scrape or fetch
 * Printables — no official metadata API exists for this, so per product
 * direction we simply validate the shape of the link and store it as-is.
 */

export type PrintablesParseResult =
  | { ok: true; url: string; modelId: string }
  | { ok: false; error: string };

const MODEL_PATH_RE = /^\/model\/(\d+)(?:-[a-z0-9-]+)?\/?$/i;

export function parsePrintablesUrl(input: string): PrintablesParseResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: "Paste a Printables model URL." };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "That doesn't look like a valid URL." };
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, error: "That doesn't look like a valid URL." };
  }

  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  if (host !== "printables.com") {
    return { ok: false, error: "Please paste a link from printables.com." };
  }

  const match = parsed.pathname.match(MODEL_PATH_RE);
  if (!match) {
    return {
      ok: false,
      error: "That doesn't look like a Printables model page (expected .../model/12345-name).",
    };
  }

  const modelId = match[1];
  return { ok: true, url: `https://www.printables.com${parsed.pathname.replace(/\/$/, "")}`, modelId };
}
