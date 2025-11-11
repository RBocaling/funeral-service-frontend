import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudUpload, Loader2 } from "lucide-react"; // ✅ Added Loader2
import { useState } from "react";
import { useAddDocument } from "@/hooks/controllers/useFuneralDocuments";
import { uploadImageToCloudinary } from "@/utils/uploadImageToCloudinary";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  refetch?: () => void;
}

export default function UploadDocumentsModal({ open, setOpen }: Props) {
  const addMutation = useAddDocument();

  const [isUploading, setIsUploading] = useState(false); // ✅ loading state

  const [docFiles, setDocFiles] = useState<Record<string, File | null>>({
    bussinessPermit: null,
    sanitaryPermit: null,
    embalmerLicense: null,
    validId: null,
  });

  const [preview, setPreview] = useState<Record<string, string | null>>({
    bussinessPermit: null,
    sanitaryPermit: null,
    embalmerLicense: null,
    validId: null,
  });

  const handleFileChange = (key: string, file: File | null) => {
    setDocFiles((prev) => ({ ...prev, [key]: file }));
    setPreview((prev) => ({
      ...prev,
      [key]: file ? URL.createObjectURL(file) : null,
    }));
  };

  const handleSubmit = async () => {
    const files = Object.values(docFiles);
    if (files.some((f) => !f))
      return alert("Please upload all required files.");

    setIsUploading(true); // ✅ Start loading
    const uploadedUrls: Record<string, string> = {};

    for (const key of Object.keys(docFiles)) {
      const file = docFiles[key]!;
      uploadedUrls[key] = await uploadImageToCloudinary(file);
    }

    await addMutation.mutateAsync(uploadedUrls);
    setIsUploading(false); // ✅ Stop loading
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>Upload Business Documents</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          {[
            "bussinessPermit",
            "sanitaryPermit",
            "embalmerLicense",
            "validId",
          ].map((key) => (
            <div
              key={key}
              className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 cursor-pointer hover:border-sky-400 transition"
              onClick={() => document.getElementById(key)?.click()}
            >
              <CloudUpload className="text-gray-300" size={60} />
              <span className="mt-2 text-sm text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </span>

              {/* hidden input */}
              <input
                id={key}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(key, e.target.files?.[0] || null)
                }
              />

              {/* preview */}
              {preview[key] && (
                <img
                  src={preview[key]!}
                  className="mt-3 h-40 w-full object-cover rounded-lg shadow-md"
                />
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isUploading || addMutation.isPending}
            className="w-full bg-sky-600 hover:bg-sky-500"
          >
            {isUploading || addMutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                Uploading...
              </div>
            ) : (
              "Submit Documents"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
