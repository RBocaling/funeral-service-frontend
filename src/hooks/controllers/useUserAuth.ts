import { getUserAuth } from "@/api/auth";
import { useAuthStore } from "@/store/authStore";
import { useQuery } from "@tanstack/react-query";

const useUserAuth = () => {
  const { accessToken } = useAuthStore.getState();

  const { data, isError, isLoading , refetch} = useQuery({
    queryKey: ["user-auth"],
    queryFn: getUserAuth,
    enabled: !!accessToken, 
    refetchOnWindowFocus: true,
  });

  return {
    data,
    isError,
    isLoading,
    refetch,
    isAuthenticated: Boolean(data && accessToken),
  };
};

export default useUserAuth;
