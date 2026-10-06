import {
  getMyStudentProfile,
  getStudentOverview,
  updateStudentProfile,
} from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetStudentOverview = () => {
  return useQuery({
    queryKey: ["student-overview"],
    queryFn: getStudentOverview,
  });
};

export const useGetMyStudentProfile = () => {
  return useQuery({
    queryKey: ["student-profile"],
    queryFn: getMyStudentProfile,
  });
};

export const useUpdateStudentProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStudentProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};
