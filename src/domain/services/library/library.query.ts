import { useQuery } from "@/infrastructure/plugins/tanstack";
import { type ILibraryService } from "./library.interface";

const QUERY_SERVICE_ID = "library";

const listSaved = (service: ILibraryService, params?: { userId: string }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "saved", params?.userId ?? ""],
    queryFn: () => service.listSaved(params?.userId ?? ""),
    options: {
      enabled: Boolean(params?.userId),
    },
  });
};

const listLiked = (service: ILibraryService, params?: { userId: string }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "liked", params?.userId ?? ""],
    queryFn: () => service.listLiked(params?.userId ?? ""),
    options: {
      enabled: Boolean(params?.userId),
    },
  });
};

const listRecent = (service: ILibraryService) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "recent"],
    queryFn: () => service.listRecent(),
  });
};

export const useLibraryQueries = {
  listSaved,
  listLiked,
  listRecent,
};
