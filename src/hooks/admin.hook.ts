import {
  approveExpert,
  getAdminOverview,
  getAllExperts,
  getAllStudents,
  getEscrowVault,
  getRevenueAnalytics,
  getStudentById,
} from "@/api";
import {
  IDateRangeParams,
  IExpertQueryParams,
  IStudentQueryParams,
} from "@/type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetAdminOverview = (params?: IDateRangeParams) => {
  return useQuery({
    queryKey: ["admin-overview", params],
    queryFn: () => getAdminOverview(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetRevenueAnalytics = (params?: IDateRangeParams) => {
  return useQuery({
    queryKey: ["revenue-analytics", params],
    queryFn: () => getRevenueAnalytics(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetEscrowVault = (assignmentId: string, enabled = true) => {
  return useQuery({
    queryKey: ["escrow-vault", assignmentId],
    queryFn: () => getEscrowVault(assignmentId),
    enabled,
  });
};

export const useGetAllExperts = (params?: IExpertQueryParams) => {
  return useQuery({
    queryKey: ["admin-experts", params],
    queryFn: () => getAllExperts(params),
    placeholderData: keepPreviousData,
  });
};

export const useApproveExpert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveExpert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-experts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
  });
};

export const useGetAllStudents = (params?: IStudentQueryParams) => {
  return useQuery({
    queryKey: ["admin-students", params],
    queryFn: () => getAllStudents(params),
    placeholderData: keepPreviousData,
  });
};

export const useGetStudentById = (studentId: string, enabled = true) => {
  return useQuery({
    queryKey: ["admin-student", studentId],
    queryFn: () => getStudentById(studentId),
    enabled,
  });
};
