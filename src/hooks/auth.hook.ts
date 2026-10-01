import {
  getMe,
  googleLogin,
  userLogin,
  userRegister,
  verifyExpertRegister,
  verifyRegister,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useGetMe = (enabled = true) => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: googleLogin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useAuth = () => {
  const { mutate: googleLogin, isPending: isGoogleLoginLoading } =
    useGoogleLogin();
  const { mutate: login, isPending: isLoginLoading } = useLogin();
  return {
    login,
    googleLogin,
    isLoginLoading,
    isGoogleLoginLoading,
  };
};

export const useUserRegister = () => {
  return useMutation({
    mutationFn: userRegister,
  });
};

export const useVerifyRegister = () => {
  return useMutation({
    mutationFn: verifyRegister,
  });
};

export const useVerifyExpertRegister = () => {
  return useMutation({
    mutationFn: verifyExpertRegister,
  });
};
