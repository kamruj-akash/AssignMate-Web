import apiClient from "@/lib/apiClient";
import {
  IStudentOverview,
  IStudentProfile,
  IUpdateStudentProfilePayload,
} from "@/type";

type TResponse<T> = { success: boolean; message: string; data: T };

export const getStudentOverview = () => {
  return apiClient<TResponse<IStudentOverview>>("/analytics/student/overview");
};

export const getMyStudentProfile = () => {
  return apiClient<TResponse<IStudentProfile>>("/student/me");
};

export const updateStudentProfile = (payload: IUpdateStudentProfilePayload) => {
  return apiClient<TResponse<unknown>>("/student/me", {
    method: "PATCH",
    body: payload,
  });
};
