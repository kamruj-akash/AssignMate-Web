import { TEscrowStatus, TExpertVerificationStatus, TUserStatus } from "./admin.interface";
import { TStudentAssignmentStatus } from "./assignment.interface";
import { TBidStatus } from "./bid.interface";

export interface IExpertOverview {
  profile: {
    isVerified: boolean;
    verificationStatus: TExpertVerificationStatus;
  };
  bids: {
    total: number;
    byStatus: Record<TBidStatus, number>;
    winRate: number;
  };
  assignments: {
    total: number;
    byStatus: Record<TStudentAssignmentStatus, number>;
  };
  earnings: {
    walletBalance: number;
    released: number;
    pendingInEscrow: number;
  };
  reputation: {
    totalReviews: number;
    averageRating: number;
  };
}

export interface IExpertEarningsQueryParams {
  status?: TEscrowStatus;
  page?: number;
  limit?: number;
}

export interface IExpertEarning {
  id: string;
  status: TEscrowStatus;
  totalAmount: number;
  expertEarningsRate: number;
  payout: number;
  disbursedAt: string | null;
  createdAt: string;
  assignment: {
    id: string;
    title: string;
    status: TStudentAssignmentStatus;
    studentName: string;
  };
}

// /auth/me for an expert account.
export interface IExpertMe {
  id: string;
  name: string;
  email: string;
  phoneNo: string | null;
  role: "EXPERT";
  status: TUserStatus;
  authProvider: "CREDENTIAL" | "GOOGLE";
  createdAt: string;
  expert: {
    id: string;
    university: string;
    department: string;
    bio: string | null;
    ratePerAssignment: string;
    isVerified: boolean;
    walletBalance: string;
    verificationStatus: TExpertVerificationStatus;
    rejectionReason: string | null;
  };
}

export interface IUpdateExpertProfilePayload {
  name?: string;
  phoneNo?: string;
  bio?: string;
  ratePerAssignment?: number;
}

export interface IExpertReviews {
  success: boolean;
  data: {
    summary: {
      totalReviews: number;
      averageRating: number;
      distribution: Record<"1" | "2" | "3" | "4" | "5", number>;
    };
    reviews: {
      id: string;
      rating: number;
      comment: string | null;
      createdAt: string;
      assignment: { id: string; title: string };
      student: { id: string; name: string };
    }[];
  };
  meta: { page: number; limit: number; total: number; totalPages: number };
}
