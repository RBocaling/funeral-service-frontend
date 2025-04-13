import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const user = "User1";

  //   if (isLoading) return <div>Loading...</div>;
  return user ? <Navigate to="/" replace /> : <Outlet />;
}
