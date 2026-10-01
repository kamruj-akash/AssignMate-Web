import apiClient from "@/lib/apiClient";
import { ILoginPayload } from "@/type";

export const userLogin = (payload: ILoginPayload) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: payload,
  });
};

export const getMe = () => {
  return apiClient("/auth/me");
};

export const googleLogin = (idToken: string) => {
  return apiClient("/auth/google-login", {
    method: "POST",
    body: { idToken },
  });
};
