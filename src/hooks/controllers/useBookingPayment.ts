import { getFuneralSubscriptions } from "@/api/bookingPaymentApi";
import { useQuery } from "@tanstack/react-query"

const useBookingPayment = () => {
    return useQuery({
      queryKey: ["booking-paument"],
      queryFn: getFuneralSubscriptions,
    });
}

export default useBookingPayment;