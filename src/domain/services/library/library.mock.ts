import {
  LIBRARY_STORAGE_KEY,
  RECENT_LIMIT,
  RECENT_STORAGE_KEY,
} from "@/domain/constants";
import ClientStorageService from "@/domain/services/client-storage";
import type { LibraryList, LibraryToggleResult } from "@/domain/types";
import type { ILibraryService } from "./library.interface";

const delay = (ms = 160) => new Promise((resolve) => setTimeout(resolve, ms));

type LibraryStore = Record<string, LibraryList>;

function emptyList(): LibraryList {
  return { saved: [], liked: [] };
}

function readLibrary(): LibraryStore {
  return ClientStorageService.getItem<LibraryStore>(LIBRARY_STORAGE_KEY) ?? {};
}

function writeLibrary(store: LibraryStore) {
  ClientStorageService.setItem(LIBRARY_STORAGE_KEY, store);
}

function readUserList(userId: string): LibraryList {
  return { ...emptyList(), ...readLibrary()[userId] };
}

function writeUserList(userId: string, list: LibraryList) {
  writeLibrary({ ...readLibrary(), [userId]: list });
}

function toggleId(ids: string[], gameId: string): { active: boolean; ids: string[] } {
  if (ids.includes(gameId)) {
    return { active: false, ids: ids.filter((id) => id !== gameId) };
  }
  return { active: true, ids: [gameId, ...ids] };
}

function readRecent(): string[] {
  return ClientStorageService.getItem<string[]>(RECENT_STORAGE_KEY) ?? [];
}

function writeRecent(ids: string[]) {
  ClientStorageService.setItem(RECENT_STORAGE_KEY, ids);
}

export const createLibraryMock = (): ILibraryService => ({
  listSaved: async (userId) => {
    await delay();
    return readUserList(userId).saved;
  },
  toggleSaved: async (userId, gameId) => {
    await delay();
    const current = readUserList(userId);
    const result: LibraryToggleResult = toggleId(current.saved, gameId);
    writeUserList(userId, { ...current, saved: result.ids });
    return result;
  },
  listLiked: async (userId) => {
    await delay();
    return readUserList(userId).liked;
  },
  toggleLiked: async (userId, gameId) => {
    await delay();
    const current = readUserList(userId);
    const result: LibraryToggleResult = toggleId(current.liked, gameId);
    writeUserList(userId, { ...current, liked: result.ids });
    return result;
  },
  listRecent: async () => {
    await delay(80);
    return readRecent();
  },
  addRecent: async (gameId) => {
    const next = [gameId, ...readRecent().filter((id) => id !== gameId)].slice(
      0,
      RECENT_LIMIT
    );
    writeRecent(next);
    return next;
  },
  removeRecent: async (gameId) => {
    const next = readRecent().filter((id) => id !== gameId);
    writeRecent(next);
    return next;
  },
});
