import apiClient from "@/lib/apiClient";
import { ICreateAssignmentPayload } from "@/type/assignment.interface";

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

export const getMyAssignments = () => {
  // searchTerm=&status=ASSIGNED&page=1&limit=10&sortBy=createdAt&sortOrder=desc
  return apiClient("/assignment/my-assignments");
};

export const submitAssignment = (
  assignmentId: string,
  { attachment, status }: { attachment: File; status: "SUBMITTED" },
) => {
  const formData = new FormData();
  formData.append("body", JSON.stringify(status));
  formData.append("attachment", attachment);
  console.log(formData);
  return apiClient(`/assignment/${assignmentId}/submit`, {
    method: "POST",
    body: formData,
  });
};

type AssignmentStatus =
  | "IN_PROGRESS"
  | "UNDER_REVIEW"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "DISPUTED";
type TAssignmentActionPayload = {
  assignmentId: string;
  status: AssignmentStatus;
  reason?: string;
};
export const assignmentAction = ({
  assignmentId,
  status,
  reason,
}: TAssignmentActionPayload) => {
  return apiClient(`/assignment/${assignmentId}/action`, {
    method: "POST",
    body: { status, reason },
  });
};
