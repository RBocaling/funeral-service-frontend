import api from "@/services/api"

export const addAvailablePaymentApi = async (data:any) => {
    try {
        const response = await api.post("/funerals/add-payment", data);
        return response.data
    } catch (error) {
        throw new Error("Error add payment")
    }
}
export const updateAvailablePaymentApi = async (payload:any) => {
    try {
        const response = await api.put(`/funerals/update-payment/${payload?.id}`, payload?.data );
        return response.data
    } catch (error) {
        throw new Error("Error update payment")
    }
}
export const getAvailablePaymentApi = async () => {
    try {
        const response = await api.get("/funerals/get-payment");
        return response.data
    } catch (error) {
        throw new Error("Error update payment")
    }
}

export const deleteAvailablePaymentApi = async (id:number) => {
    try {
        const response = await api.delete(`/funerals/delete-payment/${id}`);
        return response.data
    } catch (error) {
        throw new Error("Error update payment")
    }
}