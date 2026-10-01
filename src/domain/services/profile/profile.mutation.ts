import { useMutation } from "@/infrastructure/plugins/tanstack";
import type { UpdateProfilePayload } from "@/domain/types";
import { type IProfileService } from "./profile.interface";
import { useQueryClient } from "@tanstack/react-query";

const QUERY_SERVICE_ID = "profile";

const updateProfile = (service: IProfileService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfilePayload) => service.updateProfile(data),
    options: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "profile", variables.userId],
        });
      },
    },
  });
};

export const useProfileMutations = {
  updateProfile,
};
