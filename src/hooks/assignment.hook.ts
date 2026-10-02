import {
  assignmentAction,
  deleteAssignment,
  getAssignmentById,
  getMyAssignments,
  getOpenAssignments,
  postAssignment,
  submitAssignment,
} from "@/api";
import { IAssignmentQueryParams, IOpenAssignmentQueryParams } from "@/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
    },
  });
};

export const useGetOpenAssignments = (params?: IOpenAssignmentQueryParams) => {
  return useQuery({
    queryKey: ["open-assignments", params],
    queryFn: () => getOpenAssignments(params),
  });
};

export const useGetMyAssignments = (params?: IAssignmentQueryParams) => {
  return useQuery({
    queryKey: ["my-assignments", params],
    queryFn: () => getMyAssignments(params),
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

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
    },
  });
};
