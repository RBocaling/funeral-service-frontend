import api from "@/services/api"

export const getUser = async () => {
    try {
        const response = await api.get("/funerals");
        return response.data
    } catch (error) {
        throw new Error("User not fount Please try again")
    }
}
export const addPersonalApi = async (data:any) => {
    try {
        const response = await api.post("/funerals", data);
        return response.data
    } catch (error) {
        throw new Error("User not fount Please try again")
    }
}

export const updatePersonalApi = async (data:any) => {
    try {
        const response = await api.put("/funerals", data);
        return response.data
    } catch (error) {
        throw new Error("User not fount Please try again")
    }
}


export const addDocumentApi = async (data:any) => {
    try {
        const response = await api.put("/auth/upload-documents", data);
        return response.data
    } catch (error) {
        throw new Error("User not fount Please try again")
    }
}