import api from "@/services/api";

export const getFuneralSubscriptions = async () => {
 try {
     const { data } = await api.get(`/payment-booking`);
     return data;
    } catch (error:any) {
    throw new Error(error)
 }
};

