"use client";

import { useState, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { useAddService } from "@/hooks/controllers/useAddService";
import { useAlertStore } from "@/store/alertStore";

const CreateAddtional = ({ isOpen, setIsOpen }: any) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false); // New loading state for image upload
  const [serviceImage, setServiceImage] = useState<any | null>(null);
  const [serviceUrl, setServiceUrl] = useState<string | null>(null);
  const addServiceMutation = useAddService();
  const { showAlert } = useAlertStore();

  const imageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    details: [],
  });

  useEffect(() => {
    if (isOpen && formData.details.length === 0) {
      setFormData((prev: any) => ({
        ...prev,
        details: [{ description: "" }],
      }));
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    const filteredDetails = formData.details.filter(
      (d: any) => d.description.trim() !== ""
    );

    let url = "";
    if (serviceImage) {
      setImageLoading(true); 
      url = await uploadImageToCloudinary(serviceImage);
      setImageLoading(false); 
    }

    console.log("Submitted data:", {
      title: formData.title,

        imageUrl: url,
      details: filteredDetails,
    });
      
    addServiceMutation.mutate(
        {
          name: formData.title,
          description: formData.title,
          serviceType: "ADDITIONAL",
            imgUrl: url,
            detail: filteredDetails,
            price: parseFloat(formData.price),

        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["my-services"],
            });
             showAlert('success', {
              title: 'Success Added!',
              message: 'Your action was completed successfully.',
              autoClose: true,
            });
            setFormData({title: "",
                price: "",
                details: [], });
            setIsOpen(false);
            setLoading(false);
            // onClose()
          },
          onError: async () => {
            await showAlert('error', {
              title: 'Error Add',
              message: 'Something went wrong. Please try again.',
              autoClose: true,
            });
            setLoading(false);
          },
        }
      );

      
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setServiceImage(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setServiceUrl(url);
    } else {
      setServiceUrl(null);
    }
  };

  const handleUploadImageClick = () => {
    imageInputRef.current?.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex gap-2">
          <Plus className="h-5 w-5" /> Create Full Package
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Package</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full py-4"
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter package price"
              value={formData.price}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, price: e.target.value }))
              }
              className="w-full py-4"
            />
          </div>

          {/* Image Upload */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700/20 transition w-full"
            onClick={handleUploadImageClick}
          >
            {serviceUrl ? (
              <img
                src={serviceUrl}
                alt="Service Preview"
                className="object-cover rounded-xl max-h-52"
              />
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-gray-500 text-sm text-center">
                  Click to upload a service image
                </p>
              </div>
            )}
          </div>

        

          {/* Hidden Input for File Upload */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Submit Button */}
          <Button
            disabled={loading || imageLoading}
            onClick={handleSubmit}
            className="w-full py-7 font-semibold hover:bg-sky-500/70 px-7 rounded-full bg-sky-500"
          >
            {loading || imageLoading ? "Submitting..." : "Create Package"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAddtional;
