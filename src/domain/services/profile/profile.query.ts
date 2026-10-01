import { useQuery } from "@/infrastructure/plugins/tanstack";
import { type IProfileService } from "./profile.interface";

const QUERY_SERVICE_ID = "profile";

const getProfile = (service: IProfileService, params?: { userId: string }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "profile", params?.userId ?? ""],
    queryFn: () => service.getProfile(params?.userId ?? ""),
    options: {
      enabled: Boolean(params?.userId),
    },
  });
};

const getCurrentPlan = (service: IProfileService) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "plan"],
    queryFn: () => service.getCurrentPlan(),
  });
};

const getTransactions = (service: IProfileService) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "transactions"],
    queryFn: () => service.getTransactions(),
  });
};

const getPlayHistory = (service: IProfileService) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "play-history"],
    queryFn: () => service.getPlayHistory(),
  });
};

export const useProfileQueries = {
  getProfile,
  getCurrentPlan,
  getTransactions,
  getPlayHistory,
};
