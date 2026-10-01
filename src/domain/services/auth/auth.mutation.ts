/**
 * Auth mutation
 */

import { useMutation } from "@/infrastructure/plugins/tanstack";
import {
  type IAuthService,
  type RequestOtpPayload,
  type VerifyOtpPayload,
} from "./auth.interface";
import { useQueryClient } from "@tanstack/react-query";

const QUERY_SERVICE_ID = "auth";

const requestOtp = (service: IAuthService) => {
  return useMutation({
    mutationFn: (data: RequestOtpPayload) => service.requestOtp(data),
  });
};

const verifyOtp = (service: IAuthService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyOtpPayload) => service.verifyOtp(data),
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "getUserInfo"],
        });
      },
    },
  });
};

const logout = (service: IAuthService) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => service.logout(),
    options: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_SERVICE_ID, "getUserInfo"],
        });
      },
    },
  });
};

export const useAuthMutations = {
  requestOtp,
  verifyOtp,
  logout,
};
