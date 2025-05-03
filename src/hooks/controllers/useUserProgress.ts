import { getUserProgress } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";
import { Building, Upload, User, Wallet } from "lucide-react";

const useProgressProfile = () => {
  const {
    isPending,
    isError,
    data = [],
  } = useQuery({
    queryKey: ["getProfileProgress"],
    queryFn: getUserProgress,
    refetchOnWindowFocus: true,
  });

  const customizeData = data?.map((item:any) => ({
    ...item,
    icon:
      item?.id === "personal"
        ? User
        : item?.id === "documents"
        ? Upload
        : "",
  }));

  const completedSteps = data?.filter((step:any) => step.completed).length;

  const totalSteps = data?.length;
  const progress = (completedSteps / totalSteps) * 100;

  const progressProfile = data
    ?.filter((item:any) => !item.completed)
    ?.map(({ id }:any) => ({
      id,
    }))[0];

  return {
    isLoading: isPending,
    isError,
    data: customizeData ?? null,
    progress,
    id: progressProfile?.id,
  };
};

export default useProgressProfile;
