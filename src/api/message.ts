import api from "@/services/api";

export const addMessageApi = async (data: any) => {
    try {
      const response = await api.post("/messages/send-message", data);
      return response.data;
    } catch (error) {
      throw new Error("Failed to add service");
    }
  };
  export const getMessageApi = async (conversationId: number) => {
    try {
      const response = await api.get(`/messages/byId/${conversationId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Failed to fetch messages.");
    }
  };
export const getMessageListApi = async () => {
    try {
      const response = await api.get("/messages/funeral-message-list");
      return response.data;
    } catch (error) {
      throw new Error("Failed to add service");
    }
  };