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
    setFormData((prev:any) => ({ ...prev, [field]: value }));
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
        },
        onError: async (error) => {
          await showAlert("error", {
            title: "Error",
            message: "Something went wrong. Please try again.",
            autoClose: true,
          });
          console.error("Error adding casket detail", error);
        },
      }
    );
  };

  console.log("serviceId", serviceId);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>isOpenSize
      <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl">{serviceType} Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-7">
          {/* Size */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="size">Select Size</Label>
              <button onClick={()=>setIsOpenSize(true)} className="text-sky-500 animate-bounce cursor-pointer"><CircleHelp /></button>
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
                        className={`${formData.selectedColor==="#fff" && "border-2 border-sky-500"}  py-4 px-4 rounded-2xl border bg-white  text-gray-400 text-sm font-medium h-8 w-8 relative flex items-center justify-center`}
                        onClick={()=> setFormData({selectedColor: "#fff"})}
                      >

                        {
                          formData.selectedColor ==="#fff" &&<div className="absolute top-full left-1/2 -translate-x-1/2 h-1 translate-y-1 w-5 bg-sky-500"></div>
                        }
                      </button>
                      <p className="text-white text-xs">White</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className={`${formData.selectedColor==="#261817" } relative py-4 px-4 rounded-2xl bg-[#261817] border border-dashed border-white/50 text-gray-400 text-sm font-medium h-8 w-8  flex items-center justify-center`}
                        onClick={()=> setFormData({selectedColor: "#261817"})}

                      >
                        {
                          formData.selectedColor ==="#261817" &&<div className="absolute top-full left-1/2 -translate-x-1/2 h-1 translate-y-1 w-5 bg-sky-500"></div>
                        }
                      </button>
                      <p className="text-white text-xs">Brown</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button onClick={()=> setFormData({selectedColor: "#000"})}
                        className={`${formData.selectedColor==="#000"} py-4 px-4 rounded-2xl border border-dashed bg-[#000] border-white/50 text-gray-400 text-sm font-medium h-8 w-8 relative flex items-center justify-center`}
                      >  {
                          formData.selectedColor ==="#000" &&<div className="absolute top-full left-1/2 -translate-x-1/2 h-1 translate-y-1 w-5 bg-sky-500"></div>
                        }</button>
                      <p className="text-white text-xs">Black</p>
                    </div>
                  </div>
                </div>
                <div
                  className={`py-4 px-4 flex-1 rounded-2xl border border-dashed border-white/50 text-gray-400 text-sm font-medium h-14 relative flex items-center justify-center`}
                  style={{ background: formData.selectedColor !== "#fff" ? formData.selectedColor : "bg-transparent"}}
                >
                  <input
                    type="color"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) =>
                      handleInputChange("selectedColor", e.target.value)
                    }
                    value={formData.selectedColor}
                  />
                  {formData.selectedColor =="#fff" ? "Select Color" : formData.selectedColor}
                </div>
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
                onChange={(e) =>
                  handleInputChange("flowerType", e.target.value)
                }
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
              value={formData.price > 0 || !formData.price ? formData.price : 0}
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
      <CasketSizeModal isOpen={isOpenSize} setIsOpen={setIsOpenSize}/>
    </Dialog>
  );
};

export default AddCasketDetail;
