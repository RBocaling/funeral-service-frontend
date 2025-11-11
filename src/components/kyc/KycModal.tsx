import { useState, useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKycStatusApi } from "@/api/user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import KYCUpload from "@/components/id-verification/IdVerification";
import useUser from "@/hooks/controllers/useUser";

type MatchResult = {
  status: "found" | "not found";
  similarity: number;
};

interface KYCVerificationModalProps {
  open: boolean;
  onClose: () => void;
}

export default function KYCVerificationModal({
  open,
  onClose,
}: KYCVerificationModalProps) {
  const { isKycVerify } = useUser();
  const queryClient = useQueryClient();

  const [idImg, setIdImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const idImgRef = useRef<HTMLImageElement | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const { mutate: updateKycStatus } = useMutation({
    mutationFn: updateKycStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-info"] });
    },
    onError: (err) => console.error("❌ Failed to update KYC status", err),
  });

  useEffect(() => {
    if (!open) return;

    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
        faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      ]);
    };

    loadModels();
  }, [open]);

  const handleIdUpload = (file: File | null, previewUrl: string) => {
    setIdImg(file ? previewUrl : null);
  };

  const captureSelfie = useCallback(() => {
    return webcamRef.current?.getScreenshot() || null;
  }, []);

  const verifyIdentity = async () => {
    setLoading(true);
    setMatchResult(null);

    if (!idImgRef.current) {
      setLoading(false);
      return alert("Please upload an ID first.");
    }

    const idDetection = await faceapi
      .detectSingleFace(idImgRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!idDetection) {
      setLoading(false);
      return alert("No face found in ID image.");
    }

    const selfieSrc = captureSelfie();
    if (!selfieSrc) {
      setLoading(false);
      return alert("No selfie captured.");
    }

    const selfieImg = new Image();
    selfieImg.src = selfieSrc;
    await new Promise((resolve) => (selfieImg.onload = resolve));

    const selfieDetection = await faceapi
      .detectSingleFace(selfieImg)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!selfieDetection) {
      setLoading(false);
      return alert("No face found in selfie.");
    }

    const matcher = new faceapi.FaceMatcher(
      new faceapi.LabeledFaceDescriptors("UserID", [idDetection.descriptor]),
      0.6
    );

    const result = matcher.findBestMatch(selfieDetection.descriptor);
    const similarity = (1 - result.distance) * 100;

    const matchData: MatchResult = {
      status: result.label === "UserID" ? "found" : "not found",
      similarity: parseFloat(similarity.toFixed(2)),
    };

    setMatchResult(matchData);

    if (matchData.status === "found") updateKycStatus("VERIFIED");

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            KYC Verification
          </DialogTitle>
        </DialogHeader>

        {/* CONTENT */}
        <div className="flex flex-col items-center justify-center mt-4">
          {isKycVerify === "VERIFIED" ? (
            <div className="text-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p className="text-5xl">✅</p>
                <p className="mt-2 font-semibold text-green-600">
                  Verified Account
                </p>
              </motion.div>
            </div>
          ) : (
            <>
              {/* Upload ID */}
              <KYCUpload onUpload={handleIdUpload} />

              {idImg && (
                <img
                  ref={idImgRef}
                  src={idImg}
                  alt="id-preview"
                  className="hidden"
                />
              )}

              {/* Webcam */}
              <div className="mt-6">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  className="rounded-xl border-4 border-blue-400"
                />
                <p className="text-center text-gray-500 text-sm mt-2">
                  Position your face inside the camera view
                </p>
              </div>

              <Button
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700"
                onClick={verifyIdentity}
                disabled={!idImg || loading}
              >
                {loading ? "Processing..." : "Verify Identity"}
              </Button>

              {/* RESULT */}
              <AnimatePresence>
                {matchResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="mt-6 p-4 bg-white rounded-lg shadow-lg w-full text-center"
                  >
                    <p
                      className={`font-bold text-lg ${
                        matchResult.status === "found"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {matchResult.status === "found"
                        ? "✅ Match Found!"
                        : "❌ No Match Found"}
                    </p>
                    <p className="text-gray-700">
                      Similarity: {matchResult.similarity}%
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
