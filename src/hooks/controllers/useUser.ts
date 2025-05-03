import { getUser } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {

  const { data, isError, isLoading } = useQuery({
    queryKey: ["user-info"],
    queryFn: getUser,
    refetchOnWindowFocus: true,
  });

    
  return {
    data,
    isError,
    isLoading,
  };
};

export default useUser;
