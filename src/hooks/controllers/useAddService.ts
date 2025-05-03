import { useMutation, useQuery } from "@tanstack/react-query";
import { addCasketDetailServiceApi, addServiceApi, deleteServiceApi, deleteServiceDetailsApi, getMyServiceApi } from "@/api/services";

export const deleteService = () => {
  return useMutation({
    mutationFn: deleteServiceApi
  });
};
export const deleteDetailService = () => {
  return useMutation({
    mutationFn: deleteServiceDetailsApi
  });
};
export const addCasketDetailService = () => {
  return useMutation({
    mutationFn: addCasketDetailServiceApi
  });
};

export const useAddService = () => {
  return useMutation({
    mutationFn: addServiceApi
  });
};

export const useGetServices = () => {
    const { data, isError, isLoading } = useQuery({
      queryKey: ["my-services"],
      queryFn: getMyServiceApi,
      refetchOnWindowFocus: true,
    });
 
    return {
      data,
      isError,
      isLoading,
    };
  };