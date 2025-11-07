import { useState, useEffect, useRef, useCallback } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import KYCUpload from "./IdVerification";

type MatchResult = {
  status: "found" | "not found";
  similarity: number;
};

const KYCVerification = () => {
  const [idImg, setIdImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  const idImgRef = useRef<HTMLImageElement | null>(null);
  const webcamRef = useRef<Webcam | null>(null);

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

    setMatchResult({
      status: result.label === "UserID" ? "found" : "not found",
      similarity: parseFloat(similarity.toFixed(2)),
    });

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        KYC Verification
      </h2>

      <KYCUpload onUpload={handleIdUpload} />

      {idImg && (
        <img ref={idImgRef} src={idImg} alt="ID hidden" className="hidden" />
      )}

      <div className="relative mt-8 mb-6">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={280}
          height={280}
          videoConstraints={{ facingMode: "user" }}
          className="rounded-full border-4 border-gray-300 shadow-md object-cover"
        />
        <p className="text-sm text-gray-500 mt-2">
          Align your face inside the circle
        </p>
      </div>

      <button
        onClick={verifyIdentity}
        disabled={loading || !idImg}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Verify Identity"}
      </button>

      {matchResult && (
        <div className="mt-6 p-4 bg-white rounded-lg shadow w-full max-w-sm text-center">
          <p
            className={`font-semibold text-lg ${
              matchResult.status === "found" ? "text-green-600" : "text-red-600"
            }`}
          >
            {matchResult.status === "found"
              ? "✅ Match Found!"
              : "❌ No Match Found"}
          </p>
          <p className="mt-2 text-gray-700">
            Confidence:{" "}
            <span className="font-bold">{matchResult.similarity}%</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default KYCVerification;
