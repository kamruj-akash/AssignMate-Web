import { TStudentAssignmentStatus } from "./assignment.interface";
import { TBidStatus } from "./bid.interface";
import { TUserStatus } from "./admin.interface";

export interface IStudentOverview {
  assignments: {
    total: number;
    byStatus: Record<TStudentAssignmentStatus, number>;
    completed: number;
    awaitingPayment: number;
  };
  bidsReceived: {
    total: number;
    byStatus: Record<TBidStatus, number>;
  };
  spending: {
    totalPaid: number;
    pendingPayments: number;
    inEscrow: number;
    refunded: number;
  };
  reviewsWritten: number;
}

// /student/me
export interface IStudentProfile {
  id: string;
  institution: string | null;
  academicLevel: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phoneNo: string | null;
    imageUrl: unknown;
    status: TUserStatus;
    emailVerified: boolean;
  };
  stats: {
    assignments: {
      total: number;
      byStatus: Record<TStudentAssignmentStatus, number>;
    };
    bidsReceived: { pending: number };
    spending: {
      totalPaid: number;
      pendingPayments: number;
      inEscrow: number;
      refunded: number;
    };
    reviewsWritten: number;
  };
}

export interface IUpdateStudentProfilePayload {
  name?: string;
  phoneNo?: string;
  institution?: string;
  academicLevel?: string;
}
