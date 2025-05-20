import api from "@/services/api";

type ParamsType = {
  name: string;
  description: string;
  serviceType: "CASKET" | "FLOWERS" | "FULL_PACKAGE" | "ADDITIONAL";
  imgUrl: string,
  detail?: any,
  price?:any
};



export const addServiceApi = async (data: ParamsType) => {
  try {
    const response = await api.post("/service/add-service", data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add service");
  }
};

// casket details
export const addCasketDetailServiceApi = async ({ data, id }: any) => {
  try {
    const response = await api.post(`/service/add-detail/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to add service");
  }
};

export const getMyServiceApi = async () => {
  try {
    const response = await api.get("/service/my-services");
    return response.data;
  } catch (error) {
    throw new Error("Failed to get services");
  }
};


export const deleteServiceApi = async ( id:number) => {
  try {
    const response = await api.delete(`/service/delete-service/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to get services");
  }
};
export const deleteServiceDetailsApi = async ({serviceType, id}:any) => {
  try {
    const response = await api.delete(`/service/${serviceType}/details/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to get services");
  }
};
