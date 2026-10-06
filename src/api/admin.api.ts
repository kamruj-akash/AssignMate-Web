import apiClient from "@/lib/apiClient";
import {
  IAdminOverview,
  IAdminStudent,
  IAdminStudentDetails,
  IDateRangeParams,
  IEscrowVault,
  IExpertListResponse,
  IExpertQueryParams,
  IPaginatedResponse,
  IRevenueAnalytics,
  IStudentQueryParams,
  TApproveExpertPayload,
} from "@/type";

type TResponse<T> = { success: boolean; message: string; data: T };

export const getAdminOverview = (params?: IDateRangeParams) => {
  return apiClient<TResponse<IAdminOverview>>("/analytics/admin/overview", {
    method: "GET",
    params,
  });
};

export const getRevenueAnalytics = (params?: IDateRangeParams) => {
  return apiClient<TResponse<IRevenueAnalytics>>(
    "/escrow/admin/revenue-analytics",
    {
      method: "GET",
      params,
    },
  );
};

export const getEscrowVault = (assignmentId: string) => {
  return apiClient<TResponse<IEscrowVault>>(`/escrow/vault/${assignmentId}`);
};

export const getAllExperts = (params?: IExpertQueryParams) => {
  return apiClient<IExpertListResponse>("/expert/get-all", {
    method: "GET",
    params,
  });
};

export const approveExpert = (payload: TApproveExpertPayload) => {
  return apiClient("/expert/approve", {
    method: "POST",
    body: payload,
  });
};

export const getAllStudents = (params?: IStudentQueryParams) => {
  return apiClient<IPaginatedResponse<IAdminStudent>>("/student/get-all", {
    method: "GET",
    params,
  });
};

export const getStudentById = (studentId: string) => {
  return apiClient<TResponse<IAdminStudentDetails>>(`/student/${studentId}`);
};
