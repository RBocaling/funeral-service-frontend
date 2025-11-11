import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addDocument,
  getDocumentStatus,
  getMyDocuments,
} from "@/api/funeralDocumentApi";

export const useMyDocuments = () => {
  return useQuery({
    queryKey: ["myDocuments"],
    queryFn: getMyDocuments,
  });
};

export const useDocumentStatus = () => {
  return useQuery({
    queryKey: ["documentStatus"],
    queryFn: getDocumentStatus,
  });
};

export const useAddDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => addDocument(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["documentStatus"] });
      queryClient.invalidateQueries({ queryKey: ["myDocuments2"] });
    },
  });
};