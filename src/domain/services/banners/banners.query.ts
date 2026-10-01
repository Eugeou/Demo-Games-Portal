import { useQuery } from "@/infrastructure/plugins/tanstack";
import { type IBannersService } from "./banners.interface";

const QUERY_SERVICE_ID = "banners";

const listBanners = (service: IBannersService) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "list"],
    queryFn: () => service.listBanners(),
  });
};

export const useBannersQueries = {
  listBanners,
};
