export const GAME_GENRES = [
  "arcade",
  "puzzle",
  "action",
  "io",
  "racing",
  "simulation",
  "strategy",
  "sports",
  "clicker",
  "adventure",
] as const;

export type GameGenre = (typeof GAME_GENRES)[number];

export const GENRE_ACCENT: Record<GameGenre, string> = {
  arcade: "#F97316",
  puzzle: "#A855F7",
  action: "#EF4444",
  io: "#0095FF",
  racing: "#EAB308",
  simulation: "#22C55E",
  strategy: "#6366F1",
  sports: "#84CC16",
  clicker: "#EC4899",
  adventure: "#14B8A6",
};

export const GAME_COLLECTIONS = [
  "brain",
  "adrenaline",
  "friends",
  "quick",
  "meme",
  "classic",
] as const;

export type GameCollection = (typeof GAME_COLLECTIONS)[number];
