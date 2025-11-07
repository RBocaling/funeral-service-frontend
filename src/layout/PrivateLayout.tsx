// PrivateLayout.tsx
import Alert from "@/components/alerts/Alert";
import CompleteTaskModal from "@/components/profile/CompletePorfile";
import Header from "@/components/shared/Header";
import { ThemeProvider } from "@/components/shared/theme-provider";
// import { useActiveSubscription } from "@/hooks/controllers/useSubscriptions";
import { Outlet } from "react-router-dom";
// import { useLocalStorage } from "@/hooks/useLocalStorage";
import useUser from "@/hooks/controllers/useUser";

const PrivateLayout = () => {
  // const { data } = useActiveSubscription();
  // const [isOpenSubscription] = useLocalStorage("isOpenSubscription", true);
  const { role } = useUser();

  console.log("role", role);

  // Modal open logic: kung walang active subscription o localStorage flag
  // const showModal = !data?.isActive && isOpenSubscription;

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center">
      <div className="relative px-2 overflow-x-hidden w-full">
        <Header />
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <main className="pt-5 md:pt-7 container md:mx-auto">
            <Outlet />
            <Alert />
          </main>
          {role !== "HELPER" && <CompleteTaskModal />}
        </ThemeProvider>
      </div>

      {/* <SubscriptionModal
        isOpen={showModal}
        onClose={() => setIsOpenSubscription(false)}
      /> */}
    </div>
  );
};

export default PrivateLayout;
