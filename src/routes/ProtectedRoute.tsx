import useUserAuth from "@/hooks/controllers/useUserAuth";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading} = useUserAuth()


  if (isLoading) return <div>Loading...</div>;
  

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
