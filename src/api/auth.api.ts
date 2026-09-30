import apiClient from "@/lib/apiClient";
import { ILoginPayload } from "@/type";

export const userLogin = (payload: ILoginPayload) => {
  return apiClient("/auth/login", {
    method: "POST",
    body: payload,
  });
};
