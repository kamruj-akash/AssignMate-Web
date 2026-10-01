import apiClient from "@/lib/apiClient";
import {
  IAssignment,
  IAssignmentQueryParams,
  ICreateAssignmentPayload,
  IPaginatedResponse,
  TAssignmentActionPayload,
  TSubmitAssignmentPayload,
} from "@/type";

export const getOpenAssignments = () => {
  // searchTerm=&page=1&limit=10&sortBy=createdAt&sortOrder=desc
  return apiClient("/assignment/feed");
};

export const postAssignment = ({
  attachment,
  ...data
}: ICreateAssignmentPayload) => {
  const formData = new FormData();
  formData.append("body", JSON.stringify(data));
  formData.append("attachment", attachment);

  return apiClient("/assignment/create", {
    method: "POST",
    body: formData,
  });
};

export const getAssignmentById = (assignmentId: string) => {
  return apiClient(`/assignment/${assignmentId}/get`);
};

export const getMyAssignments = (params?: IAssignmentQueryParams) => {
  // searchTerm=&status=ASSIGNED&page=1&limit=10&sortBy=createdAt&sortOrder=desc
  return apiClient<IPaginatedResponse<IAssignment>>(
    "/assignment/my-assignments",
    {
      method: "GET",
      params,
    },
  );
};

export const submitAssignment = ({
  assignmentId,
  attachment,
  status,
}: TSubmitAssignmentPayload) => {
  const formData = new FormData();
  formData.append("body", JSON.stringify({ status }));
  formData.append("attachment", attachment);
  return apiClient(`/assignment/${assignmentId}/submit`, {
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
