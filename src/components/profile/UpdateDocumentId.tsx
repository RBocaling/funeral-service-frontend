"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
import { Camera } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAddUploadDocument } from "@/hooks/controllers/useAddPersonalInfo";
import useUserAuth from "@/hooks/controllers/useUserAuth";
import { useAlertStore } from "@/store/alertStore";

type UploadDocumentIdProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const UpdateDocumentId: React.FC<UploadDocumentIdProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(null);
  const [selfiePreviewUrl, setSelfiePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openCamera, setOpenCamera] = useState(false);

  const addDocumentMutate = useAddUploadDocument();
  const { data: docData } = useUserAuth();
  const queryClient = useQueryClient();

  const documentInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);
  const webcamRef = useRef<Webcam>(null);


  console.log("docDatadocDatadocData",documentPreviewUrl);
  
  useEffect(() => {
    if (isOpen && docData) {
      if (!documentPreviewUrl && docData?.data?.validIdUrl) {
        setDocumentPreviewUrl(docData?.data?.validIdUrl);
      }
      if (!selfiePreviewUrl && docData?.data?.selfPictureUrl) {
        setSelfiePreviewUrl(docData?.data?.selfPictureUrl);
      }
    }
  }, [isOpen, docData]);

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

  const handleSelfieChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setSelfieFile(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setSelfiePreviewUrl(url);
    } else {
      setSelfiePreviewUrl(null);
    }
  };

  const handleUploadDocumentClick = () => {
    documentInputRef.current?.click();
  };

  const handleUploadSelfieClick = () => {
    selfieInputRef.current?.click();
  };

  const captureSelfie = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "selfie.jpg", { type: "image/jpeg" });
        setSelfieFile(file);
        setSelfiePreviewUrl(imageSrc);
        setOpenCamera(false);
      });
  };
  const { showAlert } = useAlertStore();

  const handleSubmit = async () => {
    if (!documentFile && !documentPreviewUrl) {
      return alert("Please upload Document ID.");
    }
    if (!selfieFile && !selfiePreviewUrl) {
      return alert("Please upload Selfie Picture.");
    }

    setLoading(true);

    try {
      let documentUrl = documentPreviewUrl;
      let selfieUrl = selfiePreviewUrl;

      // Kung may bagong upload na file, i-upload natin ulit
      if (documentFile) {
        documentUrl = await uploadImageToCloudinary(documentFile);
      }
      if (selfieFile) {
        selfieUrl = await uploadImageToCloudinary(selfieFile);
      }

      if (!documentUrl || !selfieUrl) {
        throw new Error("Upload Cloudinary Error");
      }

      const payload = {
        validIdUrl: documentUrl,
        selfPictureUrl: selfieUrl,
      };

      addDocumentMutate.mutate(payload, {
        onSuccess: async() => {
          await showAlert('success', {
            title: 'Success Updated!',
            message: 'Your action was completed successfully.',
            autoClose: true,
          });
          queryClient.invalidateQueries({ queryKey: ["getProfileProgress"] });
          queryClient.invalidateQueries({ queryKey: ["user-info"] });
          queryClient.invalidateQueries({ queryKey: ["user-auth"] });
          setIsOpen(false);
        },
        onError: async(error: any) => {
          await showAlert('error', {
            title: 'Error Add',
            message: 'Something went wrong. Please try again.',
            autoClose: true,
          });
        },
      });

     
    } catch (error) {
      console.error("Upload error:", error);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="p-0 rounded-2xl overflow-hidden max-h-screen overflow-y-auto scroll-smooth px-7 py-12">
        <h2 className="text-2xl font-bold text-center text-white mb-6">
          Upload Document ID & Selfie Picture
        </h2>

        {/* Document Upload Section */}
        <div className="w-full flex flex-col items-center gap-2 mb-8">
          <p className="text-center text-gray-500 text-sm mb-2">
            Upload a clear image of your Document ID.
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

        {/* Selfie Upload Section */}
        <div className="w-full flex flex-col items-center gap-2 mb-8">
          <p className="text-center text-gray-500 text-sm mb-2">
            Upload or Capture your Selfie Picture.
          </p>

          {/* Kung naka-open ang camera */}
          {openCamera ? (
            <div className="flex flex-col items-center">
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                className="rounded-xl max-h-52 w-full"
                videoConstraints={{ facingMode: "user" }}
              />
              <button
                onClick={captureSelfie}
                className="mt-4 bg-sky-500 hover:bg-sky -700 text-white font-semibold py-2 px-6 rounded-full transition"
              >
                Capture Photo
              </button>
              <button
                onClick={() => setOpenCamera(false)}
                className=" text-red-500 font-medium animate-bounce mt-5"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700/20 transition w-full"
              onClick={handleUploadSelfieClick}
            >
              {selfiePreviewUrl ? (
                <img
                  src={selfiePreviewUrl}
                  alt="Selfie Preview"
                  className="object-cover rounded-xl max-h-52"
                />
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-gray-500 text-sm text-center">
                    Click to upload a selfie
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center justify-center gap-7">
            <div className="flex-1 w-[20%] h-1 bg-white">{""}</div>
            <p className="text-white font-semibold">Or</p>
            <div className="flex-1 h-1 bg-white"></div>
          </div>

          {/* Button to open camera */}
          {!openCamera && (
            <button
              onClick={() => setOpenCamera(true)}
              className="border-2 border-dashed text-sm text-gray-500 border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700/20 transition w-full"
            >
              <Camera /> take a Capture selfie
            </button>
          )}
        </div>

        {/* Hidden Inputs */}
        <input
          ref={documentInputRef}
          type="file"
          accept="image/*,application/pdf"
          onChange={handleDocumentChange}
          className="hidden"
        />
        <input
          ref={selfieInputRef}
          type="file"
          accept="image/*"
          onChange={handleSelfieChange}
          className="hidden"
        />

        {/* Submit Button */}
        <button
          className="w-full bg-sky-500 hover:bg-blue-700 text-white font-semibold py-3 rounded-full transition mt-6"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Document"}
        </button>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateDocumentId;
