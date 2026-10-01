import { env } from "@/infrastructure/env/env";
import type { LibraryList, LibraryToggleResult } from "@/domain/types";
import { createLibraryMock } from "./library.mock";
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query";
import {
  useServiceMutation,
  useServiceQuery,
  type MutationResult,
  type QueryResult,
} from "@/infrastructure/plugins/tanstack";
import { LibraryService } from "./library.service";

export interface ILibraryService {
  listSaved(userId: string): Promise<string[]>;
  toggleSaved(userId: string, gameId: string): Promise<LibraryToggleResult>;
  listLiked(userId: string): Promise<string[]>;
  toggleLiked(userId: string, gameId: string): Promise<LibraryToggleResult>;
  listRecent(): Promise<string[]>;
  addRecent(gameId: string): Promise<string[]>;
  removeRecent(gameId: string): Promise<string[]>;
}

const libraryService = new LibraryService(env.api.proxy);
const libraryServiceMock = createLibraryMock();

export function getApi(isMock: boolean = true): ILibraryService {
  if (!isMock) {
    return libraryService;
  }
  return libraryServiceMock;
}

export function useLibraryQuery<T, P = undefined>(
  queryFunc: (service: ILibraryService, params?: P) => UseQueryResult<T, Error>,
  params?: P
): QueryResult<T> {
  return useServiceQuery(queryFunc, getApi, params);
}

export function useLibraryMutation<TResponse, TRequest>(
  mutationFunc: (
    service: ILibraryService
  ) => UseMutationResult<TResponse, Error, TRequest>
): MutationResult<TResponse, TRequest> {
  return useServiceMutation(mutationFunc, getApi);
}

export type { LibraryList };
