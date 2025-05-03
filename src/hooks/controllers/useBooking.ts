import {  getBookingApi, updateBookingStatusApi,getBookingStatusApi } from "@/api/bookingApi";
import { useServiceTypeStore } from "@/store/serviceStore";
import { useMutation, useQuery } from "@tanstack/react-query";


export const usUpdateBooking = () => {
  return useMutation({
    mutationFn: updateBookingStatusApi
  });
};

  export const useGetBooking = () => {
    const { data, isError, isLoading } = useQuery({
      queryKey: ["customesr-booking"],
      queryFn: getBookingApi,
      refetchOnWindowFocus: true,
    });
 
    return {
      data,
      isError,
      isLoading,
    };
  };
export const useGetBookingStatus = () => {
    const {selectedSBooking} = useServiceTypeStore()
    const { data, isError, isLoading } = useQuery({
      queryKey: ["booking-status"],
      queryFn: () => getBookingStatusApi(selectedSBooking?.id),
      refetchOnWindowFocus: true,
    });
 
    return {
      data,
      isError,
      isLoading,
    };
  };
  

