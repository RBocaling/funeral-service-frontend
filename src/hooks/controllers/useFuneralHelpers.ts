import { getFuneralHelperPermissionsApi, getFuneralHelpersApi, updateFuneralHelperApi } from "@/api/updatePermissionApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export const useFuneralHelpers = () => {
  return useQuery({
    queryKey: ["funeralHelpers"],
    queryFn: getFuneralHelpersApi,
  });
};
export const useGetFuneralHelperPermissionsApi = () => {
  return useQuery({
    queryKey: ["funeralHelpers-permission"],
    queryFn: getFuneralHelperPermissionsApi,
  });
};

export const useUpdateHelperPermission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateFuneralHelperApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funeralHelpers"] });
      console.log("✅ Permission updated successfully");
    },
    onError: (error) => console.error("❌ Update failed:", error),
  });
};
