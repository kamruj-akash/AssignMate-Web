import {
  assignmentAction,
  getAssignmentById,
  getMyAssignments,
  getOpenAssignments,
  postAssignment,
  submitAssignment,
} from "@/api";
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
    queryFn: () => getMyAssignments,
  });
};

export const useGetAssignmentById = (assignmentId: string) => {
  return useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => getAssignmentById,
  });
};

export const useSubmitAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
    },
  });
};

export const useAssignmentAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assignmentAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
    },
  });
};
