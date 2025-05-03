import {  Routes, Route } from "react-router-dom";

// public
import { Login, Register } from "./pages/public/index";

// private
import {
  Booking,
  Dashboard,
  Messages,
  Services,
  Profile
} from "./pages/private/index";

import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import PrivateLayout from "./layout/PrivateLayout";
import PublicLayout from "./layout/PublicLayout";
import PaymentMethodsPage from "./pages/private/paymentMethod";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<PrivateLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/bookings" element={<Booking />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/payment-method" element={<PaymentMethodsPage />} />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
