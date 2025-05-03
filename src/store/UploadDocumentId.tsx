"use client";

import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";

type UploadDocumentIdProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const UploadDocumentId: React.FC<UploadDocumentIdProps> = ({ isOpen, setIsOpen }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    setFile(droppedFile);

    if (droppedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(droppedFile);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select a file first.");

    setLoading(true);

    try {
      const imgUrl = await uploadImageToCloudinary(file);
      setLoading(false);
      console.log("imgUrl",imgUrl);
    
    } catch (error) {
      console.error("ff0 error", error);
      setLoading(false);

    } 
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 rounded-2xl overflow-hidden px-7 py-12">
        <h2 className="text-2xl font-bold text-center text-white">
          Upload Document ID
        </h2>
        <p className="text-center text-gray-500 text-sm">
          Upload a clear image of your ID.
        </p>

        <div
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700/20 transition relative"
          onClick={handleUploadClick}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="object-cover rounded-xl max-h-52"
            />
          ) : (
            <div className="flex flex-col items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-400 mb-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M4 12l4-4m0 0l4 4m-4-4v12"
                />
              </svg>
              <p className="text-gray-500 text-sm text-center">
                Click to upload or drag and drop
              </p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          className="w-full bg-sky-500 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition mt-6"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Submit Document"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentId;
