import { Box, CalendarClock, Flower2, Heart, Hospital, Mail, MapPin, Users, WalletCards, X } from "lucide-react";
import BookingStatus from "./BookingStatus";
import { formatCurrency } from "@/lib/utils";
import { useServiceTypeStore } from "@/store/serviceStore";
import { usUpdateBooking } from "@/hooks/controllers/useBooking";
import { useQueryClient } from "@tanstack/react-query";
import { useAlertStore } from "@/store/alertStore";
import PaymentMethodModal from "../PaymentMethodModal";
import { useState } from "react";
import { format } from "date-fns";

const BookingModal = ({
  booking,
  onClose,
  isTrack,
  setIsTrack,
}: {
  booking: any;
  onClose: () => void;
  isTrack: boolean;
  setIsTrack: (isTrack: boolean) => void;
}) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isView, setIsView] = useState(false);

  const { setSelectedBooking } = useServiceTypeStore();
  const updateStatusMutation = usUpdateBooking();
  const queryClient = useQueryClient();
  const { showAlert } = useAlertStore();
  const handleUpdate = (payload: any) => {
    updateStatusMutation.mutate(payload, {
      onSuccess: () => {
        showAlert("success", {
          title: "Success Added!",
          message: "Your action was completed successfully.",
          autoClose: true,
        });
        queryClient.invalidateQueries({
          queryKey: ["customesr-booking"],
        });
        onClose();
      },
      onError: (error: any) => {
        alert("Failed: " + JSON.stringify(error));
      },
    });
  };

  const handleMarkCompleted = (data: any) => {
    if (!booking?.isCash && (!data?.selectedMethod || !data?.accountDetails)) {
      alert("Please Select Receiver Payment");
    }
    handleUpdate({
      id: booking?.id,
      data: {
        bookingStatus: "COMPLETED",
        funeralReceiveType: data?.selectedMethod,
        funeralReceiveEWalletNumber: data?.accountDetails,
      },
    });
  };
  console.log("sssf", booking?.partialBookingPayment);

  const totaltobepaid = Number(booking?.partialBookingPayment?.totalToBePaid);
  const remaining = booking?.partialBookingPayment?.partialPayment
    ?.filter((item: any) => item?.status == "PAID")
    ?.reduce((acc: number, i: any) => acc + Number(i?.amount), 0);
  const totalPaid = totaltobepaid - remaining;

  console.log("booking?.bookingStatus", booking);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="dark:bg-gray-800/90  bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        style={{
          boxShadow:
            "0 8px 32px -4px rgba(0, 0, 0, 0.3), 0 4px 16px -2px rgba(0, 0, 0, 0.15)",
        }}
      >
        <div className="relative h-64">
          <img
            src="/funeral-bg.jpg"
            className="w-full h-full object-cover rounded-t-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent rounded-t-3xl" />
          <button
            onClick={() => {
              setSelectedBooking("");
              onClose();
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
        {isView ? (
          <div className="dark:bg-gray-800/90 bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-5">
            <div className="flex items-center justify-between px-3 py-3">
              <h1 className="text-xl font-black">Partial Payment Booking</h1>
              <div className="flex items-center gap-5">
                {totalPaid == 0 && (
                  <p className="text-xl font-semibold text-green-500 py-1 px-3 rounded-md bg-green600/10">
                    PAID
                  </p>
                )}
                <button
                  onClick={() => setIsView(false)}
                  className="bg-red-500 text-white py-1 px-3"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="py-5">
              <table className="w-full">
                <thead>
                  <tr className="h-14">
                    <th className="text-left text base font-medium">ID</th>
                    <th className="text-left text base font-medium">AMOUNT</th>
                    <th className="text-left text base font-medium">
                      PAYMENT METHOD
                    </th>
                    <th className="text-left text base font-medium">STATUS</th>
                    <th className="text-left text base font-medium">DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {booking?.partialBookingPayment?.partialPayment?.map(
                    (item: any, index: any) => (
                      <tr key={index} className="border-y h-14">
                        <td className="text-left text-sm font-normal">
                          {item?.id}
                        </td>
                        <td className="text-left text-sm font-normal">
                          {item?.amount}
                        </td>
                        <td className="text-left text-sm font-normal">
                          {item?.paymentMethod}
                        </td>
                        <td
                          className={`text-left text-sm font-normal ${
                            item?.status == "PAID"
                              ? "text-green-500 "
                              : item?.status == "PENDING"
                              ? "text-yellow-500 0"
                              : ""
                          }`}
                        >
                          {item?.status}
                        </td>
                        <td className="text-left text-sm font-normal">
                          {format(new Date(item?.createdAt), "MMM dd yyy")}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-8">
            {isTrack ? (
              <div className="">
                <BookingStatus booking={booking} />
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
                            backgroundColor: booking?.customCasketDetail?.color,
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
                              <span className="text-xs text-gray-600" key={ind}>
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

                  {booking?.additionalBookings && (
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-500 mb-2 whitespace-nowrap">
                        Additional Order's{" "}
                      </p>
                      {booking?.additionalBookings?.map(
                        (item: any, index: number) => (
                          <div key={index} className="flex items-center gap-5">
                            <p className="text-xs dark:text-gray-300">
                              - {item?.additional?.description}
                            </p>

                            <span className="text-xs text-red-500 font-medium">
                              {" "}
                              -{formatCurrency(item?.additional?.price)}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className=" font-bold text-sm">Hospital Details</h1>

                <div className="flex items-center dark:text-gray-300 text-xs tracking-wider">
                  <Hospital className="w-4 h-4 mr-2 text-sky-400" />
                  Name: {booking?.hosName}
                </div>
                <div className="flex items-center dark:text-gray-300 text-xs tracking-wider">
                  <Hospital className="w-4 h-4 mr-2 text-sky-400" />
                  Address: {booking?.hosAddress}
                </div>
                <div className="flex items-center dark:text-gray-300 text-xs tracking-wider">
                  <Hospital className="w-4 h-4 mr-2 text-sky-400" />
                  Room Number: {booking.hosrootNumber}
                </div>
                <div className="flex items-center dark:text-gray-300 text-xs tracking-wider">
                  <Hospital className="w-4 h-4 mr-2 text-sky-400" />
                  Cause Of Death: {booking.hosCauseOfDeath}
                </div>
              </div>
              <div className="">
                <h1 className=" font-bold text-sm">
                  Payment Status{" "}
                  {booking?.isPartialPayment ? (
                    <span
                      className={`text-sm font-bold py-1 px-4 rounded-full text-green-500 bg-green-500/10`}
                    >
                      Partial Payment
                    </span>
                  ) : booking?.isCash ? (
                    <span
                      className={`text-sm font-bold py-1 px-4 rounded-full ${
                        booking?.cashPayment[0]?.status == "PAID"
                          ? "text-green-500 bg-green-500/10"
                          : booking?.cashPayment[0]?.status == "PENDING"
                          ? "text-yellow-500 bg-yellow-500/10"
                          : ""
                      }`}
                    >
                      {" "}
                      {booking?.cashPayment[0]?.status}
                    </span>
                  ) : (
                    <span
                      className={`text-sm font-bold py-1 px-4 rounded-full ${
                        booking?.payments[0]?.status == "PAID"
                          ? "text-green-500 bg-green-500/10"
                          : booking?.payments[0]?.status == "PENDING"
                          ? "text-yellow-500 bg-yellow-500/10"
                          : ""
                      }`}
                    >
                      {" "}
                      {booking?.payments[0]?.status}
                    </span>
                  )}
                </h1>
                {booking?.isPartialPayment && (
                  <div className="mt-1">
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      Total Amount
                      <span className="text-sm font-bold">
                        {formatCurrency(totaltobepaid)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      Total Remaning
                      <span className="text-sm font-bold">
                        {formatCurrency(remaining)}
                      </span>
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      Total Paid
                      <span className="text-sm font-bold">
                        {formatCurrency(totalPaid)}
                      </span>
                    </p>
                    <button
                      onClick={() => setIsView(true)}
                      className="text-xs font-black cursor-pointer bg-yellow-500 py-2 px-4 rounded-xl"
                    >
                      View
                    </button>
                  </div>
                )}
                {!booking?.isPartialPayment && (
                  <div className="mt-1">
                    <p className="text-sm text-gray-500 ">
                      Total Paid:{" "}
                      {booking?.isCash ? (
                        <span className="text-sm font-bold">
                          {formatCurrency(
                            booking?.cashPayment[0]?.totalWithFee
                          )}
                        </span>
                      ) : (
                        <span className="text-sm font-bold">
                          {formatCurrency(
                            booking?.payments[0]?.paymentInfo?.amount
                          )}
                        </span>
                      )}
                    </p>
                    {!booking?.isCash &&
                      booking?.payments[0]?.status == "PENDING" && (
                        <button
                          onClick={() =>
                            (window.location.href =
                              booking?.payments[0]?.paymentUrl)
                          }
                          className="text-xs font-bold py-2 px-4 rounded-full bg-yellow-500 mt-2 cursor-pointer"
                        >
                          Complete Payment
                        </button>
                      )}
                    <p className="text-xs font-semibold mt-3">
                      Payment Method:{" "}
                      <span className="px-3 py-1 bg-green-500/10 rounded-full text-green-500">
                        {booking?.isCash ? "Cash" : "Online"}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-700/30 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gray-400 text-sm">Total Amount</span>
                  <div className="text-2xl font-semibold dark:text-white mt-1">
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
                        ) +
                        Number(booking?.fullPackage?.price ?? 0) +
                        Number(
                          booking?.additionalBookings?.reduce(
                            (acc: any, i: any) => acc + i?.additional?.price,
                            0
                          ) ?? 0
                        )
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-5">
                  {booking?.status !== "COMPLETED" && (
                    <button
                      className="text-sky-500 font-medium bg-sky-500/10 py-3 px-5 rounded-full flex items-center gap-2 cursor-pointer"
                      onClick={() => {
                        if (booking?.isCash) {
                          handleMarkCompleted(null);
                        } else {
                          setShowPaymentModal(true);
                        }
                      }}
                    >
                      Mark as Complete
                    </button>
                  )}

                  <span
                    className={`px-4 py-2 rounded-full text-sm border-r pr-5 ${
                      booking.status === "Confirmed"
                        ? "bg-green-500/20 text-green-300"
                        : "bg-yellow-500/40 text-yellow-800 font-medium"
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
        )}
      </div>

      {showPaymentModal && booking && (
        <PaymentMethodModal
          booking={booking}
          onClose={() => {
            setShowPaymentModal(false);
          }}
          onSubmit={(data: any) => handleMarkCompleted(data)}
        />
      )}
    </div>
  );
};
  
export default BookingModal