import apiClient from "@/lib/apiClient";
import {
  IInitiateCheckoutResponse,
  IPaginatedResponse,
  IPayment,
  IPaymentHistoryQueryParams,
} from "@/type";

export const initiateCheckout = (assignmentId: string) => {
  return apiClient<IInitiateCheckoutResponse>(
    `/payment/initiate-checkout/${assignmentId}`,
    {
      method: "POST",
    },
  );
};

// /payment/callback/bkash is called by bKash itself, which then redirects the
// browser to /assignment/:id/result, so the frontend never calls it directly.

export const getPaymentHistory = (params?: IPaymentHistoryQueryParams) => {
  return apiClient<IPaginatedResponse<IPayment>>("/payment/history", {
    method: "GET",
    params,
  });
};
