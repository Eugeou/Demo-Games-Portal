import { useQuery } from "@/infrastructure/plugins/tanstack";
import { type ILuckyWheelService } from "./lucky-wheel.interface";

const QUERY_SERVICE_ID = "lucky-wheel";

const getConfig = (service: ILuckyWheelService) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "config"],
    queryFn: () => service.getConfig(),
  });
};

const getStatus = (service: ILuckyWheelService, params?: { userId: string }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "status", params?.userId ?? ""],
    queryFn: () => service.getStatus(params?.userId ?? ""),
    options: {
      enabled: Boolean(params?.userId),
    },
  });
};

export const useLuckyWheelQueries = {
  getConfig,
  getStatus,
};
