import { useQuery } from "@/infrastructure/plugins/tanstack";
import { type IWalletService } from "./wallet.interface";

const QUERY_SERVICE_ID = "wallet";

const getBalance = (service: IWalletService) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "balance"],
    queryFn: () => service.getBalance(),
  });
};

export const useWalletQueries = {
  getBalance,
};
