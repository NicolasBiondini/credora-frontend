"use client";

import {
  Upload,
  FileText,
  CheckCircle,
  Wallet,
  UserCheck,
  Shield,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useAccount } from "wagmi";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Profile() {
  const [mounted, setMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [creditScore, setCreditScore] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Mock function that simulates file upload and verification
  const handleFileUpload = useCallback(async (files: File[]) => {
    setIsUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Add files to uploaded list
    setUploadedFiles((prev) => [...prev, ...files]);

    // Mock verification process - in real app this would analyze the files
    setTimeout(() => {
      setIsVerified(true);
      // Generate a random score for demo
      const score = Math.round((Math.random() * 9 + 1) * 10) / 10;
      setCreditScore(score);
      setIsUploading(false);
    }, 1000);
  }, []);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleFileUpload(acceptedFiles);
    },
    [handleFileUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "message/rfc822": [".eml"],
    },
    maxFiles: 3,
    multiple: true,
  });

  // Function to get score color based on value
  const getScoreColor = (score: number) => {
    if (score < 5) return "text-red-600";
    if (score < 7.5) return "text-yellow-600";
    return "text-green-600";
  };

  // Function to get score description
  const getScoreDescription = (score: number) => {
    if (score < 5) return "Poor";
    if (score < 7.5) return "Fair";
    return "Excellent";
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="w-full h-[400px] bg-muted rounded-[20px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="w-full bg-orange-primary text-black rounded-[20px] overflow-hidden">
        <CardHeader className="text-center pb-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <UserCheck className="h-6 w-6" />
            <CardTitle className="text-lg font-bold">
              Profile Verification
            </CardTitle>
            <Shield className="h-6 w-6" />
          </div>
          <CardDescription className="text-sm text-black">
            Verify your income
          </CardDescription>
        </CardHeader>

        <CardContent className="bg-white text-neutral-black rounded-t-[20px] pt-4">
          {!isConnected ? (
            // Not Connected State
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-gray-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Connect Wallet
                </h3>
                <p className="text-sm text-gray-600">
                  Connect to verify your income
                </p>
              </div>
              <div className="w-full max-w-xs">
                <ConnectButton.Custom>
                  {({ openConnectModal, mounted }) => {
                    if (!mounted) return null;

                    return (
                      <Button
                        onClick={openConnectModal}
                        className="w-full h-10 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect Wallet
                      </Button>
                    );
                  }}
                </ConnectButton.Custom>
              </div>
            </div>
          ) : !isVerified ? (
            // Connected but Not Verified State
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-gray-900">
                  Upload Deel Emails
                </h3>
                <p className="text-xs text-gray-600">
                  Upload your income emails to verify
                </p>
              </div>

              {/* File Upload Area */}
              <div className="w-full max-w-sm">
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {isDragActive ? "Drop here" : "Drop Deel emails"}
                    </p>
                    <p className="text-xs text-gray-500">or click to browse</p>
                    <p className="text-xs text-gray-400">
                      Only .eml files (max 3)
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Status */}
              {isUploading && (
                <div className="w-full max-w-sm">
                  <div className="bg-blue-50 border border-blue-200 rounded p-2">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      <p className="text-xs font-medium text-blue-900">
                        Processing...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="w-full max-w-sm">
                  <div className="space-y-1">
                    <h4 className="text-xs font-medium text-gray-900">
                      Files ({uploadedFiles.length})
                    </h4>
                    <div className="space-y-1">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-1 text-xs text-gray-600"
                        >
                          <FileText className="w-3 h-3" />
                          <span className="truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Verified State - Show Profile and Score
            <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-semibold text-gray-900">
                  Verified!
                </h3>
                <p className="text-xs text-gray-600">
                  Income verified with ZK proof
                </p>
              </div>

              {/* Credit Score Display */}
              <div className="space-y-2">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold ${getScoreColor(
                        creditScore
                      )}`}
                    >
                      {creditScore}
                    </div>
                    <div className="text-xs text-gray-600">Score</div>
                  </div>
                </div>

                <div
                  className={`text-sm font-medium ${getScoreColor(
                    creditScore
                  )}`}
                >
                  {getScoreDescription(creditScore)}
                </div>
              </div>

              {/* Verification Details */}
              <div className="w-full max-w-xs bg-gray-50 rounded p-2">
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="text-green-600 font-medium">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Files:</span>
                    <span>{uploadedFiles.length}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {isConnected && (
          <CardFooter className="flex-col items-center gap-1 text-xs bg-white text-neutral-black px-4 pb-4">
            <div className="text-gray-600 text-center">
              {isVerified ? "Profile verified ✓" : "Upload emails to verify"}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
