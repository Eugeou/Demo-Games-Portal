import { useQuery } from "@/infrastructure/plugins/tanstack";
import { type INewsService } from "./news.interface";

const QUERY_SERVICE_ID = "news";

const listNews = (service: INewsService) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "list"],
    queryFn: () => service.listNews(),
  });
};

const getNews = (service: INewsService, params?: { id: string }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "detail", params?.id ?? ""],
    queryFn: () => {
      if (!params?.id) {
        return Promise.reject(new Error("news id is required"));
      }
      return service.getNews(params.id);
    },
    options: {
      enabled: Boolean(params?.id),
    },
  });
};

export const useNewsQueries = {
  listNews,
  getNews,
};
