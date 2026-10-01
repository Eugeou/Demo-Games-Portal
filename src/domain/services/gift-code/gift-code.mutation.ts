import { useMutation } from "@/infrastructure/plugins/tanstack";
import { type IGiftCodeService } from "./gift-code.interface";
import { useQueryClient } from "@tanstack/react-query";

const QUERY_SERVICE_ID = "gift-code";

const redeem = (service: IGiftCodeService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; code: string }) =>
      service.redeem(data.userId, data.code),
    options: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "history", variables.userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["wallet", "balance"],
        });
      },
    },
  });
};

export const useGiftCodeMutations = {
  redeem,
};
