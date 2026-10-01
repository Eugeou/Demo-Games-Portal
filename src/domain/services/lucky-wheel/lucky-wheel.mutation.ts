import { useMutation } from "@/infrastructure/plugins/tanstack";
import { type ILuckyWheelService } from "./lucky-wheel.interface";
import { useQueryClient } from "@tanstack/react-query";

const QUERY_SERVICE_ID = "lucky-wheel";

const spin = (service: ILuckyWheelService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => service.spin(userId),
    options: {
      onSuccess: (_, userId) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "status", userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["wallet", "balance"],
        });
      },
    },
  });
};

export const useLuckyWheelMutations = {
  spin,
};
