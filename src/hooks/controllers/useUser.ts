import { getUser } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {

  const { data, isError, isLoading } = useQuery({
    queryKey: ["user-info"],
    queryFn: getUser,
    refetchOnWindowFocus: true,
    retry: false,
  });

  return {
    data,
    role: data?.user?.role,
    isError,
    isLoading,
    isKycVerify: data?.isKycVerifiaction ?? false,
  };
};

export default useUser;
