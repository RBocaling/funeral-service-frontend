import {  X } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Card, CardContent } from "../ui/card";
import CreateService from "./CreateService";
import { useState } from "react";
import { useServiceTypeStore } from "@/store/serviceStore";
import { useGetServices } from "@/hooks/controllers/useAddService";
import ViewServiceDetails from "./ViewServiceDetails";
import CreateServicePackage from "./CreateFullPackage";

const ViewService = ({
  viewModalOpen,
  setViewModalOpen,

}: {
  viewModalOpen: boolean;
    setViewModalOpen: any;
  }) => {
  const {serviceType} = useServiceTypeStore()
  const {data,isLoading} = useGetServices()
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenViewDetail, setIsOpenViewDetail] = useState<boolean>(false);
  const [selectedService, setSelectedService] = useState<boolean>();
  const [isOpenAddPackage, setIsOpenPackage] = useState<boolean>(false);

  if(isLoading) return <>loading...</>
  const filterData = data?.filter((item: any) => item.serviceType === serviceType);

  
  
  return (
   <> <Dialog
   open={viewModalOpen}
   onOpenChange={(open) =>  setViewModalOpen(open)}
 >
   <DialogContent className="sm:max-w-[800px] p-0 rounded-2xl overflow-hidden">
     <div className="relative bg-transparent bg-gray-100 dark:bg-gray-800">
       <h2 className="text-xl font-semibold mb-2 p-3">{serviceType} List</h2>
       <Button
         variant="ghost"
         size="icon"
         className="absolute right-2 top-2 z-10 rounded-full bg-black/50 text-white hover:bg-black/70 hover:text-white"
         onClick={() => setViewModalOpen(false)}
       >
         <X className="h-4 w-4" />
       </Button>

       <div className="h-[400px] bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-50">
         <Carousel
           opts={{
             align: "start",
           }}
           className="w-full max-w-2xl z-20"
         >
           <CarouselContent>
             {filterData?.map((item:any, index:number) => (
               <CarouselItem
                 key={index}
                 className={`md:basis-1/2  shadow-2xl shadow-violet-500/20 ${serviceType !=="FULL_PACKAGE" && "lg:basis-1/3"}`}
               >
                 <Card className="overflow-hidden flex flex-col h-full rounded-2xl border border-border/40 shadow-xl hover:shadow-2xl transition-all duration-300 pt-0">
                   <div className="relative h-32">
                     <img
                       src={item?.imgUrl}                       
                       className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                     />
                     <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent"></div>
                   </div>

                   <CardContent className="px-2 flex-grow py-0">
                     <div className="flex items-center justify-between gap-7 px-2">
                       <div className="flex">
                       <div className="text-sm font-semibold shadow-lg">
                         <span className="flex items-center text-lg">
                           {item?.name}
                           </span>
                           {/* {
                             serviceType === "FULL_PACKAGE" &&<button onClick={()=>handleDelete(item?.id)} className="rounded-full flex items-center gap-3 text-xs mt-3 text-red-500 cursor-pointer">
                             <Trash2 size={18} /> delete
                         </button>
                           } */}
                       </div>

                      
                       </div>
                       
                       {
                         serviceType !=="FULL_PACKAGE" &&  <div className="flex items-center justify-start gap-4">
                         {/* <button onClick={()=>handleDelete(item?.id)} className="rounded-full text-xs text-red-500 cursor-pointer">
                           <Trash2 size={20} />
                         </button> */}
                         <button onClick={() =>
                         {
                           setSelectedService(item)
                           setIsOpenViewDetail(true);
                           }
                         } className="rounded-full text-xs text-sky-500 cursor-pointer flex items-center gap-1 underline font-medium">
                           {/* <Eye size={20} /> */}
                           Prices
                         </button>
                         </div>
                           
                          
                       }
                       
                       {
                         serviceType === "FULL_PACKAGE" && <div className="flex flex-col gap-1">
                         {
                           item.fullPacakge[0]?.details?.map((i:any, ind:number) => {
                            return  <p className="text-xs text-gray-500" key={ind}>*{i?.description}</p>
                           })
                         }
                        </div>
                      }
                     </div>
                   </CardContent>
                 </Card>
               </CarouselItem>
             ))}
           </CarouselContent>
           <CarouselPrevious />
           <CarouselNext />
         </Carousel>
       </div>

       <img
         src="/transparent-hive.png"
         className="absolute top-0 left-0 opacity-20 w-full h-full"
         alt=""
       />
     </div>

     <div className="p-6 flex items-start justify-between">
       <div className="flex flex-col gap-3">
         <h2 className="text-xl font-semibold mb-2">Services</h2>
         <p className="text-muted-foreground mb-4">
           {/* This is the service description. You can edit this content. */}
         </p>
       </div>
       <div className="flex items-center gap-5">
         {/* <Button
           size="sm"
           className="rounded-full bg-red-600/10 hover:bg-red-600/30 text-xs text-red-500 cursor-pointer"
         >
           <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete All
         </Button> */}
            <Button onClick={() => {
              if (serviceType === "FULL_PACKAGE") {
                setIsOpenPackage(true)
              } else {
                setIsOpen(true)

              }
         }} className="rounded-full font-medium">
           Add {serviceType}
         </Button>
       </div>
     </div>
   </DialogContent>
    </Dialog>
    
    <CreateService
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onClose={()=>setViewModalOpen(false)}
      />
    
      {
        isOpenAddPackage && <CreateServicePackage
        isOpen={isOpenAddPackage}
        setIsOpen={setIsOpenPackage}
        onClose={()=>setIsOpenPackage(false)}
      />
      }
      <ViewServiceDetails
        selectedService={selectedService}
        isOpen={isOpenViewDetail}
        setIsOpen={setIsOpenViewDetail}
      />
    
    </>
    
            )
};

export default ViewService;


