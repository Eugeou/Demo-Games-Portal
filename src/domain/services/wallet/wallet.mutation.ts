import { useMutation } from "@/infrastructure/plugins/tanstack";
import { type IWalletService } from "./wallet.interface";
import { useQueryClient } from "@tanstack/react-query";

const QUERY_SERVICE_ID = "wallet";

const claimDaily = (service: IWalletService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => service.claimDaily(),
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "balance"],
        });
      },
    },
  });
};

export const useWalletMutations = {
  claimDaily,
};
