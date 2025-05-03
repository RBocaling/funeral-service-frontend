import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

type RegisterData = {
  email: string;
  password: string;
  role: string,
  username: string,
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await api.post("/auth/register", data);
      return response.data;
      },
  });
};
