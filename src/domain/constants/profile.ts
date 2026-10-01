export const DEFAULT_AVATAR = "/apple-touch-icon.png";
export const DEFAULT_COVER = "/assets/profile/cover-default.png";
export const PROFILE_STORAGE_KEY = "portal-profile";

export const PROFILE_COVER_PRESETS = [
  { id: "night-mountains", url: DEFAULT_COVER },
  { id: "aurora", url: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 48%, #312e81 100%)" },
  { id: "ocean", url: "linear-gradient(120deg, #082f49 0%, #0369a1 55%, #38bdf8 100%)" },
  { id: "forest", url: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)" },
  { id: "ember", url: "linear-gradient(135deg, #1c1917 0%, #7c2d12 55%, #ea580c 100%)" },
] as const;

export const PROFILE_COUNTRIES = ["VN", "US", "JP", "KR", "TH", "SG", "OTHER"] as const;

export function resolveAvatar(url?: string) {
  return url && url.trim() ? url : DEFAULT_AVATAR;
}

export function isCssCover(url: string) {
  return url.startsWith("linear-gradient") || url.startsWith("radial-gradient");
}

export function coverStyle(url: string): { backgroundImage: string } {
  const cover = url || DEFAULT_COVER;
  return {
    backgroundImage: isCssCover(cover) ? cover : `url(${cover})`,
  };
}
