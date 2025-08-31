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
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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

  const maxAmount = getMaxBorrowAmount(creditScore);
  const annualRate = getAnnualInterestRate(creditScore);
  const collateralPercentage = getCollateralPercentage();
  const requiredCollateral = getRequiredCollateral(maxAmount);
  const monthlyPayment = calculateMonthlyPayment(maxAmount, annualRate);
  const totalPayment = calculateTotalPayment(maxAmount, annualRate);
  const interestAmount = totalPayment - maxAmount;

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
            {/* Maximum Borrow Amount */}
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600 font-medium text-sm">
                  Maximum Borrow Amount:
                </span>
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                ${(maxAmount / ETH_PRICE_USD).toFixed(4)} CRD ($
                {maxAmount.toLocaleString()})
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
                ${requiredCollateral.toFixed(2)} (
                {(requiredCollateral / ETH_PRICE_USD).toFixed(4)} ETH)
              </span>
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
                    ${(maxAmount / ETH_PRICE_USD).toFixed(4)} CRD ($
                    {maxAmount.toLocaleString()})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest:</span>
                  <span className="font-medium">
                    ${interestAmount.toFixed(2)} (
                    {(interestAmount / ETH_PRICE_USD).toFixed(4)} ETH)
                  </span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-medium">Total to Pay (ETH):</span>
                  <span className="font-bold">
                    ${totalPayment.toFixed(2)} (
                    {(totalPayment / ETH_PRICE_USD).toFixed(4)} ETH)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment (ETH):</span>
                  <span className="font-medium">
                    ${monthlyPayment.toFixed(2)} (
                    {(monthlyPayment / ETH_PRICE_USD).toFixed(4)} ETH)
                  </span>
                </div>
              </div>
            </div>

            {/* Borrow Button */}
            <div className="pt-4">
              <Button
                className="w-full h-14 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                onClick={() => {
                  // TODO: Implement borrow functionality
                  alert(
                    `Borrowing ${(maxAmount / ETH_PRICE_USD).toFixed(
                      4
                    )} CRD at ${annualRate}% APR`
                  );
                }}
              >
                <DollarSign className="w-5 h-5 mr-2" />
                Borrow ${(maxAmount / ETH_PRICE_USD).toFixed(4)} CRD
              </Button>
            </div>

            {/* Terms */}
            <div className="text-center text-sm text-gray-500 space-y-2 mt-auto">
              <p>• Receive CRD tokens immediately after approval</p>
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
