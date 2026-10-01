import { HttpServiceBase } from "@/infrastructure/http/http-service-base";
import { ApiServiceFactory } from "@/infrastructure/http/api-service-factory";
import type { LibraryToggleResult } from "@/domain/types";
import type { ILibraryService } from "./library.interface";

export class LibraryService implements ILibraryService {
  private readonly http: HttpServiceBase;
  private readonly API_VERSION = "api/v1";

  constructor(url: string) {
    this.http = ApiServiceFactory.getService("gateway-library", url);
  }

  listSaved(userId: string) {
    return this.http.get<string[]>(`${this.API_VERSION}/library/saved`, { userId });
  }

  toggleSaved(userId: string, gameId: string) {
    return this.http.post<{ userId: string; gameId: string }, LibraryToggleResult>(
      `${this.API_VERSION}/library/saved/toggle`,
      { userId, gameId }
    );
  }

  listLiked(userId: string) {
    return this.http.get<string[]>(`${this.API_VERSION}/library/liked`, { userId });
  }

  toggleLiked(userId: string, gameId: string) {
    return this.http.post<{ userId: string; gameId: string }, LibraryToggleResult>(
      `${this.API_VERSION}/library/liked/toggle`,
      { userId, gameId }
    );
  }

  listRecent() {
    return this.http.get<string[]>(`${this.API_VERSION}/library/recent`);
  }

  addRecent(gameId: string) {
    return this.http.post<{ gameId: string }, string[]>(
      `${this.API_VERSION}/library/recent`,
      { gameId }
    );
  }

  removeRecent(gameId: string) {
    return this.http.delete<string[]>(`${this.API_VERSION}/library/recent/${gameId}`);
  }
}
