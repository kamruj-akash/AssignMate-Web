import apiClient from "@/lib/apiClient";
import { IPlaceBidPayload } from "@/type";

export const placeBid = async (payload: IPlaceBidPayload) => {
  return apiClient("/bid/make-bid", {
    method: "POST",
    body: payload,
  });
};
