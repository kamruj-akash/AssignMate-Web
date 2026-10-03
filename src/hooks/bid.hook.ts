import {
  acceptBid,
  deleteBid,
  getBidsByAssignmentId,
  getMyBids,
  placeBid,
} from "@/api";
import { IBidQueryParams } from "@/type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: placeBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bids"] });
      queryClient.invalidateQueries({ queryKey: ["open-assignments"] });
    },
  });
};

export const useGetBidsByAssignmentId = (
  assignmentId: string,
  params?: IBidQueryParams,
) => {
  return useQuery({
    queryKey: ["assignment-bids", assignmentId, params],
    queryFn: () => getBidsByAssignmentId(assignmentId, params),
    enabled: !!assignmentId,
  });
};

export const useGetMyBids = (params?: IBidQueryParams) => {
  return useQuery({
    queryKey: ["my-bids", params],
    queryFn: () => getMyBids(params),
  });
};

export const useAcceptBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptBid,
    onSuccess: () => {
      // accepting closes the assignment and rejects every other bid on it
      queryClient.invalidateQueries({ queryKey: ["assignment-bids"] });
      queryClient.invalidateQueries({ queryKey: ["my-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["open-assignments"] });
    },
  });
};

export const useDeleteBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-bids"] });
    },
  });
};
