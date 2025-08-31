import { useCallback, useState } from "react";
import {
  Synapse,
  RPC_URLS,
  TOKENS,
  CONTRACT_ADDRESSES,
} from "@filoz/synapse-sdk";
import { parseEther } from "viem";

interface UploadResult {
  cid: string;
  url: string;
  size: number;
  success: boolean;
  dealId: string;
  provider: string;
}

// the faucet didnt work for USDFC (image)
// check FAUCET_NOT_WORKING.png on this repo
export const useIPFS = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadImage = useCallback(async (file: File): Promise<UploadResult> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Initialize SDK
      const synapse = await Synapse.create({
        privateKey:
          "0x1234567890123456789012345678901234567890123456789012345678901234",
        rpcURL: RPC_URLS.calibration.websocket,
      });
      setUploadProgress(20);

      // Payment Setup with USDFC
      const amount = parseEther("1"); // 1 USDFC should be enough
      await synapse.payments.deposit(amount, TOKENS.USDFC);
      setUploadProgress(40);

      const pandoraAddress =
        CONTRACT_ADDRESSES.PANDORA_SERVICE[synapse.getNetwork()];
      await synapse.payments.approveService(
        pandoraAddress,
        parseEther("0.1"), // Rate allowance: 0.1 USDFC per epoch
        parseEther("1") // Lockup allowance: 1 USDFC total
      );
      setUploadProgress(60);

      // Create storage service
      const storage = await synapse.createStorage();
      setUploadProgress(70);

      // Convert File to Uint8Array
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Upload data
      const uploadResult = await storage.upload(uint8Array);
      setUploadProgress(90);

      // Format the result
      const result: UploadResult = {
        cid: uploadResult.commp.toString(),
        url: `https://ipfs.io/ipfs/${uploadResult.commp.toString()}`,
        size: uint8Array.length,
        success: true,
        dealId: "pending",
        provider: "auto-selected",
      };

      setUploadProgress(100);
      return result;
    } catch (error) {
      console.error("Error uploading to IPFS:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { uploadImage, isUploading, uploadProgress };
};
