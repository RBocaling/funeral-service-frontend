import { useServiceTypeStore } from "@/store/serviceStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useState } from "react";
import { Flower, Package2, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import AddCasketDetail from "./addServiceDetails";
import { deleteDetailService } from "@/hooks/controllers/useAddService";
import { useQueryClient } from "@tanstack/react-query";

const ViewServiceDetails = ({
  isOpen,
  setIsOpen,
  selectedService,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedService: any;
}) => {
  const [isOpenAddCasket, setIsOpenCasket] = useState<boolean>(false);
  const products = [
    {
      id: 1,
      color: "#3B82F6",
      basePrice: 79.99,
      sizes: "SMALL",
    },
    {
      id: 2,
      color: "#10B981",
      basePrice: 129.99,
      sizes: "SMALL",
    },
    {
      id: 3,
      color: "#8B5CF6",
      basePrice: 199.99,
      sizes: "LARGE",
    },
  ];
  const { serviceType } = useServiceTypeStore();
  const [selectedSizes, setSelectedSizes] = useState<Record<number, any>>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: "MEDIUM" }), {})
  );

    const queryClient = useQueryClient();
    
  const getPrice = (basePrice: number, size: any) => {
    switch (size) {
      case "SMALL":
        return basePrice * 0.8;
      case "LARGE":
        return basePrice * 1.2;
      default:
        return basePrice;
    }
  };

  const data = serviceType ==="CASKET" ?selectedService?.casketDetails:selectedService?.flowerDetails

    const mutation = deleteDetailService();
  const handleDelete = (id:number) => {
   
    mutation.mutate(
      {
        serviceType,
        id: Number(id),
      },
      {
        onSuccess: () => {
          alert("Success deleted");
          setIsOpen(false);
         
          queryClient.invalidateQueries({
            queryKey: ["my-services"],
          });
        },
        onError: (error) => {
          console.error("Error adding casket detail", error);
        },
      }
    );
  };
    
    
  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[1000px] p-0 rounded-2xl overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between pr-7">
              <div className="flex flex-col gap-2">
                <DialogTitle className="text-xl capitalize">
                  {selectedService?.name} Details
                </DialogTitle>
                <DialogDescription>
                  {selectedService?.description}
                </DialogDescription>
              </div>

              <Button onClick={() => setIsOpenCasket(true)}>
                {" "}
                Add Detail{" "}
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-7 pb-7 pt-3 w-full">
            {data?.length > 0 ? (
              data.map((item: any) => (
                <div
                  key={item.id}
                  className="relative bg-gray-700/10 border border-gray-500/10 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl p-2"
                  >
                      <p className="text-white text-xs font-semibold ">{ serviceType ==="CASKET" ? item?.casketType : item?.flowerType}</p>
                  <div className="p-6">
                    {/* item Image */}
                    <div
                      className="rounded-xl p-8 mb-4 flex items-center justify-center transition-all duration-300"
                      style={{ backgroundColor: `${item.color}15` }}
                          >
                              {
                                  serviceType ==="CASKET"?  <Package2
                                  size={80}
                                  className="transition-all duration-300"
                                  style={{ color: item.color }}
                                />:<Flower
                                size={80}
                                className="transition-all duration-300 text-rose-500 shadow-2xl shadow-rose-500/50 rounded-full bg-gray-800/10"
                                
                              />
                              }
                    
                      
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-700/30 mb-5 pb-2">
                      <div className="text-base font-semibold text-white0">
                        {item.size}
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <div
                          className="w-6 h-6 rounded-full border-2 border-white ring-2 ring-gray-100"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-gray-600">
                          {item.color}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-white">
                        $
                        {getPrice(item.price, selectedSizes[item.id]).toFixed(
                          2
                        )}
                      </div>
                      <div className={"flex items-center gap-3"}>
                        <Trash2 onClick={()=> handleDelete(item?.id)} size={20} className="text-red-500" />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 h-[250px] w-full flex items-center justify-center">
                <h1>No {selectedService?.name} Details</h1>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddCasketDetail serviceId={selectedService?.id} isOpen={isOpenAddCasket} setIsOpen={setIsOpenCasket} closeMain={()=> setIsOpen(false)} />
    </>
  );
};

export default ViewServiceDetails;
