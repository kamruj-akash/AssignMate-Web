import { placeBid } from "@/api/bid.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const usePlaceBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: placeBid,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my-assignments", "open-assignments"],
      });
    },
  });
};
