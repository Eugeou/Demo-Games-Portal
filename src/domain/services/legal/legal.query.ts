import { useQuery } from "@/infrastructure/plugins/tanstack";
import type { LegalSlug } from "@/domain/types";
import { type ILegalService } from "./legal.interface";

const QUERY_SERVICE_ID = "legal";

const getPage = (service: ILegalService, params?: { slug: LegalSlug }) => {
  return useQuery({
    queryKey: [QUERY_SERVICE_ID, "page", params?.slug ?? ""],
    queryFn: () => {
      if (!params?.slug) {
        return Promise.reject(new Error("LEGAL_SLUG_REQUIRED"));
      }
      return service.getPage(params.slug);
    },
    options: {
      enabled: Boolean(params?.slug),
    },
  });
};

export const useLegalQueries = {
  getPage,
};
