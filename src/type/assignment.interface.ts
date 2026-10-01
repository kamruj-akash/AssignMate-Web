export interface ICreateAssignmentPayload {
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  attachment: File;
}

export type TSubmitAssignmentPayload = {
  assignmentId: string;
  attachment: File;
  status: "SUBMITTED";
};
export type AssignmentStatus =
  | "IN_PROGRESS"
  | "UNDER_REVIEW"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "DISPUTED";
export type TAssignmentActionPayload = {
  assignmentId: string;
  status: AssignmentStatus;
  reason?: string;
};
