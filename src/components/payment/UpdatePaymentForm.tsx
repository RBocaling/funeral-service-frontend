"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAddAvailablePayment, useUpdateAvailablePayment } from "@/hooks/controllers/useAvailablePayment";
import { useQueryClient } from "@tanstack/react-query";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";

export default function UpdatePaymentForm({ onClose, paymentInfo }: any) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    paymentInfoImageUrl: null as File | null,
    paymentName: "",
    paymentType: "bank",
    paymentNumber: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const updatePayment = useUpdateAvailablePayment();

  useEffect(() => {
    if (paymentInfo) {
      setFormData({
        paymentInfoImageUrl: null,
        paymentName: paymentInfo.paymentName || "",
        paymentType: paymentInfo.paymentType || "bank",
        paymentNumber: paymentInfo.paymentNumber || "",
      });
      setImagePreview(null); // Reset preview on modal open
    }
  }, [paymentInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, paymentInfoImageUrl: file }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, paymentType: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let documentUrl = paymentInfo?.paymentInfoImageUrl ?? "";
    if (formData.paymentInfoImageUrl) {
      documentUrl = await uploadImageToCloudinary(formData.paymentInfoImageUrl);
    }

    updatePayment.mutate(
        {
          id: Number(paymentInfo?.id),
            data: {
                paymentName: formData.paymentName,
                paymentNumber: formData.paymentNumber,
                paymentType: formData.paymentType,
                paymentInfoImageUrl: documentUrl,
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["my-payment"] });
          onClose();
        },
        onError: (error: any) => {
          console.error(
            "Add message failed:",
            error.response?.data?.message || error.message
          );
        },
      }
    );
  };

  if (!paymentInfo) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full">
      <div className="w-full">
        <label className="block text-sm font-medium mb-1">Upload Image</label>
        <Input
          type="file"
          accept="image/*"
          name="paymentInfoImageUrl"
          onChange={handleFileChange}
          className="py-4 w-full"
        />
        {(imagePreview || paymentInfo?.paymentInfoImageUrl) && (
          <img
            src={imagePreview || paymentInfo.paymentInfoImageUrl}
            alt="Preview"
            className="mt-2 h-24 object-contain rounded"
          />
        )}
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium mb-1">Payment Name</label>
        <Input
          name="paymentName"
          placeholder="GCash, BDO, PayMaya, etc."
          value={formData.paymentName}
          onChange={handleChange}
          className="py-4 w-full"
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium mb-1">Payment Type</label>
        <Select value={formData.paymentType} onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full py-7 rounded-2xl">
            <SelectValue placeholder="Select payment type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bank">Bank</SelectItem>
            <SelectItem value="e-wallet">E-Wallet</SelectItem>
            <SelectItem value="credit-card">Credit Card</SelectItem>
            <SelectItem value="debit-card">Debit Card</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium mb-1">Account Number</label>
        <Input
          name="paymentNumber"
          placeholder="0917-****-3456"
          value={formData.paymentNumber}
          onChange={handleChange}
          className="py-4 w-full"
        />
      </div>

      <div className="flex justify-end pt-4">
      <Button type="submit" className="textr-white bg-sky-500 shadow-xl shadow-sky-500/50 py-1 px-5 rounded-full">
              {updatePayment.isPending ? "Updating..": "Update"}
              </Button>
      </div>
    </form>
  );
}
