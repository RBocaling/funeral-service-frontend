import api from "@/services/api";

export const getFuneralHelperPermissionsApi = async () => {
  const res = await api.get("/funeral-helper/permission");
  return res.data;
};
export const getFuneralHelpersApi = async () => {
  const res = await api.get("/funeral-helper");
  return res.data;
};

export const updateFuneralHelperApi = async (data: {
  helperId: number;
  isAllowDashboard?: boolean;
  isAllowServices?: boolean;
  isAllowBookings?: boolean;
}) => {
  const res = await api.put("/funeral-helper", data);
  return res.data;
};

export const createHelperApi = async (data: any) => {
  const res = await api.post("/funeral-helper", data);
  return res.data;
};