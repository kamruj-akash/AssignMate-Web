import apiClient from "@/lib/apiClient";
import { ILoginPayload, IRegisterPayload } from "@/type";

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

export const userRegister = (payload: IRegisterPayload) => {
  if (!payload.role) {
    throw new Error("Role is required");
  }

  const endpoint =
    payload.role === "STUDENT"
      ? "/auth/register"
      : payload.role === "EXPERT"
        ? "/expert/register"
        : null;

  if (!endpoint) {
    throw new Error("Invalid role");
  }

  return apiClient(endpoint, {
    method: "POST",
    body: payload,
  });
};
