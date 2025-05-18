"use client";

import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";
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
  const [bussinessPermit, setbussinessPermit] = useState<File | null>(null);
  const [sanitaryPermit, setsanitaryPermit] = useState<File | null>(null);
  const [embalmerLicense, setembalmerLicense] = useState<File | null>(null);
  const [documentPreviewUrl, setDocumentPreviewUrl] = useState<string | null>(null);
  const [bussinessPermitPreviewUrl, setbussinessPermitPreviewUrl] = useState<string | null>(null);
  const [sanitaryPermitPreviewUrl, setsanitaryPermitPreviewUrl] = useState<string | null>(null);
  const [embalmerLicensePreviewUrl, setembalmerLicensePreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addDocumentMutate = useAddUploadDocument();
  const { data: docData } = useUserAuth();
  const queryClient = useQueryClient();

  const documentInputRef = useRef<HTMLInputElement>(null);
  const bussinessPermitRef = useRef<HTMLInputElement>(null);
  const sanitaryPermitRef = useRef<HTMLInputElement>(null);
  const embalmerLicenseRef = useRef<HTMLInputElement>(null);
  
  console.log("docData?.data",docData?.data);
  
  useEffect(() => {
    if (isOpen && docData) {
      if (!documentPreviewUrl && docData?.data?.validIdUrl) {
        setDocumentPreviewUrl(docData?.data?.validIdUrl);
      }
      if (!bussinessPermitPreviewUrl && docData?.data?.bussinessPermit) {
        setbussinessPermitPreviewUrl(docData?.data?.bussinessPermit);
      }
      if (!sanitaryPermitPreviewUrl && docData?.data?.sanitaryPermit) {
        setsanitaryPermitPreviewUrl(docData?.data?.sanitaryPermit);
      }
      if (!embalmerLicensePreviewUrl && docData?.data?.embalmerLicense) {
        setembalmerLicensePreviewUrl(docData?.data?.embalmerLicense);
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

  const handlebussinessPermitRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setbussinessPermit(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setbussinessPermitPreviewUrl(url);
    } else {
      setbussinessPermitPreviewUrl(null);
    }
  };
  const handlesanitaryPermitRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setsanitaryPermit(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setsanitaryPermitPreviewUrl(url);
    } else {
      setsanitaryPermitPreviewUrl(null);
    }
  };
  const handleembalmerLicenseRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setembalmerLicense(selectedFile);

    if (selectedFile.type.startsWith("image/")) {
      const url = URL.createObjectURL(selectedFile);
      setembalmerLicensePreviewUrl(url);
    } else {
      setembalmerLicensePreviewUrl(null);
    }
  };

  const handleUploadDocumentClick = () => {
    documentInputRef.current?.click();
  };
  const handleUploadBussinesClick = () => {
    bussinessPermitRef.current?.click();
  };
  const handleUploadSanitaryClick = () => {
    sanitaryPermitRef.current?.click();
  };
  const handleUploadembalmerClick = () => {
    embalmerLicenseRef.current?.click();
  };




  const { showAlert } = useAlertStore();

  const handleSubmit = async () => {
    if (!documentFile && !documentPreviewUrl) {
      return alert("Please upload Document ID.");
    }
    if (!bussinessPermit && !bussinessPermitPreviewUrl) {
      return alert("Please upload bussinessPermit Picture.");
    }
    if (!sanitaryPermit && !sanitaryPermitPreviewUrl) {
      return alert("Please upload sanitaryPermitPreviewUrl Picture.");
    }
    if (!embalmerLicense && !embalmerLicensePreviewUrl) {
      return alert("Please upload embalmerLicensePreviewUrl Picture.");
    }

    setLoading(true);

    try {
      let documentUrl = documentPreviewUrl;
      let businessPermitImg = bussinessPermitPreviewUrl;
      let sanitaryPermitImg = sanitaryPermitPreviewUrl;
      let embalmerPermitImg = embalmerLicensePreviewUrl;

      if (documentFile) {
        documentUrl = await uploadImageToCloudinary(documentFile);
      }
      if (bussinessPermit) {
        businessPermitImg = await uploadImageToCloudinary(bussinessPermit);
      }
      if (sanitaryPermit) {
        sanitaryPermitImg = await uploadImageToCloudinary(sanitaryPermit);
      }
      if (embalmerLicense) {
        embalmerPermitImg = await uploadImageToCloudinary(embalmerLicense);
      }

      if (!documentUrl || !bussinessPermitPreviewUrl || !sanitaryPermitPreviewUrl || !embalmerLicensePreviewUrl) {
        throw new Error("Upload Cloudinary Error");
      }

      const payload = {
        validIdUrl: documentUrl,
        bussinessPermit: businessPermitImg,
        sanitaryPermit: sanitaryPermitImg,
        embalmerLicense: embalmerPermitImg,
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
        onError: async() => {
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

        <div className="grid grid-cols-2 gap-5">
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
        {/* bi=ussiness permit Upload Section */}
        <div className="w-full flex flex-col items-center gap-2 mb-8">
          <p className="text-center text-gray-500 text-sm mb-2">
            Upload a clear image of your Bussiness Permit.
          </p>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700/20 transition w-full"
            onClick={handleUploadBussinesClick}
          >
            {bussinessPermitPreviewUrl ? (
              <img
                src={bussinessPermitPreviewUrl}
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

        
        {/* sanitarypermit Upload Section */}
        <div className="w-full flex flex-col items-center gap-2 mb-8">
          <p className="text-center text-gray-500 text-sm mb-2">
            Upload a clear image of your Sanitary Permit.
          </p>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700/20 transition w-full"
            onClick={handleUploadSanitaryClick}
          >
            {sanitaryPermitPreviewUrl ? (
              <img
                src={sanitaryPermitPreviewUrl}
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
        
        {/* embalmerLicense Upload Section */}
        <div className="w-full flex flex-col items-center gap-2 mb-8">
          <p className="text-center text-gray-500 text-sm mb-2">
            Upload a clear image of your Embalmer License.
          </p>
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700/20 transition w-full"
            onClick={handleUploadembalmerClick}
          >
            {embalmerLicensePreviewUrl ? (
              <img
                src={embalmerLicensePreviewUrl}
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
          ref={bussinessPermitRef}
          type="file"
          accept="image/*"
          onChange={handlebussinessPermitRefChange}
          className="hidden"
        />
        <input
          ref={sanitaryPermitRef}
          type="file"
          accept="image/*"
          onChange={handlesanitaryPermitRefChange}
          className="hidden"
        />
        <input
          ref={embalmerLicenseRef}
          type="file"
          accept="image/*"
          onChange={handleembalmerLicenseRefChange}
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
