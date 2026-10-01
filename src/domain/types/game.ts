export interface Game {
  id: string;
  slug: string;
  name: string;
  genre: string;
  thumbnailUrl: string;
  embedUrl: string;
  isActive: boolean;
  developer: string;
  rating: number;
  releasedAt: string;
  updatedAt: string;
  tags: string[];
  description: string;
  collections: string[];
  introUrl: string;
  playerCount: number;
  likeCount: number;
  featured?: boolean;
  playersLabel?: string;
  engine?: string;
  platforms?: string[];
  orientation?: "landscape" | "portrait" | "any";
}

export const GAME_THUMBNAIL = "/assets/games/thumbnail-demo.png";
export const GAME_INTRO = "/assets/games/intro-demo.png";
