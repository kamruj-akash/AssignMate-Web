import {
  assignmentAction,
  getAssignmentById,
  getMyAssignments,
  getOpenAssignments,
  postAssignment,
  submitAssignment,
} from "@/api";
import { IAssignmentQueryParams } from "@/type";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
    },
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

export function useSuspendedGetMyAssignments(params?: IAssignmentQueryParams) {
  return useSuspenseQuery({
    queryKey: ["my-assignments", params],
    queryFn: () => getMyAssignments(params),
  });
}

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
