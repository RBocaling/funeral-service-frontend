import Alert from "@/components/alerts/Alert";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="h-screen bg-red-500 flex flex-col md:overflow-hidden">
      <main className="flex-1 p-4 md:p-0">
        <Outlet />
        <Alert />
      </main>
    </div>
  );
};

export default PublicLayout;
