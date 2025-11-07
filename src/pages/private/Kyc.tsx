import { useState, useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateKycStatusApi } from "@/api/user";
import useUserAuth from "@/hooks/controllers/useUserAuth";
import KYCUpload from "@/components/id-verification/IdVerification";
import useUser from "@/hooks/controllers/useUser";

type MatchResult = {
  status: "found" | "not found";
  similarity: number;
};

const KYCVerification = () => {
  const { isLoading } = useUserAuth();
  const { isKycVerify } = useUser();
  console.log("datafuneral", isKycVerify);

    const queryClient = useQueryClient();

  const [idImg, setIdImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const idImgRef = useRef<HTMLImageElement | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

  const { mutate: updateKycStatus } = useMutation({
    mutationFn: updateKycStatusApi,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-info"],
      });
    },
    onError: (err) => {
      console.error("❌ Failed to update KYC status", err);
    },
  });

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

    const labeledFace = new faceapi.LabeledFaceDescriptors("UserID", [
      idDetection.descriptor,
    ]);
    const matcher = new faceapi.FaceMatcher(labeledFace, 0.6);
    const result = matcher.findBestMatch(selfieDetection.descriptor);

    const similarity = (1 - result.distance) * 100;

    const matchData: MatchResult = {
      status: result.label === "UserID" ? "found" : "not found",
      similarity: parseFloat(similarity.toFixed(2)),
    };

    setMatchResult(matchData);

    if (matchData.status === "found") {
      updateKycStatus("VERIFIED");
    }

    setLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center  bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-extrabold mb-8 text-gray-800"
      >
        KYC Verification
      </motion.h2>

      {isKycVerify === "VERIFIED" ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-xl max-w-md text-center"
        >
          <motion.div
            initial={{ rotate: -20, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-green-600 text-6xl mb-4"
          >
            ✅
          </motion.div>
          <h3 className="text-2xl font-bold text-green-700 mb-2">
            Verified Account
          </h3>
          <p className="text-gray-600">
            Your identity has been successfully verified. You can now access all
            platform features.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Upload ID */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            <KYCUpload onUpload={handleIdUpload} />
          </motion.div>

          {idImg && (
            <img
              ref={idImgRef}
              src={idImg}
              alt="ID hidden"
              className="hidden"
            />
          )}

          {/* Webcam Selfie */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative mt-10 mb-6"
          >
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              width={280}
              height={280}
              videoConstraints={{ facingMode: "user" }}
              className="rounded-full border-4 border-blue-400 shadow-lg object-cover"
            />
            <p className="text-sm text-gray-500 mt-2 text-center">
              Align your face inside the circle
            </p>
          </motion.div>

          {/* Verify Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            onClick={verifyIdentity}
            disabled={loading || !idImg}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Processing..." : "Verify Identity"}
          </motion.button>

          {/* Result Message */}
          <AnimatePresence>
            {matchResult && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4 }}
                className="mt-8 p-6 bg-white rounded-2xl shadow-lg w-full max-w-sm text-center"
              >
                <motion.p
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`font-bold text-lg ${
                    matchResult.status === "found"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {matchResult.status === "found"
                    ? "✅ Match Found!"
                    : "❌ No Match Found"}
                </motion.p>
                <p className="mt-3 text-gray-700">
                  Confidence:{" "}
                  <span className="font-extrabold">
                    {matchResult.similarity}%
                  </span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default KYCVerification;
