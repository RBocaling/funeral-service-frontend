import { getUserProgress } from "@/api/auth";
import { getMyDocuments } from "@/api/funeralDocumentApi";
import { getFuneralSubscriptions } from "@/api/subscribeApi";
import { getUser } from "@/api/user";
import { useQuery } from "@tanstack/react-query";
import { Upload, User, FileCheck, BadgeCheck } from "lucide-react";

const useProgressProfile = () => {
  const {
    isPending,
    isError,
    data = [],
  } = useQuery({
    queryKey: ["getProfileProgress"],
    queryFn: getUserProgress,
  });

  const { data: user, isLoading: userLOading } = useQuery({
    queryKey: ["user-info"],
    queryFn: getUser,
  });

  const { data: info, isLoading: infoLoading } = useQuery({
    queryKey: ["myDocuments2"],
    queryFn: getMyDocuments,
  });

  const { data: isact, isLoading } = useQuery({
    queryKey: ["use-get-subscrioption"],
    queryFn: getFuneralSubscriptions,
    refetchOnWindowFocus: true,
  });

  const hasActiveSubscription = isact?.some(
    (sub: any) => sub.status === "ACTIVE"
  );

  console.log("subs?.hasActive", hasActiveSubscription);

  // ✅ Add extra steps: verification document & active subscription
  const extendedSteps = [
    ...data,
    {
      id: "verification",
      title: "Document Verification",
      description: "Verify your uploaded documents",
      completed: info?.data?.length > 0,
    },

    {
      id: "kyc",
      title: "KYC Verification",
      description: "Upload ID and capture selfie to verify identity",
      completed: user?.isKycVerifiaction ?? false, // ← galing sa API or user store
    },
    {
      id: "subscription",
      title: "Active Subscription",
      description: "Required to unlock full booking features",
      completed: hasActiveSubscription,
    },
  ];

  const customizeData = extendedSteps?.map((item: any) => ({
    ...item,
    icon:
      item?.id === "personal"
        ? User
        : item?.id === "documents"
        ? FileCheck
        : item?.id === "verification-document"
        ? Upload
        : item?.id === "active-subscription"
        ? BadgeCheck
        : null,
  }));

  const completedSteps = extendedSteps.filter(
    (step: any) => step.completed
  ).length;

  const totalSteps = extendedSteps.length;

  const progress = Number(((completedSteps / totalSteps) * 100).toFixed(0));

  // ✅ returns ID of first uncompleted step → used for redirect logic
  const progressProfile =
    extendedSteps.find((step: any) => !step.completed)?.id || null;

  return {
    isLoading: isPending || infoLoading || isLoading || userLOading,
    isError,
    data: customizeData ?? null,
    progress,
    id: progressProfile,
  };
};

export default useProgressProfile;
