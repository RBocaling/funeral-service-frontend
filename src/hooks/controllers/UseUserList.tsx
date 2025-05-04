import { getUserList } from "@/api/auth";
import { getUser } from "@/api/user";
import { useQuery } from "@tanstack/react-query";

const UseUserList = () => {

  const { data, isError, isLoading } = useQuery({
    queryKey: ["user-list2"],
    queryFn: getUserList,
  });

    
  return {
    data,
    isError,
    isLoading,
  };
};

export default UseUserList;
