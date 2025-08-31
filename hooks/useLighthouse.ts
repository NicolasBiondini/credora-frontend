import { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";

interface UploadProgress {
  progress: number;
  total: number;
}

interface IFileUploadedResponse {
  Name: string;
  Size: string;
  Hash: string;
}

interface LighthouseResponse {
  data: IFileUploadedResponse;
}

export const useLighthouse = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(
    null
  );

  const uploadToLighthouse = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setUploadProgress(null);

      const apiKey = process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY;
      if (!apiKey || apiKey.trim() === "") {
        throw new Error(
          "Lighthouse API key not found or empty. Please check your .env file"
        );
      }

      // Log the file details for debugging
      console.log("Uploading file:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      // Create an array with the file
      const files = [file];

      const output = (await lighthouse.upload(
        files,
        apiKey
      )) as LighthouseResponse;

      console.log("Lighthouse response:", output);

      const ipfsHash = output.data.Hash;
      const ipfsUrl = `https://gateway.lighthouse.storage/ipfs/${ipfsHash}`;

      return ipfsUrl;
    } catch (error) {
      console.error("Error uploading to Lighthouse:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to upload: ${error.message}`);
      }
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return {
    uploadToLighthouse,
    isUploading,
    uploadProgress,
  };
};
