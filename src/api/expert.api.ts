import apiClient from "@/lib/apiClient";
import {
  IExpertEarning,
  IExpertEarningsQueryParams,
  IExpertOverview,
  IExpertReviews,
  IPaginatedResponse,
  IUpdateExpertProfilePayload,
} from "@/type";

type TResponse<T> = { success: boolean; message: string; data: T };

export const getExpertOverview = () => {
  return apiClient<TResponse<IExpertOverview>>("/analytics/expert/overview");
};

export const getExpertEarnings = (params?: IExpertEarningsQueryParams) => {
  return apiClient<IPaginatedResponse<IExpertEarning>>(
    "/escrow/expert/earnings",
    {
      method: "GET",
      params,
    },
  );
};

export const updateExpertProfile = (payload: IUpdateExpertProfilePayload) => {
  return apiClient<TResponse<unknown>>("/expert/profile", {
    method: "PATCH",
    body: payload,
  });
};

export const getExpertReviews = (
  expertId: string,
  params?: { page?: number; limit?: number },
) => {
  return apiClient<IExpertReviews>(`/review/expert/${expertId}`, {
    method: "GET",
    params,
  });
};
