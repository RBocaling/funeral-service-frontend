import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import api from "@/services/api";

type LoginData = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await api.post("/auth/login", data);
      return response.data;
      },
      
    onSuccess: (data) => {
      if (data?.token?.isEmailVerify) {
        setToken(data.token?.accessToken, data.token?.refreshToken);
      } 
    },
  });
};
