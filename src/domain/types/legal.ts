export type LegalLocale = "vi" | "en";

export type LegalSlug =
  | "terms"
  | "privacy"
  | "about"
  | "registration"
  | "personal-data";

export interface LegalLocaleContent {
  title: string;
  content: string;
}

export interface LegalDocument {
  slug: LegalSlug;
  updatedAt: string;
  locales: Record<LegalLocale, LegalLocaleContent>;
}

export function pickLegalLocale(doc: LegalDocument, language: string): LegalLocaleContent {
  const key: LegalLocale = language.toLowerCase().startsWith("en") ? "en" : "vi";
  return doc.locales[key] ?? doc.locales.vi;
}
