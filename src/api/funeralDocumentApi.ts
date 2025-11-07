import api from "@/services/api";

export const getMyDocuments = async () => {
  const { data } = await api.get(`/funeral-document`);
  return data;
};

export const addDocument = async (data: {
  bussinessPermit: string;
  sanitaryPermit: string;
  embalmerLicense: string;
  validId: string;
}) => {
  const response = await api.post(`/funeral-document`, data);
  return response.data;
};

export const getDocumentStatus = async () => {
  const { data } = await api.get(`/funeral-document/active-document`);
  return data;
};
