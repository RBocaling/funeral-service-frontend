import useUserAuth from "@/hooks/controllers/useUserAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const { isAuthenticated, isLoading } = useUserAuth();

  if (isLoading) return <div>Loading...</div>;

  return !isAuthenticated ? (
    <div className="h-screen md:overflow-y-hidden flex">
      <div className="w-full md:w-1/2 relative z-50 bg-transparent">
        <Outlet />
      </div>
      <div className="hidden md:flex md:w-1/2 p-12  overflow-hidden">
        <img
          src="/bg-40.jpg"
          alt=""
          className="absolute top-0 left-0 h-screen w-full"
        />
      </div>
    </div>
  ) : (
    <Navigate to="/" replace />
  );
}
