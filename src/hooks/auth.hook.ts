import { getMe, googleLogin, userLogin } from "@/api";
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

export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: googleLogin,
  });
};

export const useAuth = () => {
  const { mutate: googleLogin, isPending: isGoogleLoginLoading } =
    useGoogleLogin();
  const { mutate: login, isPending: isLoginLoading } = useLogin();
  const { data, isLoading: isGetMeLoading } = useGetMe();
  const getUser = data?.data;
  return {
    login,
    googleLogin,
    getUser,
    isGetMeLoading,
    isLoginLoading,
    isGoogleLoginLoading,
  };
};
