import apiClient from "@/lib/apiClient";
import {
  IAssignmentBid,
  IBidQueryParams,
  IMyBid,
  IPaginatedResponse,
  IPlaceBidPayload,
} from "@/type";

export const placeBid = (payload: IPlaceBidPayload) => {
  return apiClient("/bid/make-bid", {
    method: "POST",
    body: payload,
  });
};

export const getBidsByAssignmentId = (
  assignmentId: string,
  params?: IBidQueryParams,
) => {
  return apiClient<IPaginatedResponse<IAssignmentBid>>(
    `/bid/assignment/${assignmentId}`,
    {
      method: "GET",
      params,
    },
  );
};

export const getMyBids = (params?: IBidQueryParams) => {
  return apiClient<IPaginatedResponse<IMyBid>>("/bid/my-bids", {
    method: "GET",
    params,
  });
};

export const acceptBid = (bidId: string) => {
  return apiClient(`/bid/${bidId}/accept`, {
    method: "PUT",
  });
};

export const deleteBid = (bidId: string) => {
  return apiClient(`/bid/${bidId}/delete`, {
    method: "DELETE",
  });
};
