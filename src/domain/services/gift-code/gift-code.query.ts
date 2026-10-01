import { useQuery } from "@/infrastructure/plugins/tanstack";
import { type IGiftCodeService } from "./gift-code.interface";

const QUERY_SERVICE_ID = "gift-code";

const listHistory = (service: IGiftCodeService, params?: { userId: string }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "history", params?.userId ?? ""],
    queryFn: () => service.listHistory(params?.userId ?? ""),
    options: {
      enabled: Boolean(params?.userId),
    },
  });
};

export const useGiftCodeQueries = {
  listHistory,
};
