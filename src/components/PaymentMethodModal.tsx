import { useState } from "react";
import { X, CreditCard, Building2, Wallet, AlertCircle } from "lucide-react";
import { formatCurrency } from "../utils/formatter";

interface PaymentMethodModalProps {
  booking: any;
  onClose: () => void;
  onSubmit:(data:any)=>void;
}

export default function PaymentMethodModal({
  booking,
    onClose,
  onSubmit
}: PaymentMethodModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [accountDetails, setAccountDetails] = useState<string>("");

  const payment = booking.payments?.[0];
  const paymentMethods = [
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      icon: Building2,
      placeholder: "Enter bank name and account number",
    },
    {
      id: "gcash",
      name: "GCash",
      icon: Wallet,
      placeholder: "Enter GCash mobile number",
    },
    {
      id: "card",
      name: "Card",
      icon: CreditCard,
      placeholder: "Enter card details",
    },
  ];

  const handleConfirm = () => {
    if (selectedMethod && accountDetails.trim()) {
      onSubmit({ selectedMethod, accountDetails });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Select Payment Method
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Choose how you want to receive payment from admin
          </p>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Amount to Receive</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(payment?.amount || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Booking #{booking.id}</p>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedMethod === method.id;
              return (
                <div key={method.id} className="space-y-2">
                  <button
                    onClick={() => {
                      setSelectedMethod(method.id);
                      setAccountDetails("");
                    }}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isSelected ? "bg-blue-500" : "bg-gray-100"
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isSelected ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <span
                      className={`font-medium ${
                        isSelected ? "text-blue-900" : "text-gray-900"
                      }`}
                    >
                      {method.name}
                    </span>
                  </button>

                  {isSelected && (
                    <div className="pl-4 animate-in slide-in-from-top-2 duration-200">
                      <input
                        type="text"
                        value={accountDetails}
                        onChange={(e) => setAccountDetails(e.target.value)}
                        placeholder={method.placeholder}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-start p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg shadow-md max-w-md mx-auto mt-4">
          <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-1">
              Important Payment Notice
            </h3>
            <p className="text-yellow-700 text-sm">
              Please make sure your bank or GCash number is correct before
              proceeding. The system will not be responsible for any incorrect
              payments. Double-check your details to avoid issues.
            </p>
          </div>
        </div>
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button
            onClick={handleConfirm}
            disabled={!selectedMethod || !accountDetails.trim()}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-200 ${
              selectedMethod && accountDetails.trim()
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Confirm & Complete Booking
          </button>
        </div>
      </div>
    </div>
  );
}
