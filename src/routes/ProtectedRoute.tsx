import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const user = "User1";

  //   if (isLoading) return <div>Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
