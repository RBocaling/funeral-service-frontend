import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addFuneralSubscription } from "@/api/subscribeApi";
import { useGetSubscriptionMain } from "@/hooks/controllers/useSubscribe";
import useUser from "@/hooks/controllers/useUser";

type Props = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

export default function SubscriptionModal({ open, setOpen }: Props) {
  const [months, setMonths] = useState<number>(1);

  const { data: subscriptions } = useGetSubscriptionMain();
  const { data: userInfo } = useUser();

  const pricePerMonth = 1000;

  // ✅ DISCOUNT: if months === 12, total = 10,000 only
  const totalAmount = months === 12 ? 10000 : months * pricePerMonth;

  const hasActiveSubscription = subscriptions?.some(
    (sub: any) => sub.status === "ACTIVE"
  );

  const { mutate, isPending } = useMutation({
    mutationFn: addFuneralSubscription,
    onSuccess: (data) => (window.location.href = data?.checkoutUrl),
  });

  const handleSubscribe = () => mutate({ months });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md rounded-2xl p-6 bg-[#121212] text-gray-100 border border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <CreditCard className="w-6 h-6 text-sky-400" />
            Subscription Plan
          </DialogTitle>
        </DialogHeader>

        {/* Duration */}
        <div className="mt-4">
          <p className="text-sm font-medium mb-3 text-gray-300">
            Select Duration
          </p>

          <div className="grid grid-cols-3 gap-3">
            {[1, 6, 12].map((option) => (
              <button
                key={option}
                onClick={() => setMonths(option)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all relative
                  ${
                    months === option
                      ? "bg-sky-500 text-white shadow-lg scale-105"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
              >
                {option} {option === 1 ? "Month" : "Months"}
                {/* ⭐ Discount badge only for 12 months */}
                {option === 12 && (
                  <span className="absolute -top-2 right-2 bg-green-500 text-black text-[10px] px-2 rounded-full font-bold">
                    SAVE ₱2,000
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-gray-900 mt-6 p-4 rounded-xl border border-gray-700">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Price per month</span>
            <span>₱{pricePerMonth.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>Duration</span>
            <span>{months} months</span>
          </div>

          <div className="h-px bg-gray-700 my-3" />

          {/* ✅ Show discount visual */}
          {months === 12 && (
            <div className="flex justify-between text-xs mb-2 text-red-400">
              <span>Original Price</span>
              <span className="line-through">₱12,000</span>
            </div>
          )}

          <div className="flex justify-between text-lg font-bold text-sky-400">
            <span>Total</span>
            <span>₱{totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Active Subscription */}
        {hasActiveSubscription && (
          <div className="mt-4 p-3 bg-green-500/20 rounded-lg flex items-center gap-2 text-green-400 text-sm">
            <CheckCircle className="w-4 h-4" />
            You already have an active subscription.
          </div>
        )}

        {/* KYC notice */}
        {userInfo?.isKycVerifiaction !== "VERIFIED" && (
          <div className="mt-4 p-3 bg-red-500/20 rounded-lg text-red-400 text-sm">
            ⚠️ You must complete KYC to subscribe.
          </div>
        )}

        <DialogFooter>
          <Button
            disabled={
              isPending ||
              hasActiveSubscription ||
              userInfo?.isKycVerifiaction !== "VERIFIED"
            }
            onClick={handleSubscribe}
            className="w-full py-3 rounded-full bg-sky-500 hover:bg-sky-400 text-gray-900 font-semibold transition-all"
          >
            {isPending ? "Processing..." : "Subscribe Now"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
