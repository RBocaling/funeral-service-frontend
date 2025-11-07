import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import Card from "@/components/Card";
import { formatCurrency, formatDateTime } from "@/utils/formatter";
import useBookingPayment from "@/hooks/controllers/useBookingPayment";
import TitlePage from "@/components/ui/title-page";


export default function FuneralPaymentManagement() {
      const { data:bookings, isLoading } = useBookingPayment();
  const allPayments = bookings?.flatMap((b) =>
    (b.payments || []).map((p:any) => ({ ...p, booking: b }))
    );
    console.log("allPayments", bookings);
    

  const totalEarnings = allPayments
    ?.filter(
      (p) => p.booking?.bookingStatus === "COMPLETED" && p?.status === "PAID"
    )
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = allPayments
    ?.filter(
      (p) => p.booking?.bookingStatus === "PENDING" && p?.status === "PAID"
    )
    .reduce((sum, p) => sum + p.amount, 0);

  const completedCount = allPayments?.filter(
    (p) => p.booking?.bookingStatus === "COMPLETED" && p?.status === "PAID"
  ).length;

  const stats = [
    {
      label: "Total Earnings",
      value: isLoading ? "Computing.." : formatCurrency(totalEarnings ?? 0),
      icon: TrendingUp,
      color: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      label: "Pending Payments",
      value: isLoading ? "Computing.." : formatCurrency(pendingAmount ?? 0),
      icon: Clock,
      color: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Completed",
      value: isLoading ? "Computing.." : completedCount?.toString(),
      icon: CheckCircle,
      color: "bg-blue-50",
      iconColor: "text-blue-600",
    },
  ];

  return (
    <div className="space-y-6">
      <TitlePage label="Booking Online Payments" />
      <div className="grid md:grid-cols-3 gap-4">
        {stats?.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl ${stat.color} flex items-center justify-center`}
                  >
                    <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Payment History
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            All transactions and payments
          </p>
        </div>

        <div className="divide-y divide-gray-100">
          {allPayments?.length === 0 ? (
            <div className="p-12 text-center">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No payments yet</p>
            </div>
          ) : (
            allPayments?.map((payment) => (
              <div
                key={payment.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        Booking #{payment.bookingId}
                      </h3>
                      Payment:
                      <StatusBadge status={payment.status} />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDateTime(payment.createdAt)}</span>
                      </div>
                      {payment.booking?.customer && (
                        <p className="text-sm text-gray-600">
                          Customer: {payment.booking.customer.firstName}{" "}
                          {payment.booking.customer.lastName}
                        </p>
                      )}
                      <p className="text-xs font-bold ">
                        {" "}
                        Booking Status{" "}
                        <span className="py-2 px-4 rounded-full text-yellow-500 bg-yellow-500/10">
                          {payment.booking?.bookingStatus}
                        </span>
                      </p>
                      {payment.adminHold && (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg">
                          <Clock className="w-3 h-3" />
                          Held by Admin
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Total: {formatCurrency(payment.totalWithFee)}
                    </p>
                    <div className="">
                      <p className="text-base font-bold text-green-500">
                        Payment Info
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Payment Method:{" "}
                        <span className="font-bold">
                          {payment.booking.funeralReceiveType}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Payment Number:{" "}
                        <span className="font-bold">
                          {payment.booking.funeralReceiveEWalletNumber}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
