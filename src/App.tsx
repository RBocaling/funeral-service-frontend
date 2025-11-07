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
import MySubscriptions from "./pages/private/MySubscriptions";
import { MyFuneralDocuments } from "./pages/private/FuneralDocument";
import FuneralHelpersPage from "./pages/private/FuneralHelpersPage";
import KYCVerification from "./pages/private/Kyc";
import BookingPayment from "./pages/private/bookingPayment";

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
          <Route path="/my-subscriptions" element={<MySubscriptions />} />
          <Route path="/my-documents" element={<MyFuneralDocuments />} />
          <Route path="/my-helpers" element={<FuneralHelpersPage />} />
          <Route path="/kyc-verification" element={<KYCVerification />} />
          <Route
            path="/booking-payment-management"
            element={<BookingPayment />}
          />
        </Route>
      </Route>

      {/* Fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
}
