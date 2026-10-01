export type BannerMediaType = "image" | "video";

export interface HeroBanner {
  id: string;
  title: string;
  mediaType: BannerMediaType;
  mediaUrl: string;
  posterUrl?: string;
  linkUrl: string;
}
