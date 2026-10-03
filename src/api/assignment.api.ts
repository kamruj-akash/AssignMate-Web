import apiClient from "@/lib/apiClient";
import {
  IAssignment,
  IAssignmentQueryParams,
  ICreateAssignmentPayload,
  IOpenAssignment,
  IOpenAssignmentQueryParams,
  IPaginatedResponse,
  TAssignmentActionPayload,
  TAssignmentDetails,
  TSubmitAssignmentPayload,
} from "@/type";

export const getOpenAssignments = (params?: IOpenAssignmentQueryParams) => {
  return apiClient<IPaginatedResponse<IOpenAssignment>>("/assignment/feed", {
    method: "GET",
    params,
  });
};

export const postAssignment = ({
  attachment,
  ...data
}: ICreateAssignmentPayload) => {
  const formData = new FormData();
  formData.append("body", JSON.stringify(data));
  if (attachment) formData.append("attachment", attachment);

  return apiClient("/assignment/create", {
    method: "POST",
    body: formData,
  });
};

export const getAssignmentById = (assignmentId: string) => {
  return apiClient<{ success: boolean; message: string; data: TAssignmentDetails }>(
    `/assignment/${assignmentId}/get`,
  );
};

// Students get IAssignment rows, experts get IExpertAssignment rows.
export const getMyAssignments = <T = IAssignment>(
  params?: IAssignmentQueryParams,
) => {
  // searchTerm=&status=ASSIGNED&page=1&limit=10&sortBy=createdAt&sortOrder=desc
  return apiClient<IPaginatedResponse<T>>(
    "/assignment/my-assignments",
    {
      method: "GET",
      params,
    },
  );
};

export const submitAssignment = (payload: TSubmitAssignmentPayload) => {
  const formData = new FormData();
  formData.append("body", JSON.stringify({ status: payload.status }));
  if (payload.status === "SUBMITTED") {
    formData.append("attachment", payload.attachment);
  }
  return apiClient(`/assignment/${payload.assignmentId}/submit`, {
    method: "PATCH",
    body: formData,
  });
};

export const assignmentAction = ({
  assignmentId,
  status,
  reason,
}: TAssignmentActionPayload) => {
  return apiClient(`/assignment/${assignmentId}/action`, {
    method: "PATCH",
    body: { status, reason },
  });
};

export const deleteAssignment = (assignmentId: string) => {
  return apiClient(`/assignment/${assignmentId}/delete`, {
    method: "DELETE",
  });
};
