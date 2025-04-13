import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Outlet } from "react-router-dom";

const PrivateLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="flex-1">
        <Header />

        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <main className="pt-7 container mx-auto">
            <Outlet />
          </main>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default PrivateLayout;
