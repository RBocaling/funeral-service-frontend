"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { LoaderCircle, Paperclip, SendHorizontal } from "lucide-react";
import { Input } from "../ui/input";
import { useAddMessageMutate } from "@/hooks/controllers/useMessage";
import { useState, useRef, useEffect } from "react";
import { useMessageStore } from "@/store/messageStore";
import useUserAuth from "@/hooks/controllers/useUserAuth";
import { useQueryClient } from "@tanstack/react-query";
import UploadMessageFile from "./UploadImage";

const Message = ({ message, isSender }: any) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-xs p-3 rounded-3xl ${
          isSender
            ? "bg-sky-500 rounded-tr-none"
            : "bg-gray-700/50 rounded-tl-none"
        } text-white  ${
          message?.attachedImageUrl && "bg-transparent flex flex-col items-end"
        }`}
      >
        <img src={message?.attachedImageUrl || ""} className="w-1/" alt="" />
        <p>{message?.content}</p>
        <small className="text-xs">
          {new Date(message?.createdAt).toLocaleString()}
        </small>
      </div>
    </div>
  );
};

export function MessageList({ messages }: any) {
  const queryClient = useQueryClient();

  const { conversationid } = useMessageStore();
  const { data: user } = useUserAuth();
  const [message, setMessage] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [isOpenUploadFile, setIsOpenUploadFile] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const addMessage = useAddMessageMutate();

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const handleAddBooking = (e: React.FormEvent) => {
    e.preventDefault();
    addMessage.mutate(
      {
        conversationId: Number(conversationid?.id),
        content: message,
        receiverId: Number(messages[0]?.senderId),
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["messages"],
          });
          setMessage("");
        },
        onError: (error: any) => {
          console.error(
            "add message failed:",
            error.response?.data?.message || error.message
          );
        },
      }
    );
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
      setIsPopoverOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col gap-5 pt-5">
      <ScrollArea className="h-[65vh] w-full rounded-lg px-4 relative">
        <div className="flex flex-col">
          {messages?.map((message: any) => (
            <Message
              key={message.id}
              message={message}
              isSender={message.senderId === Number(user?.data?.id)}
            />
          ))}
        </div>
      </ScrollArea>

      {/* Message Input Section */}
      <form
        onSubmit={handleAddBooking}
        className="flex items-center gap-5 px-5 relative"
      >
        {/* Attach Button with Popover */}
        <div className="relative" ref={popoverRef}>
          <button type="button" onClick={togglePopover}>
            <Paperclip className="text-sky-500" />
          </button>

          {isPopoverOpen && (
            <div className="absolute bottom-14 left-0 w-64 bg-gray-800 rounded-2xl shadow-xl p-4 flex flex-col space-y-2 z-50 cursor-pointer">
              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-gray-50 hover:opacity-70 rounded-lg transition"
                onClick={() => {
                  setIsPopoverOpen(false);
                  setIsOpenUploadFile(true);
                }}
              >
                📄 Upload Proof of Payment
              </button>

              <button
                type="button"
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:opacity-70 transition"
                onClick={() => {
                  setIsPopoverOpen(false);
                  alert("Cancel Order clicked!");
                }}
              >
                ❌ Cancel Order
              </button>
            </div>
          )}
        </div>

        <Input
          type="text"
          placeholder="Enter Message..."
          className="flex-1 rounded-xl py-4"
          onChange={(e) => setMessage(e.target.value)}
          value={message || ""}
        />

        <button type="submit" className="cursor-pointer">
          {addMessage?.isPending ? (
            <LoaderCircle className="text-sky-500 animate-spin" />
          ) : (
            <SendHorizontal className="text-sky-500" />
          )}
        </button>
      </form>

      <UploadMessageFile
        messages={messages}
        isOpen={isOpenUploadFile}
        setIsOpen={setIsOpenUploadFile}
      />
    </div>
  );
}

