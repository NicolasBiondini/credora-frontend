"use client";

import {
  CreditCard,
  Info,
  Wallet,
  UserCheck,
  Percent,
  DollarSign,
  Calculator,
  Shield,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
} from "wagmi";
import { isAddress, parseEther } from "viem";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Slider } from "@/components/ui/slider";
import deployments from "@/contracts/deployments";
import CRDVaultAbi from "@/contracts/abi/CRDVault.abi";
import { toast } from "@/lib/utils";
import { mockNoteIssuer, mockTransactionStatus } from "@/lib/mock-notes";

// Utility functions
const ETH_PRICE_USD = 4400; // Hardcoded ETH price

const getAnnualInterestRate = (score: number) => {
  if (score < 5) return 18.5;
  if (score < 6) return 15.2;
  if (score < 7) return 12.8;
  if (score < 7.5) return 10.5;
  if (score < 8) return 8.2;
  if (score < 9) return 6.5;
  return 4.8;
};

interface BorrowCardProps {
  isConnected: boolean;
  isVerified: boolean;
  creditScore: number;
}

interface ScoringCardProps {
  isConnected: boolean;
  isVerified: boolean;
  creditScore: number;
}

const BorrowCard: React.FC<BorrowCardProps> = ({
  isConnected,
  isVerified,
  creditScore,
}) => {
  const router = useRouter();
  const { address } = useAccount();
  const [creditorAddress, setCreditorAddress] = useState("");
  const [borrowAmount, setBorrowAmount] = useState<number[]>([5000]); // Default to 5,000 USD worth
  const [mockLoading, setMockLoading] = useState(false);
  const { data: crdVaultTotalSupply } = useReadContract({
    address: deployments.crdVault,
    abi: CRDVaultAbi,
    functionName: "totalSupply",
  });

  // Function to get maximum borrow amount based on credit score
  const getMaxBorrowAmount = (score: number) => {
    if (score < 5) return 500;
    if (score < 6) return 800;
    if (score < 7) return 1500;
    if (score < 7.5) return 2500;
    if (score < 8) return 4000;
    if (score < 9) return 6500;
    return 10000;
  };

  // Function to get required collateral percentage (hardcoded to 20%)
  const getCollateralPercentage = () => {
    return 20; // Hardcoded collateral requirement
  };

  // Function to calculate required collateral amount
  const getRequiredCollateral = (borrowAmount: number) => {
    const percentage = getCollateralPercentage();
    return (borrowAmount * percentage) / 100;
  };

  // Function to calculate monthly payment (3 payments over 90 days)
  const calculateMonthlyPayment = (
    principal: number,
    annualRate: number,
    months: number = 3
  ) => {
    const monthlyRate = annualRate / 100 / 12;
    const payment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  // Function to calculate total payment
  const calculateTotalPayment = (
    principal: number,
    annualRate: number,
    months: number = 3
  ) => {
    const monthlyPayment = calculateMonthlyPayment(
      principal,
      annualRate,
      months
    );
    return monthlyPayment * months;
  };
  console.log("crdVaultTotalSupply", crdVaultTotalSupply);
  const maxBorrowableAmount = Math.min(
    getMaxBorrowAmount(creditScore),
    Number(crdVaultTotalSupply || BigInt(0))
  );

  // Update borrow amount if it exceeds the new maximum
  useEffect(() => {
    if (borrowAmount[0] > maxBorrowableAmount && maxBorrowableAmount > 0) {
      setBorrowAmount([maxBorrowableAmount]);
    }
  }, [maxBorrowableAmount, borrowAmount]);

  const selectedAmount = borrowAmount[0]; // Current selected amount from slider
  const annualRate = getAnnualInterestRate(creditScore);
  const collateralPercentage = getCollateralPercentage();
  const requiredCollateral = getRequiredCollateral(selectedAmount);
  const monthlyPayment = calculateMonthlyPayment(selectedAmount, annualRate);
  const totalPayment = calculateTotalPayment(selectedAmount, annualRate);
  const interestAmount = totalPayment - selectedAmount;

  // Validate creditor address

  // Handle borrow functionality with mock system
  const handleBorrow = async () => {
    if (!address) {
      toast.error("Wallet not connected");
      return;
    }

    if (!creditorAddress || !isAddress(creditorAddress)) {
      toast.error("Please enter a valid creditor address");
      return;
    }

    if (selectedAmount <= 0) {
      toast.error("Please select a borrow amount greater than 0");
      return;
    }

    try {
      // Set loading state
      setMockLoading(true);

      // Show pending status
      toast.info(mockTransactionStatus.pending);

      // Calculate amounts in wei - using selected amount instead of max
      const loanAmountWei = parseEther(selectedAmount.toString());
      const advanceAmountWei = parseEther(requiredCollateral.toString());

      console.log("🚀 Starting mock borrow transaction...");
      console.log("💰 Loan Amount:", selectedAmount, "USD");
      console.log("🔒 Collateral:", requiredCollateral, "ETH");
      console.log("🏦 Creditor:", creditorAddress);

      // Use mock system instead of real blockchain call
      const result = await mockNoteIssuer.createNote(
        loanAmountWei,
        advanceAmountWei,
        creditorAddress,
        address,
        selectedAmount, // Real USD amount from slider
        requiredCollateral, // Real ETH collateral amount
        annualRate // Real interest rate from credit score
      );

      // Show success with transaction details
      toast.success(`🎉 Borrow successful! Note created with ID: #${result.noteId}`);
      console.log("✅ Mock borrow successful!");
      console.log("📄 Note ID:", result.noteId);
      console.log("🔗 Mock TX Hash:", result.txHash);

      // Reset form
      setBorrowAmount([5000]);
      setCreditorAddress("");

    } catch (error) {
      console.error("❌ Error during mock borrow:", error);
      toast.error(mockTransactionStatus.failed);
    } finally {
      setMockLoading(false);
    }
  };

  return (
    <Card className="w-full h-full bg-white rounded-[20px] border border-gray-200">
      <CardHeader className="text-left pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          💰 Borrow CRD
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col justify-between h-full space-y-6 px-6">
        {!isConnected ? (
          // Not Connected State
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Connect Your Wallet
              </h3>
              <p className="text-gray-600">Connect your wallet to borrow CRD</p>
            </div>
            <div className="w-full">
              <ConnectButton.Custom>
                {({ openConnectModal, mounted }) => {
                  if (!mounted) return null;

                  return (
                    <Button
                      onClick={openConnectModal}
                      className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Wallet
                    </Button>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        ) : !isVerified ? (
          // Connected but Not Verified State
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Verification Required
              </h3>
              <p className="text-gray-600">
                Verify your income to access borrowing
              </p>
            </div>
            <Button
              onClick={() => router.push("/profile")}
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              <UserCheck className="w-5 h-5 mr-2" />
              Go to Profile to Verify
            </Button>
          </div>
        ) : (
          // Verified State - Show Borrowing Options
          <div className="space-y-6">
            {/* Available Borrow Amount */}
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600 font-medium text-sm">
                  Available Borrow Amount:
                </span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                ${(selectedAmount / ETH_PRICE_USD).toFixed(4)} CRD ($
                {selectedAmount.toLocaleString()})
              </span>
            </div>

            {/* Required Collateral */}
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-gray-600 font-medium text-sm">
                  Required Collateral ({collateralPercentage}% in ETH):
                </span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                {selectedAmount > 0
                  ? `$${requiredCollateral.toFixed(2)} (${(
                      requiredCollateral / ETH_PRICE_USD
                    ).toFixed(4)} ETH)`
                  : "$0.00 (0.0000 ETH)"}
              </span>
            </div>

            {/* Creditor Address Input */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <UserCheck className="w-4 h-4" />
                <span>Creditor Address</span>
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0x..."
                    value={creditorAddress}
                    onChange={(e) => setCreditorAddress(e.target.value)}
                    className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent pr-10 ${
                      creditorAddress
                        ? isAddress(creditorAddress)
                          ? "border-green-300 focus:ring-green-500 bg-green-50"
                          : "border-red-300 focus:ring-red-500 bg-red-50"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                    maxLength={42}
                  />
                  {creditorAddress && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {isAddress(creditorAddress) ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
                {creditorAddress && !isAddress(creditorAddress) && (
                  <p className="text-xs text-red-600">
                    Invalid address. Must be a valid Ethereum address (0x...).
                  </p>
                )}
                <div className="text-xs text-gray-500 space-y-1">
                  <p>
                    <strong>What is this?</strong> This is the address of the
                    person or entity that will receive your Credit Note.
                  </p>
                  <p>
                    <strong>Example:</strong> If you want to borrow money to buy
                    something from a specific seller, enter their address here
                    and the note will go directly to them.
                  </p>
                  <p>
                    <strong>Important:</strong> Make sure the address is correct
                    - the note will be non-transferable once created.
                  </p>
                </div>
              </div>
            </div>

            {/* Borrow Amount Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calculator className="w-4 h-4" />
                <span>Select Borrow Amount</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>$0</span>
                  <span className="font-semibold text-blue-600">
                    ${borrowAmount[0].toLocaleString()}
                  </span>
                  <span>${maxBorrowableAmount.toLocaleString()}</span>
                </div>
                <Slider
                  value={borrowAmount}
                  onValueChange={setBorrowAmount}
                  min={0}
                  max={maxBorrowableAmount}
                  step={50}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 text-center">
                  Drag the slider to choose how much you want to borrow
                </p>
              </div>
            </div>

            {/* Interest Rate */}
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 font-medium">
                  Annual Interest Rate (paid in ETH):
                </span>
              </div>
              <span className="font-semibold text-gray-900">{annualRate}%</span>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calculator className="w-4 h-4" />
                <span>Cost Breakdown (3 monthly payments)</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Principal:</span>
                  <span className="font-medium">
                    {selectedAmount > 0
                      ? `$${(selectedAmount / ETH_PRICE_USD).toFixed(
                          4
                        )} CRD ($${selectedAmount.toLocaleString()})`
                      : "$0.0000 CRD ($0)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-medium">
                    {selectedAmount > 0
                      ? `$${interestAmount.toFixed(2)} (${(
                          interestAmount / ETH_PRICE_USD
                        ).toFixed(4)} ETH)`
                      : "$0.00 (0.0000 ETH)"}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total to Pay (ETH):</span>
                  <span className="font-bold">
                    {selectedAmount > 0
                      ? `$${totalPayment.toFixed(2)} (${(
                          totalPayment / ETH_PRICE_USD
                        ).toFixed(4)} ETH)`
                      : "$0.00 (0.0000 ETH)"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment (ETH):</span>
                  <span className="font-medium">
                    {selectedAmount > 0
                      ? `$${monthlyPayment.toFixed(2)} (${(
                          monthlyPayment / ETH_PRICE_USD
                        ).toFixed(4)} ETH)`
                      : "$0.00 (0.0000 ETH)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Borrow Button */}
            <div className="pt-4">
              <Button
                className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={
                  !creditorAddress ||
                  !isAddress(creditorAddress) ||
                  selectedAmount <= 0 ||
                  mockLoading
                }
                onClick={handleBorrow}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                {creditorAddress &&
                isAddress(creditorAddress) &&
                selectedAmount > 0
                  ? `Borrow & Send ${(selectedAmount / ETH_PRICE_USD).toFixed(
                      4
                    )} CRD`
                  : selectedAmount <= 0
                  ? "Select Borrow Amount"
                  : "Enter Creditor Address to Borrow"}
              </Button>
            </div>

            {/* Terms */}
            <div className="text-center text-sm text-gray-500 space-y-2 mt-auto">
              <p>• Receive CRD tokens immediately after approval</p>
              <p>
                • Credit Note is sent directly to the specified creditor address
              </p>
              <p>• 3 monthly payments in ETH over 90 days</p>
              <p>
                • Collateral required ({collateralPercentage}% of loan amount in
                ETH)
              </p>
              <p>• Early repayment allowed without penalties</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const ScoringCard: React.FC<ScoringCardProps> = ({
  isConnected,
  isVerified,
  creditScore,
}) => {
  const router = useRouter();

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

  return (
    <Card className="w-full h-full bg-blue-primary text-black rounded-[20px] overflow-hidden">
      <CardHeader className="text-left pb-6">
        <CardTitle className="text-2xl font-bold mb-2">
          📊 Credit Scoring
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col justify-between h-full bg-white text-neutral-black rounded-t-[20px] pt-6 px-6">
        {!isConnected ? (
          // Not Connected State
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Connect Your Wallet
              </h3>
              <p className="text-gray-600">
                Connect your wallet to view your credit score
              </p>
            </div>
            <div className="w-full">
              <ConnectButton.Custom>
                {({ openConnectModal, mounted }) => {
                  if (!mounted) return null;

                  return (
                    <Button
                      onClick={openConnectModal}
                      className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Wallet
                    </Button>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        ) : !isVerified ? (
          // Connected but Not Verified State
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
              <UserCheck className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                Verification Required
              </h3>
              <p className="text-gray-600">
                You need to verify your income with Deel emails to access your
                credit score
              </p>
            </div>
            <Button
              onClick={() => router.push("/profile")}
              className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              <UserCheck className="w-5 h-5 mr-2" />
              Go to Profile to Verify
            </Button>
          </div>
        ) : (
          // Verified State - Show Score
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="space-y-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center">
                <CreditCard className="w-12 h-12 text-gray-600 flex-shrink-0" />
              </div>
              <div className="space-y-2">
                <div
                  className={`text-6xl font-bold ${getScoreColor(creditScore)}`}
                >
                  {creditScore}
                </div>
                <div className="text-lg font-medium text-gray-600">
                  {getScoreDescription(creditScore)} Credit Score
                </div>
              </div>
            </div>

            {/* Annual Interest Rate Section */}
            <div className="w-full max-w-sm mx-auto">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
                  <Percent className="w-4 h-4" />
                  <span>Your Annual Interest Rate</span>
                </div>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(
                      creditScore
                    )}`}
                  >
                    {getAnnualInterestRate(creditScore)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Based on your credit score
                  </div>
                </div>
              </div>
            </div>

            {/* Info Tooltip */}
            <div className="group relative w-full max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 cursor-help">
                <Info className="w-4 h-4 flex-shrink-0" />
                <span>How is my score calculated?</span>
              </div>

              {/* Tooltip Content */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[100] w-80 text-center shadow-lg">
                <div className="space-y-2">
                  <div>Your score is determined by an algorithm based on:</div>
                  <ul className="text-xs space-y-1 text-left">
                    <li>• Verified salaries from Deel</li>
                    <li>• Transaction amounts</li>
                    <li>• Payment consistency</li>
                    <li>• Loan repayment history</li>
                  </ul>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom spacing */}
        <div className="h-6"></div>
      </CardContent>
    </Card>
  );
};

export default function Borrowing() {
  const [mounted, setMounted] = useState(false);
  const [isVerified, setIsVerified] = useState(false); // Mock verification state
  const [creditScore, setCreditScore] = useState(7.2); // Mock credit score

  const { isConnected } = useAccount();

  useEffect(() => {
    setMounted(true);

    // Mock verification check - in real app this would come from backend/API
    // For demo purposes, we'll simulate verification after wallet connection
    if (isConnected) {
      // Simulate API call to check verification status
      setTimeout(() => {
        setIsVerified(true);
        // Generate a random score between 1-10 for demo
        setCreditScore(Math.round((Math.random() * 9 + 1) * 10) / 10);
      }, 1000);
    }
  }, [isConnected]);

  if (!mounted) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="w-full h-[400px] bg-muted rounded-[20px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column - Borrow Card */}
        <div className="w-full h-full">
          <BorrowCard
            isConnected={isConnected}
            isVerified={isVerified}
            creditScore={creditScore}
          />
        </div>

        {/* Right Column - Scoring Card */}
        <div className="w-full h-full">
          <ScoringCard
            isConnected={isConnected}
            isVerified={isVerified}
            creditScore={creditScore}
          />
        </div>
      </div>
    </div>
  );
}
