import { useQuery } from "@/infrastructure/plugins/tanstack";
import { type ITelecomPackagesService } from "./telecom-packages.interface";

const QUERY_SERVICE_ID = "telecom-packages";

const listPackages = (service: ITelecomPackagesService) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "list"],
    queryFn: () => service.listPackages(),
  });
};

export const useTelecomPackagesQueries = {
  listPackages,
};
