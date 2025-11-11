import { useState } from "react";
import {
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addFuneralSubscription } from "@/api/subscribeApi";
import { useGetSubscriptionMain } from "@/hooks/controllers/useSubscribe";
import useUser from "@/hooks/controllers/useUser";

function MySubscriptions() {
  const [months, setMonths] = useState<number>(1);
  const { data: mockSubscriptions } = useGetSubscriptionMain();
  const { data: userInfo } = useUser();

  const pricePerMonth = 1000;

  // ✅ DISCOUNT LOGIC (update total amount)
  const totalAmount = months === 12 ? 10000 : months * pricePerMonth;

  const hasActiveSubscription = mockSubscriptions?.some(
    (sub: any) => sub.status === "ACTIVE"
  );

  const { mutate, isPending } = useMutation({
    mutationFn: addFuneralSubscription,
    onSuccess: (data) => (window.location.href = data?.checkoutUrl),
    onError: () => alert("Error"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ months });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      default:
        return <XCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800 border-green-200";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-3">
              Funeral Service Subscription
            </h1>
            <p className="text-slate-600 text-lg">
              Manage your subscription and view payment history
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT SIDE — FORM */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  New Subscription
                </h2>
              </div>

              {hasActiveSubscription && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">
                      Active Subscription Found
                    </span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    You currently have an active subscription
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Duration Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Select Subscription Duration
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 6, 12].map((monthOption) => (
                      <button
                        key={monthOption}
                        type="button"
                        onClick={() => setMonths(monthOption)}
                        className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                          months === monthOption
                            ? "bg-blue-600 text-white shadow-lg scale-105"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {monthOption} {monthOption === 1 ? "Month" : "Months"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Price per month</span>
                      <span className="font-semibold text-slate-800">
                        {formatAmount(pricePerMonth)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Duration</span>
                      <span className="font-semibold text-slate-800">
                        {months} {months === 1 ? "Month" : "Months"}
                      </span>
                    </div>

                    <div className="h-px bg-slate-300 my-2"></div>

                    {/* Discount label */}
                    {months === 12 && (
                      <p className="text-green-600 font-semibold text-sm bg-green-100 px-3 py-1 rounded-full inline-block">
                        Discount applied — You saved ₱2,000!
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-800">
                        Total Amount
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {formatAmount(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={
                    isPending ||
                    hasActiveSubscription ||
                    userInfo?.isKycVerifiaction !== "VERIFIED"
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isPending ? "Subscribing.." : "Subscribe Now"}
                </button>

                {/* Validation messages */}
                {hasActiveSubscription && (
                  <p className="text-red-500 py-4 px-5 w-full rounded-2xl bg-red-500/20">
                    You currently have an active subscription. Please wait until
                    it expires before subscribing again.
                  </p>
                )}

                {userInfo?.isKycVerifiaction !== "VERIFIED" && (
                  <p className="text-red-500 py-4 px-5 w-full rounded-2xl bg-red-500/20">
                    You are not KYC Verified, Please verify your KYC
                  </p>
                )}
              </form>
            </div>

            {/* RIGHT SIDE — PAYMENT HISTORY */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-slate-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Payment History
                </h2>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {mockSubscriptions?.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No payment history yet</p>
                  </div>
                ) : (
                  mockSubscriptions?.map((subscription: any) => (
                    <div
                      key={subscription.id}
                      className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all bg-slate-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(subscription.status)}
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              subscription.status
                            )}`}
                          >
                            {subscription.status}
                          </div>
                        </div>

                        {subscription?.status === "PENDING" && (
                          <button
                            onClick={() =>
                              (window.location.href =
                                subscription?.paymentInfo?.checkoutUrl)
                            }
                            className="text-xs font-bold py-2 px-4 rounded-full bg-yellow-500 mt-2 cursor-pointer"
                          >
                            Complete Payment
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">Amount</span>
                          <span className="font-bold text-slate-800">
                            {formatAmount(subscription.amount)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">
                            Start Date
                          </span>
                          <span className="text-sm text-slate-700">
                            {formatDate(subscription.startDate)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">
                            Expiration
                          </span>
                          <span className="text-sm text-slate-700">
                            {formatDate(subscription.expirationDate)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-sm text-slate-600">
                            Payment Status
                          </span>
                          <span className="text-sm font-semibold text-slate-700">
                            {subscription.paymentInfo.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MySubscriptions;
