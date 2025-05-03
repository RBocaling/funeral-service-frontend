import { Box, Check, MapPin, Truck, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Map from "./Map";
import { useGetBooking, useGetBookingStatus, usUpdateBooking } from "@/hooks/controllers/useBooking";
import { useServiceTypeStore } from "@/store/serviceStore";
import { useQueryClient } from "@tanstack/react-query";

type BookingStatusType = "CONFIRMED" | "PREPARING_ITEMS" | "ON_THE_WAY" | "COMPLETED";

const BookingStatus = ({booking}:{booking:any}) => {
  const [isAddLocation, setIsAddLocation] = useState<boolean>(false);
  const [currentStatus, setCurrentStatus] = useState<BookingStatusType>(
    booking?.status === "CONFIRMED"
      ? "PREPARING_ITEMS"
      : booking?.status === "PREPARING_ITEMS"
      ? "ON_THE_WAY"
      : booking?.status === "ON_THE_WAY"
      ? "COMPLETED"
      : "CONFIRMED"
  );
  
  const updateStatusMutation = usUpdateBooking();
 
const {selectedSBooking} = useServiceTypeStore()
const queryClient = useQueryClient();

  const [steps, setSteps] = useState([
    {
      id: 1,
      title: "Booking Confirmed",
      subtitle: "8:00 AM · Feb 8, 2023",
      icon: <Check className="w-5 h-5" />,
      status: "upcoming",
      statusName: "CONFIRMED",
    },
    {
      id: 2,
      title: "Preparing Items",
      subtitle: "Casket, Flowers & Setup",
      icon: <Box className="w-5 h-5" />,
      status: "upcoming",
      statusName: "PREPARING_ITEMS",
    },
    {
      id: 3,
      title: "On the Way",
      subtitle: "Delivery in Progress",
      icon: <Truck className="w-5 h-5" />,
      status: "upcoming",
      statusName: "ON_THE_WAY",
    },
  ]);

  useEffect(() => {
    const updatedSteps = steps.map((step) => {
      if (currentStatus === "COMPLETED") {
        return { ...step, status: "completed" };
      }

      if (step.statusName === currentStatus) {
        return { ...step, status: "active" };
      } else if (
        currentStatus === "PREPARING_ITEMS" &&
        step.statusName === "CONFIRMED"
      ) {
        return { ...step, status: "completed" };
      } else if (
        currentStatus === "ON_THE_WAY" &&
        (step.statusName === "CONFIRMED" || step.statusName === "PREPARING_ITEMS")
      ) {
        return { ...step, status: "completed" };
      }

      return { ...step, status: "upcoming" };
    });

    setSteps(updatedSteps);
  }, [currentStatus]);

  const handleUpdate = (payload:any) => {
    updateStatusMutation.mutate(
      payload,
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["customesr-booking"],
          });
        },
        onError: (error: any) => {
          alert("Failed: " + JSON.stringify(error));
        },
      }
    );
  }
  const handleMarkAsDone = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps[index].status = "completed";
    if (updatedSteps[index + 1]) {
      updatedSteps[index + 1].status = "active";
      setCurrentStatus(updatedSteps[index + 1].statusName as BookingStatusType);
        handleUpdate({ 
          id: booking?.id,
          data: { 
            bookingStatus: updatedSteps[index].statusName as BookingStatusType 
          } 
      })
     
    } else {
      setCurrentStatus("COMPLETED");
        handleUpdate({ 
          id: booking?.id,
          data: { 
            bookingStatus: "ON_THE_WAY" 
          } 
      })
      
    }
    setSteps(updatedSteps);
  };

  const handleCancelDone = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps[index].status = "active";
    for (let i = index + 1; i < updatedSteps.length; i++) {
      updatedSteps[i].status = "upcoming";
    }
    setSteps(updatedSteps);
    setCurrentStatus(updatedSteps[index].statusName as BookingStatusType);
    if (index - 1 > 0) {
      handleUpdate({ 
        id: booking?.id,
        data: { 
          bookingStatus: updatedSteps[index - 1].statusName as BookingStatusType
        } 
    })
    } else {
      handleUpdate({ 
        id: booking?.id,
        data: { 
          bookingStatus: "PENDING"
        } 
    })
    }
   
    
  };

  const firstActiveIndex = steps.findIndex((step) => step.status === "active");
  const allCompleted = steps.every((step) => step.status === "completed");

  
  console.log("selectedSBooking",booking);
  
  

  return (
    <div className="flex flex-col gap-7 items-center">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0 mb-5">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative flex-1 flex flex-col items-center text-center"
          >
            {index !== 0 && (
              <div className="absolute -left-1/2 top-4 hidden sm:block w-full h-0.5 bg-gray-700 z-0" />
            )}
            <div
              className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 ${
                step.status === "completed"
                  ? "bg-sky-500 border-sky-500 shadow-2xl shadow-sky-500 text-black"
                  : step.status === "active"
                  ? "bg-white border-white text-black animate-pulse"
                  : "bg-transparent border-gray-600 text-gray-400"
              }`}
            >
              {step.icon}
            </div>

            <div className="mt-3 relative mb-12">
              <h4 className="text-sm font-semibold text-white">{step.title}</h4>
              <p className="text-xs text-gray-400">{step.subtitle}</p>

              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                {step.status === "completed" ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 text-xs mt-1 hover:bg-red-500 hover:text-white"
                    onClick={() => handleCancelDone(index)}
                  >
                    <X className="w-4 h-4 mr-1" /> Cancel
                  </Button>
                ) : step.status === "active" && index === firstActiveIndex ? (
                  <Button
                    size="sm"
                    className="text-xs mt-1 bg-sky-500 shadow-2xl shadow-sky-500/50 rounded-full hover:bg-sky-500/50"
                    onClick={() => handleMarkAsDone(index)}
                  >
                    Mark as Done
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {allCompleted && !isAddLocation && (
        <Card
          onClick={() => setIsAddLocation(true)}
          className="overflow-hidden border-dashed border-2 hover:border-primary/50 transition-colors bg-transparent hover:bg-muted/30 rounded-xl cursor-pointer flex items-center justify-center max-w-sm p-0"
        >
          <CardContent className="p-8 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-sky-500 animate-bounce" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Start On Location</h3>
            <p className="text-sm text-muted-foreground">
              Click to see the live location of your service.
            </p>
          </CardContent>
        </Card>
      )}

      {isAddLocation && (
        <div className="w-full flex flex-col gap-5 items-center">
          <Map />
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 mt-1 text-lg bg-red-500/10 rounded-full hover:bg-red-500 hover:text-white animate-bounce"
            onClick={() => setIsAddLocation(false)}
          >
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingStatus;
