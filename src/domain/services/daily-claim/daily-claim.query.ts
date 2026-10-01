import { useQuery } from "@/infrastructure/plugins/tanstack";
import { type IDailyClaimService } from "./daily-claim.interface";

const QUERY_SERVICE_ID = "daily-claim";

const getConfig = (service: IDailyClaimService) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "config"],
    queryFn: () => service.getConfig(),
  });
};

const getStatus = (service: IDailyClaimService, params?: { userId: string }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "status", params?.userId ?? ""],
    queryFn: () => service.getStatus(params?.userId ?? ""),
  });
};

const listHistory = (service: IDailyClaimService, params?: { userId: string }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "history", params?.userId ?? ""],
    queryFn: () => service.listHistory(params?.userId ?? ""),
    options: {
      enabled: Boolean(params?.userId),
    },
  });
};

export const useDailyClaimQueries = {
  getConfig,
  getStatus,
  listHistory,
};
