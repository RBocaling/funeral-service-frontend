import api from "@/services/api";

export const getFuneralSubscriptions = async () => {
  const { data } = await api.get(`/funeral-subscription`);
  return data;
};
export const getSubscriptionActive = async () => {
  const { data } = await api.get(`/funeral-subscription/funeral-active`);
  return data;
};

export const addFuneralSubscription = async (data: any) => {
  const res = await api.post(`/funeral-subscription`, data);
  return res.data;
};

export const getFuneralActiveASubscription = async () => {
  const { data } = await api.get(`/funeral-subscription/funeral-active`);
  return data;
};
