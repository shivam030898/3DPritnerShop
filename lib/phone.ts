export type PhoneValidation = { ok: true; value: string } | { ok: false; error: string };

const INDIA_MOBILE = /^[6-9]\d{9}$/;
const E164 = /^\+[1-9]\d{7,14}$/;

/**
 * Normalizes a phone number to E.164 (+<countrycode><number>). A bare
 * 10-digit Indian mobile number is treated as domestic and assumed +91;
 * anything else must include an explicit country code, which keeps this
 * open to other countries without changing the validation shape.
 */
export function normalizePhone(raw: string): PhoneValidation {
  const cleaned = raw.trim().replace(/[\s\-().]/g, "");
  if (!cleaned) return { ok: false, error: "Phone number is required." };

  if (INDIA_MOBILE.test(cleaned)) {
    return { ok: true, value: `+91${cleaned}` };
  }

  const withPlus = cleaned.startsWith("+") ? cleaned : `+${cleaned}`;
  if (!E164.test(withPlus)) {
    return { ok: false, error: "Enter a valid phone number with country code, e.g. +91XXXXXXXXXX." };
  }
  return { ok: true, value: withPlus };
}
