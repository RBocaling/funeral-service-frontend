import React from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { useMessageStore } from "@/store/messageStore";

const funeralDocument = ({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: any;
}) => {
  const { conversationid } = useMessageStore();

  console.log("conversationid", conversationid);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[825px]">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
         Customer Document Id and Selfie Picture
        </h2>

        <div className="w-full flex flex-col items-center gap-2 mb-3">
          <p className="text-center text-gray-500 text-sm mb-2">
          The Customer document ID and selfie picture. Please check the details below for verification. If everything looks good.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 ">
            <div className="w-full md:w-[350px] rounded-2xl bg-gray-700/30 overflow-hidden flex flex-col items-center">
              <img
                src={conversationid?.customerDocuementId?.documentId}
                className="w-full h-[320px]"
                alt=""
              />
              <h1 className="text-white-text-xl font-semibold text-center p-7">
                Document Id
              </h1>
            </div>
            <div className="w-full md:w-[350px] rounded-2xl bg-gray-700/30 overflow-hidden flex flex-col items-center">
              <img
                src={conversationid?.customerDocuementId?.selfieImage}
                className="w-full h-[320px]"
                alt=""
              />
              <h1 className="text-white-text-xl font-semibold text-center p-7">
                Selfie Picture{" "}
              </h1>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default funeralDocument;
