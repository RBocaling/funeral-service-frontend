import { useServiceTypeStore } from "@/store/serviceStore";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { addCasketDetailService } from "@/hooks/controllers/useAddService";
import { useQueryClient } from "@tanstack/react-query";
import { useAlertStore } from "@/store/alertStore";

const AddCasketDetail = ({
  isOpen,
  setIsOpen,
  serviceId,
  closeMain,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  serviceId: number;
  closeMain: () => void;
}) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    selectedColor: "",
    selectedSize: "",
    price: 0,
    materialType: "",
    flowerType: "",
  });
  const { showAlert } = useAlertStore();
  const { serviceType } = useServiceTypeStore();
  const mutation = addCasketDetailService();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const details = {
      color: formData.selectedColor,
      size: formData.selectedSize,
      price: Number(formData.price),
      casketType: formData.materialType,
      flowerType: formData.flowerType,
    };
    const payloads = {
      serviceType: serviceType,
      detail: details,
    };

    mutation.mutate(
      {
        data: payloads,
        id: Number(serviceId),
      },
      {
        onSuccess:async () => {
          await showAlert('success', {
            title: 'Success Added!',
            message: 'Your action was completed successfully.',
            autoClose: true,
          });
          setIsOpen(false);
          closeMain();
          queryClient.invalidateQueries({
            queryKey: ["my-services"],
          });
        },
        onError: async (error) => {
          await showAlert('error', {
            title: 'Error',
            message: 'Something went wrong. Please try again.',
            autoClose: true,
          });
          console.error("Error adding casket detail", error);
        },
      }
    );
  };

  console.log("serviceId", serviceId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">{serviceType} Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-7">
          {/* Size */}
          <div className="space-y-2">
            <Label htmlFor="size">Select Size</Label>
            <Select
              value={formData.selectedSize}
              onValueChange={(value) =>
                handleInputChange("selectedSize", value)
              }
            >
              <SelectTrigger className="w-full py-6 rounded-2xl">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SMALL">Small</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LARGE">Large</SelectItem>
                <SelectItem value="EXTRA_LARGE">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {serviceType === "CASKET" && (
            <div className="space-y-2">
              <Label htmlFor="color">Casket Color</Label>
              <div
                className={`py-4 px-4 rounded-2xl border border-dashed border-white/50 text-gray-400 text-sm font-medium h-14 relative flex items-center justify-center`}
                style={{ background: formData.selectedColor }}
              >
                <input
                  type="color"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) =>
                    handleInputChange("selectedColor", e.target.value)
                  }
                  value={formData.selectedColor}
                />
                {formData.selectedColor || "Select Color"}
              </div>
            </div>
          )}

          {serviceType === "CASKET" && (
            <div className="space-y-2">
              <Label htmlFor="materialType">Material Type</Label>
                <Select
                  value={formData.materialType}
                  onValueChange={(value) =>
                    handleInputChange("materialType", value)
                  }
                >
                  <SelectTrigger className="w-full py-6 rounded-2xl">
                    <SelectValue placeholder="Select material type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH_GLOSS_FINISH">
                      HIGH-GLOSS FINISH (Smooth reflective surface with a premium
                      look)
                    </SelectItem>
                    <SelectItem value="NATURAL_WOOD">
                      NATURAL WOOD (Traditional wood grain texture)
                    </SelectItem>
                    <SelectItem value="FABRIC">
                      FABRIC (Soft textile finish for interior components)
                    </SelectItem>
                    <SelectItem value="METAL">
                      METAL (Durable metallic finish for hardware components)
                    </SelectItem>
                    <SelectItem value="COMPOSITE">
                      COMPOSITE (Versatile and durable synthetic material)
                    </SelectItem>
                  </SelectContent>
                </Select>
            </div>
          )}

          {serviceType === "FLOWERS" && (
            <div className="space-y-2">
              <Label htmlFor="price">Flower Type</Label>
              <Input
                type="text"
                placeholder="Enter Flower type (Ex, Tulips,  Sampaguita)"
                className="w-full py-4"
                onChange={(e) => handleInputChange("flowerType", e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              placeholder="Enter price"
              className="w-full py-4"
              value={(formData.price > 0 || !formData.price ) ? formData.price:0}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex justify-end w-full gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={mutation.isPending}>
              {mutation.isPending ? "Adding..." : "Add Now"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCasketDetail;
