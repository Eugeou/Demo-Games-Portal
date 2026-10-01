/**
 * GA events
 */
import {
  trackEvent,
  type EventParams,
} from "@/infrastructure/plugins/google-analytic/ga-client";

export const GA_EVENTS = {
  LOGIN: "login",
  LOGOUT: "logout",
  PLAY_GAME: "play_game",
  CLAIM_DAILY: "claim_daily",
  SPIN_WHEEL: "spin_wheel",
};

export const GA_EVENTS_CATEGORY = {
  AUTH: "auth",
  PLAY: "play",
  WALLET: "wallet",
  REWARDS: "rewards",
};

const trackUserHasLoggedIn = (userId: string) => {
  trackEvent(GA_EVENTS_CATEGORY.AUTH, GA_EVENTS.LOGIN, {
    user_id: userId,
  });
};

const trackUserHasLoggedOut = (userId: string) => {
  trackEvent(GA_EVENTS_CATEGORY.AUTH, GA_EVENTS.LOGOUT, {
    user_id: userId,
  });
};

const trackPlayGame = (params: EventParams) => {
  trackEvent(GA_EVENTS_CATEGORY.PLAY, GA_EVENTS.PLAY_GAME, params);
};

const trackDailyClaim = (params: EventParams) => {
  trackEvent(GA_EVENTS_CATEGORY.WALLET, GA_EVENTS.CLAIM_DAILY, params);
};

const trackLuckyWheelSpin = (params: EventParams) => {
  trackEvent(GA_EVENTS_CATEGORY.REWARDS, GA_EVENTS.SPIN_WHEEL, params);
};

export const useAnalyticsEvents = {
  trackUserHasLoggedIn,
  trackUserHasLoggedOut,
  trackPlayGame,
  trackDailyClaim,
  trackLuckyWheelSpin,
};
