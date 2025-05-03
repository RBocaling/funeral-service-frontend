import { addDocumentApi, addPersonalApi, updatePersonalApi } from "@/api/user";
import { useMutation } from "@tanstack/react-query";

export const useAddPersonalInfo = () => {
    return useMutation({
      mutationFn: addPersonalApi
    });
  };
export const useAddUploadDocument = () => {
    return useMutation({
      mutationFn: addDocumentApi
    });
};


export const useUpdatePersonalInfo = () => {
    return useMutation({
      mutationFn: updatePersonalApi
    });
  };