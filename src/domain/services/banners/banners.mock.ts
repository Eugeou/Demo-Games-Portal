import { GAME_INTRO, GAME_THUMBNAIL, type HeroBanner } from "@/domain/types";
import type { IBannersService } from "./banners.interface";

const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms));

const BANNERS: HeroBanner[] = [
  {
    id: "banner-farm",
    title: "Farm Valley",
    mediaType: "image",
    mediaUrl: GAME_THUMBNAIL,
    linkUrl: "/play/farm-valley",
  },
  {
    id: "banner-intro",
    title: "Tiny Farm",
    mediaType: "image",
    mediaUrl: GAME_INTRO,
    linkUrl: "/play/farm-valley",
  },
  {
    id: "banner-karts",
    title: "Pixel Karts",
    mediaType: "image",
    mediaUrl: GAME_THUMBNAIL,
    linkUrl: "/play/pixel-karts",
  },
  {
    id: "banner-front",
    title: "Open Front",
    mediaType: "image",
    mediaUrl: GAME_INTRO,
    linkUrl: "/play/open-front",
  },
  {
    id: "banner-obby",
    title: "Keyboard Obby",
    mediaType: "image",
    mediaUrl: GAME_THUMBNAIL,
    linkUrl: "/play/keyboard-obby",
  },
  {
    id: "banner-block",
    title: "Block World",
    mediaType: "image",
    mediaUrl: GAME_INTRO,
    linkUrl: "/play/block-world",
  },
];

export const createBannersMock = (): IBannersService => ({
  listBanners: async () => {
    await delay();
    return BANNERS;
  },
});
