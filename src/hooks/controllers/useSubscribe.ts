import { getFuneralSubscriptions, getSubscriptionActive } from "@/api/subscribeApi";
import { useQuery } from "@tanstack/react-query"

export const useGetSubscriptionMain = () => {
    const { data, isError, isLoading } = useQuery({
      queryKey: ["use-get-subscrioption"],
      queryFn: getFuneralSubscriptions,
      refetchOnWindowFocus: true,
        retry: false,
      refetchInterval:1000
    });
    
      return {
        data,
        role: data,
        isError,
        isLoading,
      };
}
export const useGetIsHashActive = () => {
    const { data, isError, isLoading } = useQuery({
      queryKey: ["use-get-subscrioption-active"],
      queryFn: getSubscriptionActive,
      refetchOnWindowFocus: true,
      retry: false,
    });
    
      return {
        data,
        role: data,
        isError,
        isLoading,
      };
}

