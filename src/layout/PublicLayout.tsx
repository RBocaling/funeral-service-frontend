import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
