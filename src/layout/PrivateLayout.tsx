import Alert from "@/components/alerts/Alert";
import CompleteTaskModal from "@/components/profile/CompletePorfile";
import Header from "@/components/shared/Header";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Outlet } from "react-router-dom";

const PrivateLayout = () => {
  return (
    <div className=" min-h-screen w-full relative flex flex-col items-center">
      <div className=" relative px-2 overflow-x-hidden w-full">
        <Header />

        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <main className="pt-5 md:pt-7 container md:mx-auto">
            <Outlet />
            <Alert />
          </main>
          <CompleteTaskModal />
        </ThemeProvider>
        
      </div>
    </div>
  );
};

export default PrivateLayout;
