import { getPaymentHistory, initiateCheckout } from "@/api";
import { IPaymentHistoryQueryParams } from "@/type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

export const useInitiateCheckout = () => {
  return useMutation({
    mutationFn: initiateCheckout,
  });
};

export const useGetPaymentHistory = (params?: IPaymentHistoryQueryParams) => {
  return useQuery({
    queryKey: ["payment-history", params],
    queryFn: () => getPaymentHistory(params),
    placeholderData: keepPreviousData,
  });
};
