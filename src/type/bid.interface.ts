import { TStudentAssignmentStatus } from "./assignment.interface";

export type TBidStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface IPlaceBidPayload {
  assignmentId: string;
  proposedAmount: number;
  estimatedDelivery: string;
  coverNote: string;
}

export interface IBidQueryParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "proposedAmount" | "estimatedDelivery";
  sortOrder?: "asc" | "desc";
}

// A bid as the assignment owner (student) sees it. Rejected bids are omitted
// by the API.
export interface IAssignmentBid {
  id: string;
  proposedAmount: string;
  estimatedDelivery: string;
  coverNote: string;
  status: TBidStatus;
  expert: {
    id: string;
    userId: string;
    university: string;
    department: string;
    bio: string | null;
    user: { name: string };
  };
}

// A bid as the expert who placed it sees it.
export interface IMyBid {
  id: string;
  assignmentId: string;
  expertId: string;
  proposedAmount: string;
  estimatedDelivery: string;
  coverNote: string;
  status: TBidStatus;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  assignment: {
    title: string;
    description: string;
    status: TStudentAssignmentStatus;
    createdAt: string;
  };
}
