import { Box, CalendarClock, Flower2, Heart, Hospital, Mail, MapPin, Users, WalletCards, X } from "lucide-react";
import BookingStatus from "./BookingStatus";
import { formatCurrency } from "@/lib/utils";
import { useServiceTypeStore } from "@/store/serviceStore";
import { usUpdateBooking } from "@/hooks/controllers/useBooking";
import { useQueryClient } from "@tanstack/react-query";
import { useAlertStore } from "@/store/alertStore";

const BookingModal = ({
    booking,
    onClose,
    isTrack,
    setIsTrack,
  }: {
    booking: any;
    onClose: () => void;
    isTrack: boolean;
    setIsTrack: (isTrack:boolean)=>void;
    }) =>{
  const { setSelectedBooking } = useServiceTypeStore()
    const updateStatusMutation = usUpdateBooking();
    const queryClient = useQueryClient();
const { showAlert } = useAlertStore();
  const handleUpdate = (payload:any) => {
    updateStatusMutation.mutate(
      payload,
      {
        onSuccess: () => {
          showAlert('success', {
            title: 'Success Added!',
            message: 'Your action was completed successfully.',
            autoClose: true,
          });
          queryClient.invalidateQueries({
            queryKey: ["customesr-booking"],
          });
          onClose()
        },
        onError: (error: any) => {
          alert("Failed: " + JSON.stringify(error));
        },
      }
    );
  }


  const handleMarkCompleted = () => {
    handleUpdate({ 
      id: booking?.id,
      data: { 
        bookingStatus: "COMPLETED" 
      } 
  })
  }
  

  console.log("booking?.bookingStatus",booking);
  
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
          className="bg-gray-800/90 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          style={{
            boxShadow:
              "0 8px 32px -4px rgba(0, 0, 0, 0.3), 0 4px 16px -2px rgba(0, 0, 0, 0.15)",
          }}
        >
          <div className="relative h-64">
            <img
             src="https://honeywell.scene7.com/is/image/honeywell/hon-corp-commercial-buildings-tab6"
              className="w-full h-full object-cover rounded-t-3xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent rounded-t-3xl" />
            <button
              onClick={() => {
                setSelectedBooking("");
                onClose()
              }}
              className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="absolute bottom-4 left-6">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <Heart className="w-4 h-4 text-sky-400" />
                <span>In Memory of</span>
              </div>
              <h2 className="text-3xl font-semibold text-white mt-1">
                {booking.deceasedName}
              </h2>
            </div>
          </div>
  
          <div className="p-6 space-y-8">
            {isTrack ? (
              <div className="">
        <BookingStatus booking={booking}  />
        </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
              <div className="space-y-3">
                  <div className="flex flex-col">
                    <p className="text-xs text-gray-500 mb-2">
                      Funeral Service Detail:
                    </p>
                    <div className="flex items-center dark:text-gray-300">
                      <Users className="w-4 h-4 mr-2 text-sky-400" />
                      <span className="text-xs">
                        Funeral: {booking?.funeralServiceName}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center dark:text-gray-300 text-xs tracking-wider">
                    <Mail className="w-4 h-4 mr-2 text-sky-400" />
                    {booking.email}
                  </div>
                  <div className="flex items-center dark:text-gray-300 text-xs tracking-wider">
                    <MapPin className="w-4 h-4 mr-2 text-sky-400" />
                    {booking.location}
                    </div>
                    <div className="flex items-center dark:text-gray-300 text-xs tracking-wider">
                                          <Hospital className="w-4 h-4 mr-2 text-sky-400" />
                                          {booking.hospitalDetails}
                                        </div>
                </div>

                <div className="space-y-3">
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-500 mb-2">
                        Appointment / Order's
                      </p>
                      <div className="flex items-center dark:text-gray-300 text-xs tracking-wider">
                        <CalendarClock className="w-4 h-4 mr-2 text-sky-400" />
                        {booking?.appoinmentDate}
                      </div>
                    </div>

                    {booking?.customCasketDetail && (
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500 mb-2">
                          Custom Casket{" "}
                          <span className="text-xs text-red-500 font-medium">
                            {" "}
                            -
                            {formatCurrency(
                              booking?.customCasketDetail?.additionalCost
                            )}
                          </span>
                        </p>
                        <div className="flex items-center gap-5 dark:text-gray-300 text-xs tracking-wider">
                          -{booking?.customCasketDetail?.material}
                          <div
                            className="w-5 h-5 rounded-full border-2 border-white ring-2 ring-gray-100"
                            style={{
                              backgroundColor:
                                booking?.customCasketDetail?.color,
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex flex-col items-center dark:text-gray-300 text-xs tracking-wider">
                            -Height: {booking?.customCasketDetail?.height} cm
                          </div>
                          <div className="flex flex-col items-center dark:text-gray-300 text-xs tracking-wider">
                            -Width: {booking?.customCasketDetail?.width} cm
                          </div>
                          <div className="flex flex-col items-center dark:text-gray-300 text-xs tracking-wider">
                            -Length: {booking?.customCasketDetail?.length} cm
                          </div>
                        </div>
                      </div>
                    )}

{
                      booking?.fullPackage && 
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500 mb-2 whitespace-nowrap">
                          Complete Package{" "}
                          <span className="text-xs text-red-500 font-medium">
                            {" "}
                            -
                            {formatCurrency(
                              booking?.fullPackage?.price
                            )}
                          </span>
                          </p>
                        <p className="text-xs text-gray-500 mb-2">
                          <span className="text-xs text-white font-medium">
                            {" "}
                            -
                              {booking?.fullPackage?.title} ({booking?.fullPackage?.details?.map((i:any, ind:number) => (
                                <span className="text-xs text-gray-600" key={ind}>{i?.description },  </span>
                            ))})
                          </span>
                          </p>
                          </div>
                    }



                    {booking?.serviceBookings?.map((item: any, index: any) => (
                      <div
                        key={index}
                        className="flex items-center dark:text-gray-300 text-xs tracking-wider capitalize"
                      >
                        {item?.casket ? (
                          <Box className="w-4 h-4 mr-2 text-sky-400" />
                        ) : (
                          <Flower2 className="w-4 h-4 mr-2 text-sky-400" />
                        )}
                        {item.details?.name}
                        <span className="text-sky-500 font-medium text-xs">
                          ({item?.casket?.size || item?.flower?.size})
                        </span>
                        <span className="text-xs text-red-500 font-medium">
                          {" "}
                          -
                          {formatCurrency(
                            item?.casket?.price || item?.flower?.price
                          )}
                        </span>
                      </div>
                    ))}

                    
                     {
                      booking?.additionalDetails && 
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500 mb-2 whitespace-nowrap">
                          Additional Order's{" "}
                          <span className="text-xs text-red-500 font-medium">
                            {" "}
                            -
                            {formatCurrency(
                              booking?.additionalDetails?.price
                            )}
                          </span>
                          </p>
                        <p className="text-xs text-gray-500 mb-2 whitespace-">
                          <span className="text-xs text-white font-medium">
                            {" "}
                          
                              <span className="text-xs text-gray-600">  - { booking?.additionalDetails?.description}</span>
                          </span>
                          </p>
                          </div>
                    }



                  </div>
            </div>
            )}
  
            <div className="border-t border-gray-700/30 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-sm">Total Amount</span>
                  <div className="text-2xl font-semibold text-white mt-1">
                   {formatCurrency(
                        Number(
                          booking?.serviceBookings?.reduce(
                            (sum: number, item: any) =>
                              sum +
                              (Number(item?.casket?.price) || 0) +
                              (Number(item?.flower?.price) || 0),
                            0
                          )
                        ) +
                          Number(
                            booking?.customCasketDetail?.additionalCost ?? 0
                        ) + Number(booking?.fullPackage?.price ?? 0)
                        
                        
                        + Number( booking?.additionalDetails?.price ??0)
                      )}
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  {
                    booking?.status !== "COMPLETED" && <button                       className="text-sky-500 font-medium bg-sky-70s0/10 py-3 px-5 rounded-full flex items-center gap-2 cursor-pointer"
                    onClick={handleMarkCompleted}>Mark as Complete</button>
                  }
                 
                  <span
                    className={`px-4 py-2 rounded-full text-sm border-r pr-5 ${
                      booking.status === "Confirmed"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/20 text-yellow-300"
                    }`}
                  >
                    {booking.status}
                  </span>
                  {booking?.status !== "COMPLETED" && (
                    <button
                      onClick={() => setIsTrack(!isTrack)}
                      className="text-sky-500 font-medium bg-sky-70s0/10 py-3 px-5 rounded-full flex items-center gap-2 cursor-pointer"
                    >
                      <WalletCards 
                        size={20}
                        className="animate-bounce bg-transparent rounded-full shadow-xl shadow-sky-500"
                      />
                      {isTrack ? "Close Update Order" : "Update Order Status"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
  
export default BookingModal