import { useMutation } from "@/infrastructure/plugins/tanstack";
import { useQueryClient } from "@tanstack/react-query";
import { type ILibraryService } from "./library.interface";

const QUERY_SERVICE_ID = "library";

const toggleSaved = (service: ILibraryService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; gameId: string }) =>
      service.toggleSaved(data.userId, data.gameId),
    options: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "saved", variables.userId],
        });
      },
    },
  });
};

const toggleLiked = (service: ILibraryService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { userId: string; gameId: string }) =>
      service.toggleLiked(data.userId, data.gameId),
    options: {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "liked", variables.userId],
        });
      },
    },
  });
};

const addRecent = (service: ILibraryService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gameId: string) => service.addRecent(gameId),
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "recent"],
        });
      },
    },
  });
};

const removeRecent = (service: ILibraryService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (gameId: string) => service.removeRecent(gameId),
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "recent"],
        });
      },
    },
  });
};

export const useLibraryMutations = {
  toggleSaved,
  toggleLiked,
  addRecent,
  removeRecent,
};
