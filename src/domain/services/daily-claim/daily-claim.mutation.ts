import { useMutation } from "@/infrastructure/plugins/tanstack";
import { type IDailyClaimService } from "./daily-claim.interface";
import { useQueryClient } from "@tanstack/react-query";

const QUERY_SERVICE_ID = "daily-claim";

const claim = (service: IDailyClaimService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => service.claim(userId),
    options: {
      onSuccess: (_, userId) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "status", userId],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "history", userId],
        });
        queryClient.invalidateQueries({
          queryKey: ["wallet", "balance"],
        });
      },
    },
  });
};

export const useDailyClaimMutations = {
  claim,
};
