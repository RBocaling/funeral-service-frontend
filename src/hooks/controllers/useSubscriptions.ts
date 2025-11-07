import { addSubscription, getActiveASubscription, getSubscriptions } from "@/api/subscriptionApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useMySubscriptions = () => {
  return useQuery({
    queryKey: ["mySubscriptions"],
    queryFn: getSubscriptions,
  });
};

export const useActiveSubscription = () => {
  return useQuery({
    queryKey: ["activeSubscsription"],
    queryFn: getActiveASubscription,
  });
};

export const useAddSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => addSubscription(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["activeSubscription"] });
    },
  });
};
