import apiClient from "@/lib/apiClient";
import {
  ILoginPayload,
  IRegisterPayload,
  IVerifyExpertRegisterPayload,
  IVerifyRegisterPayload,
} from "@/type";

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

export const verifyRegister = (payload: IVerifyRegisterPayload) => {
  return apiClient("/auth/verify-register", {
    method: "POST",
    body: payload,
  });
};

export const verifyExpertRegister = ({
  documents,
  ...data
}: IVerifyExpertRegisterPayload) => {
  const formData = new FormData();
  formData.append("body", JSON.stringify(data));
  documents.forEach((file) => formData.append("documents", file));

  return apiClient("/expert/verify", {
    method: "POST",
    body: formData,
  });
};
