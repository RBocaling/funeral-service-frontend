import api from "@/services/api"

export const loginApi = async (email:string,password:string) => {
    try {
        const response = await api.post("/auth/login", {email,password});
        return response.data
    } catch (error) {
        throw new Error("Invalid Credentials")
    }
}

export const registerApi = async (email:string,password:string, role: String, username:string) => {
    try {
        const response = await api.post("/auth/register", {email,password,role,username});
        return response.data
    } catch (error) {
        throw new Error("Invalid Credentials")
    }
}
export const getUserAuth = async () => {
    try {
        const response = await api.get("/auth/user-auth");
        return response.data
    } catch (error) {
        throw new Error("Invalid Credentials")
    }
}

export const getUserProgress = async () => {
    try {
        const response = await api.get("/auth/funeral-progress");
        return response.data
    } catch (error) {
        throw new Error("Invalid Credentials")
    }
}

export const getUserList = async () => {
    try {
        const response = await api.get("/auth/user-list");
        return response.data
    } catch (error) {
        throw new Error("Invalid Credentials")
    }
}