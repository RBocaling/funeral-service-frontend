import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import * as faceapi from "face-api.js";
import { useOCRValidator } from "@/hooks/useOCRValidator";

type Props = {
  onUpload: (file: File | null, previewUrl: string) => void;
};

const KYCUpload = ({ onUpload }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);
  const { validateID } = useOCRValidator();

  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      ]);
    };
    loadModels();
  }, []);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    setLoading(true);
    setError(null);

    try {
      const ocrResult = await validateID(file);
      if (!ocrResult.isValid) throw new Error("Invalid ID detected.");

      const img = new Image();
      img.src = url;
      await new Promise((resolve) => (img.onload = resolve));

      const detection = await faceapi
        .detectSingleFace(img)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) throw new Error("No face detected in the uploaded ID.");

      onUpload(file, url);
    } catch (err: any) {
      setError(err.message || "Upload failed.");
      setPreview(null);
      onUpload(null, "");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setLoading(false);
    setError(null);
    onUpload(null, "");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-400 rounded-2xl cursor-pointer hover:bg-gray-50 transition">
          <Upload className="w-10 h-10 text-gray-500 mb-2" />
          <span className="text-gray-700 font-medium">Upload ID</span>
          <p className="text-sm text-gray-500">Only government-issued IDs</p>
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      ) : (
        <div className="relative w-full h-56 rounded-2xl overflow-hidden">
          <img
            ref={imgRef}
            src={preview}
            alt="Preview"
            className={`w-full h-full object-cover ${loading ? "blur-md" : ""}`}
          />
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white">
              <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-sm font-medium">Identifying ID...</p>
            </div>
          )}
          {!loading && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
      {error && (
        <p className="mt-3 text-sm text-red-600 font-medium text-center">
          {error}
        </p>
      )}
    </div>
  );
};

export default KYCUpload;
