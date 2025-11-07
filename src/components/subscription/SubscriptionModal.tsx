// SubscriptionModal.tsx
import { useAddSubscription } from "@/hooks/controllers/useSubscriptions";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { useState, useEffect } from "react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const SubscriptionModal = ({
  isOpen,
  onClose,
}: SubscriptionModalProps) => {
  const [months, setMonths] = useState<number>(1);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const addMutation = useAddSubscription();
  const STATIC_AMOUNT_PER_MONTH = 1200;

  useEffect(() => {
    if (!isOpen) {
      setMonths(1);
      setProofFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProofFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (months <= 0) return;

    let proofOfPaymentUrl: string | undefined;
    if (proofFile) {
      setUploading(true);
      try {
        proofOfPaymentUrl = await uploadImageToCloudinary(proofFile);
      } catch (error) {
        console.error("Failed to upload image", error);
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const totalAmount = STATIC_AMOUNT_PER_MONTH * months;

    addMutation.mutate(
      { amount: totalAmount, months, proofOfPayment: proofOfPaymentUrl },
      {
        onSuccess: () => {
          setMonths(1);
          setProofFile(null);
          setPreviewUrl(null);
          if (onClose) onClose();
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2">
      <div className="w-full max-w-lg mt-5 md:h-auto overflow-y-auto rounded-3xl bg-[#121212] text-gray-100 shadow-2xl py-4">
        <div className="flex items-center justify-between border-b border-gray-800 p-5">
          <div>
            <h2 className="text-xl font-bold text-white">Subscription</h2>
            <p className="text-sm text-gray-400 mt-1">
              Enhance your Booking experience and security
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-5">
          <label className="text-gray-400 text-sm">Months</label>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="p-2 border bg-[#343434] text-gray-100 py-3 rounded-2xl"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i === 0 ? "Month" : "Months"} - Total ₱
                {(i + 1) * STATIC_AMOUNT_PER_MONTH}
              </option>
            ))}
          </select>

          <label className="text-gray-400 text-sm">Proof of Payment</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="p-2 border bg-[#343434] text-gray-100 py-2 rounded-2xl"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-xl border border-gray-600"
            />
          )}
        </div>

        <div className="border-t border-gray-800 p-5">
          <button
            onClick={handleSubmit}
            disabled={addMutation.isPending || months <= 0 || uploading}
            className={`w-full rounded-full py-2.5 font-medium text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
              addMutation.isPending || months <= 0 || uploading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-sky-500 hover:bg-sky-400"
            }`}
          >
            {uploading
              ? "Uploading..."
              : addMutation.isPending
              ? "Submitting..."
              : `Submit Subscription - Total ₱${
                  months * STATIC_AMOUNT_PER_MONTH
                }`}
          </button>
          <button
            onClick={onClose}
            className="mt-3 w-full rounded-full py-2.5 font-medium text-gray-100 bg-gray-700 hover:bg-gray-600 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
