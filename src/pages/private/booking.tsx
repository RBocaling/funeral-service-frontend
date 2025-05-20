import { useState } from "react";
import {
  MapPin,
  Users,
  MessageSquare,
  X,
  Flower2,
  Box,
  Heart,
  Search,
  Filter,
  ChevronDown,
  Mail,
  CalendarClock,
  Hospital,
} from "lucide-react";
import TitlePage from "@/components/ui/title-page";
import { bookings } from "@/lib/mockdata";
import BookingModal from "@/components/booking/BookingModal";
import { useGetBooking } from "@/hooks/controllers/useBooking";
import { formatCurrency } from "@/lib/utils";
import { useServiceTypeStore } from "@/store/serviceStore";

function Booking() {
  const [selectedBooking, setSelectedBooking] = useState<
    (typeof bookings)[0] | null
  >(null);
  const [isTrack, setIsTrack] = useState<boolean>(false);
  const { setSelectedBooking: setBooking } = useServiceTypeStore();
  const { data, isLoading } = useGetBooking();

  if (isLoading) return <>loading..</>;

  const customData = data?.map((i: any) => ({
    id: i?.id,
    funeralServiceName: `${i?.customer?.firstName} ${i?.customer?.lastName}`,
    location: i?.location,
    email: i?.customer?.user?.email,
    phone: i?.customer?.phone,
    appoinmentDate: i?.appointmentDate,
    status: i?.bookingStatus,
    fullPackage: i?.fullPackage,
        additionalDetails:i?.additionalDetails,
    hospitalDetails:i?.hospitalDetails,
    customCasketDetail: i?.customCasketDetail[0],
    serviceBookings: i?.serviceBookings?.map((item: any) => ({
      details: item?.service,
      casket: item?.selectedCasketDetail,
      flower: item?.selectedFlowerDetail,
      totalAmount:
        Number(item?.selectedCasketDetail?.price) +
        Number(item?.selectedFlowerDetail?.price),
    })),
  }));

  console.log("customDatacustomData", customData);

  return (
    <div className="relative ">
      <div className="container px-5 mx-auto">
        <div className="flex flex-col md:flex-row gap-5 md:justify-between md:items-center mb-7 md:mb-12">
          <TitlePage label="My Bookings" />
          <div className="relative flex items-center gap-5 mb-7">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                className="w-full bg-gray-800/50 border border-gray-700/30 rounded-xl pl-10 pr-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select className="w-full bg-gray-800/50 border border-gray-700/30 rounded-xl pl-10 pr-4 py-2 text-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/30">
                <option value="">All Locations</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select className="w-full bg-gray-800/50 border border-gray-700/30 rounded-xl pl-10 pr-4 py-2 text-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/30">
                <option value="">All Statuses</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {customData?.map((booking: any) => (
            <div
              key={booking.id}
              className="group relative dark:bg-gray-800/40 backdrop-blur-xl shadow-xl shadow-black/10 rounded-3xl overflow-hidden border border-gray-700/30"
              //
            >
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button className="bg-sky-500/50 hover:bg-sky-500/30 text-white-300 p-2 rounded-full transition-all duration-300">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="bg-red-500/50 hover:bg-red-500/30 text-white-300 p-2 rounded-full transition-all duration-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative h-48">
                <img
                  src="https://media.istockphoto.com/id/1447462464/photo/close-up-of-person-in-black-praying-at-outdoor-funeral.jpg?s=612x612&w=0&k=20&c=NQWKq6W8KemPyFuV9gtiPo7md4vskgiF1l5iQfj1MlU="
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <Heart className="w-4 h-4 text-sky-400" />
                    <span>Customer</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-white mt-1">
                    {booking?.funeralServiceName}
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 md:h-52">
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
                    <p className="text-xs text-gray-500 mb-2">
                      Booked Location
                    </p>
                    <div className="flex items-center dark:text-gray-300 text-xs tracking-wider">
                      <MapPin className="w-4 h-4 mr-2 text-sky-400" />
                      {booking.location}
                    </div>
                      <p className="text-xs text-gray-500 my-2 pt-1">
                      Hospital Details
                    </p>
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

                    {booking?.fullPackage && (
                      <div className="flex flex-col">
                        <p className="text-xs text-gray-500 mb-2 whitespace-nowrap">
                          Complete Package{" "}
                          <span className="text-xs text-red-500 font-medium">
                            {" "}
                            -{formatCurrency(booking?.fullPackage?.price)}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                          <span className="text-xs text-white font-medium">
                            {" "}
                            -{booking?.fullPackage?.title} (
                            {booking?.fullPackage?.details?.map(
                              (i: any, ind: number) => (
                                <span
                                  className="text-xs text-gray-600"
                                  key={ind}
                                >
                                  {i?.description},{" "}
                                </span>
                              )
                            )}
                            )
                          </span>
                        </p>
                      </div>
                    )}

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

                    <div className="flex items-center dark:text-gray-300 text-xs tracking-wider capitalize">
                      {/* <DollarSign className="w-4 h-4 mr-2 text-sky-400" /> */}
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
                </div>

                <div className="pt-4 border-t border-gray-700/30">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        booking.status === "Confirmed"
                          ? "bg-green-500/20 text-green-300"
                          : "bg-yellow-500/20 text-yellow-300"
                      }`}
                    >
                      {booking.status}
                    </span>
                    <button
                      onClick={() => {
                        setBooking(booking);
                        setSelectedBooking(booking);
                      }}
                      className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-full text-sm transition-all duration-300 shadow-2xl shadow-sky-500/50"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 border-2 border-transparent group-hover:border-sky-500/30 rounded-3xl pointer-events-none transition-colors duration-300" />
            </div>
          ))}
        </div>
      </div>

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          isTrack={isTrack}
          setIsTrack={setIsTrack}
        />
      )}
    </div>
  );
}

export default Booking;
