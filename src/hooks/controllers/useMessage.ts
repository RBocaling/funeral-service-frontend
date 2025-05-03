import { addMessageApi, getMessageApi, getMessageListApi } from "@/api/message";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddMessageMutate = () => {
    return useMutation({
      mutationFn: addMessageApi
    });
  };


  export const useGetMessage = (conversationId: number) => {
    const {
      data,
      isError,
      isLoading,
      error,
      refetch,
    } = useQuery({
      queryKey: ["messages", conversationId],
      queryFn: () => getMessageApi(conversationId),
      enabled: !!conversationId,
      staleTime: 0, 
      refetchInterval: 1000, 
      refetchIntervalInBackground: true, 
      retry: false,
      refetchOnWindowFocus: true,
    });
  
    return {
      data,
      isLoading,
      isError,
      error,
      refetch,
    };
  };
  export const useGetMessageList = () => {
    const {
      data,
      isError,
      isLoading,
      error,
      refetch,
      
    } = useQuery({
      queryKey: ["messages-list"],
      queryFn: getMessageListApi,
      refetchOnWindowFocus: true,
    });
  
    return {
      data,
      isLoading,
      isError,
      error,
      refetch,
    };
  };
  
  

