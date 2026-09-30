import { userLogin } from "@/api";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: userLogin,
  });
};
