import {
  getExpertEarnings,
  getExpertOverview,
  getExpertReviews,
  updateExpertProfile,
} from "@/api";
import { IExpertEarningsQueryParams } from "@/type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

export const useGetExpertOverview = () => {
  return useQuery({
    queryKey: ["expert-overview"],
    queryFn: getExpertOverview,
  });
};

export const useGetExpertEarnings = (params?: IExpertEarningsQueryParams) => {
  return useQuery({
    queryKey: ["expert-earnings", params],
    queryFn: () => getExpertEarnings(params),
    placeholderData: keepPreviousData,
  });
};

export const useUpdateExpertProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExpertProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useGetExpertReviews = (expertId: string | undefined, limit = 5) => {
  return useQuery({
    queryKey: ["expert-reviews", expertId, limit],
    queryFn: () => getExpertReviews(expertId as string, { limit }),
    enabled: !!expertId,
  });
};
