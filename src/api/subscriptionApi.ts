import api from "@/services/api";

export const getSubscriptions = async () => {
  const { data } = await api.get(`/subscription`);
  return data;
};

export const addSubscription = async (data: any) => {
  const res = await api.post(`/subscription`, data);
  return res.data;
};

export const getActiveASubscription = async () => {
  const { data } = await api.get(`/subscription/active-subscription`);
  return data;
};
