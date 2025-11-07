// src/hooks/useOCRValidator.ts
import { useState } from "react";
import Tesseract from "tesseract.js";

type OCRResult = {
  isValid: boolean;
  text: string;
  confidence: number;
};

export const useOCRValidator = () => {
  const [loading, setLoading] = useState(false);

  const validateID = async (file: File): Promise<OCRResult> => {
    setLoading(true);

    try {
      const result = await Tesseract.recognize(file, "eng");
      const text = result.data.text.toUpperCase();
      const confidence = result.data.confidence;

      // Simple keyword-based ID validation
      const isValid =
        text.includes("IDENTIFICATION") ||
        text.includes("PASSPORT") ||
        text.includes("DRIVER") ||
        text.includes("LICENSE") ||
        text.includes("REPUBLIC");

      return { isValid, text, confidence };
    } finally {
      setLoading(false);
    }
  };

  return { validateID, loading };
};
