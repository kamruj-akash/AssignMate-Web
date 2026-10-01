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

export type TStudentAssignmentStatus =
  | "OPEN"
  | "ASSIGNED"
  | "AWAITING_PAYMENT"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export interface IAssignmentQueryParams {
  page?: number;
  limit?: number;
  status?: TStudentAssignmentStatus | "OPEN";
  searchTerm?: string;
}

export interface IAssignment {
  id: string;
  studentId: string;
  title: string;
  description: string;
  attachmentUrl: string | null;
  budget: string;
  deadline: string;
  status: TStudentAssignmentStatus;
  assignedExpertId: string | null;
  submissionUrl: { url: string; publicId: string } | null;
  disputedReason: string | null;
  acceptedBidId: string | null;
  createdAt: string;
  updatedAt: string;
  assignedExpert: {
    id: string;
    university: string;
    department: string;
    user: { name: string; email: string };
  } | null;
  _count: { bids: number };
}

export interface IPaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
