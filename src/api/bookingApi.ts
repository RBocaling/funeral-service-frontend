import api from "@/services/api";

export const getBookingApi = async () => {
    try {
      const response = await api.get("/booking/funeral/bookings");
      return response.data;
    } catch (error) {
      throw new Error("Failed to add service");
    }
};
  

export const updateBookingStatusApi = async (payload:{id:number, data: { bookingStatus?:any, location?:any}}) => {
  try {
    const response = await api.put(`/booking/${payload?.id}`, payload?.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add service");
  }
}

export const getBookingStatusApi = async (id:number) => {
  try {
    const response = await api.get(`/booking/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add service");
  }
}

