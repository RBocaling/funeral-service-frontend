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
import { CircleHelp } from "lucide-react";
import CasketSizeModal from "../casket-size/casketSize";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  const [isOpenSize, setIsOpenSize] = useState(false);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>({
    selectedColor: "#fff",
    selectedSize: "",
    price: 0,
    materialType: "",
    flowerType: "",
  });
  const { showAlert } = useAlertStore();
  const { serviceType } = useServiceTypeStore();
  const mutation = addCasketDetailService();

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!file) {
      throw new Error("NO file selected");
    }
    const fileUrl = await uploadImageToCloudinary(file);
    setLoading(true);
    const details = {
      color: formData.selectedColor,
      size: formData.selectedSize,
      price: Number(formData.price),
      casketType: formData.materialType,
      flowerType: formData.flowerType,
      image_url: fileUrl,
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
        onSuccess: async () => {
          await showAlert("success", {
            title: "Success Added!",
            message: "Your action was completed successfully.",
            autoClose: true,
          });
          setIsOpen(false);
          closeMain();
          queryClient.invalidateQueries({
            queryKey: ["my-services"],
          });
          setLoading(false);
        },
        onError: async (error) => {
          await showAlert("error", {
            title: "Error",
            message: "Something went wrong. Please try again.",
            autoClose: true,
          });
          setLoading(false);
          console.error("Error adding casket detail", error);
        },
      }
    );
  };

  const sizes = [
    {
      name: "Small",
      height: "up to 150 cm",
      width: "50 – 55 cm",
      weight: "up to 50 kg",
    },
    {
      name: "Medium",
      height: "151 – 165 cm",
      width: "55 – 60 cm",
      weight: "up to 70 kg",
    },
    {
      name: "Large",
      height: "166 – 180 cm",
      width: "60 – 65 cm",
      weight: "up to 90 kg",
    },
    {
      name: "Extra Large",
      height: "181 – 195+ cm",
      width: "65 – 70 cm",
      weight: "up to 120 kg",
    },
    {
      name: "Standard",
      height: "160 – 180 cm",
      width: "60 cm",
      weight: "up to 80 kg",
    },
  ];

  const s = sizes?.find(
    (item) => item?.name?.toLowerCase() == formData.selectedSize?.toLowerCase()
  );
  console.log("sizes");

  console.log("serviceId");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">{serviceType} Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-7">
          {/* Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="size">Select Size</Label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsOpenSize(true)}
                  className="text-sky-500 animate-bounce cursor-pointer"
                >
                  <CircleHelp />
                </button>
              </div>
            </div>
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
            {formData.selectedSize && (
              <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-100">
                <div className="flex">
                  <p className="text-xs font-black">Height Range:</p>
                  <p className="text-xs ">{s?.height}</p>
                </div>
                <div className="flex">
                  <p className="text-xs font-black">Width (cm):</p>
                  <p className="text-xs ">{s?.width}</p>
                </div>
                <div className="flex">
                  <p className="text-xs font-black">Weight Capacity (kg):</p>
                  <p className="text-xs ">{s?.weight}</p>
                </div>
              </div>
            )}
          </div>

          {serviceType === "CASKET" && (
            <div className="space-y-2">
              <Label htmlFor="color">Casket Color</Label>
              <div className="flex items-center gap-7">
                <div className="flex flex-col items-start">
                  <p className="text-gray-400 text-xs mb-2">-Popular Color</p>
                  <div className="flex -items-start gap-5">
                    <div className="flex flex-col gap-2">
                      <button
                        className={`${
                          formData.selectedColor === "#fff" &&
                          "border-2 border-sky-500"
                        }  py-4 px-4 rounded-2xl border bg-white  text-gray-400 text-sm font-medium h-8 w-8 relative flex items-center justify-center`}
                        onClick={() => setFormData({ selectedColor: "#fff" })}
                      >
                        {formData.selectedColor === "#fff" && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 h-1 translate-y-1 w-5 bg-sky-500"></div>
                        )}
                      </button>
                      <p className="text-white text-xs">White</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className={`${
                          formData.selectedColor === "#261817"
                        } relative py-4 px-4 rounded-2xl bg-[#261817] border border-dashed border-white/50 text-gray-400 text-sm font-medium h-8 w-8  flex items-center justify-center`}
                        onClick={() =>
                          setFormData({ selectedColor: "#261817" })
                        }
                      >
                        {formData.selectedColor === "#261817" && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 h-1 translate-y-1 w-5 bg-sky-500"></div>
                        )}
                      </button>
                      <p className="text-white text-xs">Brown</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => setFormData({ selectedColor: "#000" })}
                        className={`${
                          formData.selectedColor === "#000"
                        } py-4 px-4 rounded-2xl border border-dashed bg-[#000] border-white/50 text-gray-400 text-sm font-medium h-8 w-8 relative flex items-center justify-center`}
                      >
                        {" "}
                        {formData.selectedColor === "#000" && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 h-1 translate-y-1 w-5 bg-sky-500"></div>
                        )}
                      </button>
                      <p className="text-white text-xs">Black</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`py-4 px-4 flex-1 rounded-2xl border border-dashed border-white/50 text-gray-400 text-sm font-medium h-14 relative flex items-center justify-center`}
                  style={{
                    background:
                      formData.selectedColor !== "#fff"
                        ? formData.selectedColor
                        : "bg-transparent",
                  }}
                >
                  <input
                    type="color"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      handleInputChange("selectedColor", e.target.value)
                    }
                    value={formData.selectedColor}
                  />
                  {formData.selectedColor == "#fff"
                    ? "Select Color"
                    : formData.selectedColor}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              placeholder="Enter price"
              className="w-full py-4"
              value={formData.price > 0 || !formData.price ? formData.price : 0}
              onChange={(e) => handleInputChange("price", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">
              {serviceType === "FLOWERS"
                ? "Flower Image"
                : serviceType === "CASKET" && "Casket Image"}
            </Label>
            <Input
              type="file"
              className="w-full py-4"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t">
          <div className="flex justify-end w-full gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={mutation.isPending}>
              {loading || mutation.isPending ? "Adding..." : "Add Now"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
      <CasketSizeModal isOpen={isOpenSize} setIsOpen={setIsOpenSize} />
    </Dialog>
  );
};

export default AddCasketDetail;
