import { getUserList } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

const UseUserList = () => {

  const { data, isError, isLoading } = useQuery({
    queryKey: ["user-list2"],
    queryFn: getUserList,
    retry: false,
  });

    
  return {
    data,
    isError,
    isLoading,
  };
};

export default UseUserList;
