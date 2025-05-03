"use client";

import React, { useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "../ui/input";
import { useAddMessageMutate } from "@/hooks/controllers/useMessage";
import { useMessageStore } from "@/store/messageStore";

type UploadMessageFileProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  messages:any
};

const UploadMessageFile: React.FC<UploadMessageFileProps> = ({
  isOpen,
  setIsOpen,
  messages
}) => {
  const { conversationid } = useMessageStore();
  const addMessage = useAddMessageMutate();
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [content, setContent] = useState<String | null>(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const documentInputRef = useRef<HTMLInputElement>(null);

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setDocumentFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setDocumentPreviewUrl(url);
    } else {
      setDocumentPreviewUrl(null);
    }
  };


  const handleUploadDocumentClick = () => {
    documentInputRef.current?.click();
  };



  const handleSubmit = async () => {
    if (!documentFile) {
      throw new Error("No Attach Image")
    }
    setLoading(true);

    try {
      const documentUrl = await uploadImageToCloudinary(documentFile)

      if (!documentUrl) {
        throw new Error("Upload Cloudinary Error");
      }
      const payload = {
        attachedImageUrl: documentUrl,
        content,
        conversationId: Number(conversationid?.id),
        receiverId: Number(messages[0]?.senderId),

      };
      addMessage.mutate(
        payload,
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["messages"],
            });
            setIsOpen(false)
            setLoading(false);
            setDocumentPreviewUrl(null);
            setContent(null)
          },
          
          onError: (error: any) => {
            setLoading(false);
            console.error("add message failed:", error.response?.data?.message || error.message);
          },
        }
      );
    

      
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 rounded-2xl overflow-hidden max-h-screen overflow-y-auto scroll-smooth px-7 py-12">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Upload Image
        </h2>

        <div className="w-full flex flex-col items-center gap-2 mb-3">
          <p className="text-center text-gray-500 text-sm mb-2">
            Upload any image of your proof of payment or other images
          </p>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700/20 transition w-full"
            onClick={handleUploadDocumentClick}
          >
            {documentPreviewUrl ? (
              <img
                src={documentPreviewUrl}
                alt="Document Preview"
                className="object-cover rounded-xl max-h-52"
              />
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-gray-500 text-sm text-center">
                  Click to upload or drag and drop
                </p>
              </div>
            )}
          </div>
        </div>
        
        <input
          ref={documentInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleDocumentChange}
          className="hidden"
        />
       
       <Input
          type="text"
          placeholder="Enter Message (Optional)"
          className="flex-1 rounded-xl py-4 w-full"
          onChange={(e)=> setContent(e.target.value)}
        />

        <button
          className="w-full bg-sky-500 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition mt-6"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default UploadMessageFile;
