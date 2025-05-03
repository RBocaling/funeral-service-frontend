import { useMutation, useQuery } from "@tanstack/react-query";
import { addAvailablePaymentApi, deleteAvailablePaymentApi, getAvailablePaymentApi, updateAvailablePaymentApi } from "@/api/paymentApi";

export const useAddAvailablePayment = () => {
  return useMutation({
    mutationFn: addAvailablePaymentApi
  });
};

export const useUpdateAvailablePayment = () => {
  return useMutation({
    mutationFn: updateAvailablePaymentApi
  });
};
export const useDeleteAvailablePayment = () => {
  return useMutation({
    mutationFn: deleteAvailablePaymentApi
  });
};

export const useGetAvailablePayment = () => {
    const { data, isError, isLoading } = useQuery({
      queryKey: ["my-payment"],
      queryFn: getAvailablePaymentApi,
      refetchOnWindowFocus: true,
    });
 
    return {
      data,
      isError,
      isLoading,
    };
  };