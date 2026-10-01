export const routePaths = {
  home: "/",
  catalog: "/games",
  play: "/play/:gameId",
  profile: "/profile",
  news: "/news",
  newsDetail: "/news/:newsId",
  terms: "/terms",
  privacy: "/privacy",
  about: "/about",
  registration: "/quan-ly-dang-ky",
  personalData: "/du-lieu-ca-nhan",
  login: "/login",
  register: "/register",
  rewards: "/rewards",
  giftCode: "/gift-code",
} as const;

export const playPath = (gameId: string) => `/play/${gameId}`;
export const newsDetailPath = (newsId: string) => `/news/${newsId}`;
