import {
  getAssignmentById,
  getMyAssignments,
  getOpenAssignments,
  postAssignment,
  submitAssignment,
} from "@/api/assignment.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateAssignment = () => {
  return useMutation({
    mutationFn: postAssignment,
  });
};

export const useGetOpenAssignments = () => {
  return useQuery({
    queryKey: ["open-assignments"],
    queryFn: getOpenAssignments,
  });
};

export const useGetMyAssignments = () => {
  return useQuery({
    queryKey: ["my-assignments"],
    queryFn: () => getMyAssignments(),
  });
};

export const useGetAssignmentById = (assignmentId: string) => {
  return useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignmentById(assignmentId),
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAssignment,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
    },
  });
};
