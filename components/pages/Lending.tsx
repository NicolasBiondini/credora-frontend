"use client";

import { TrendingUp, DollarSign, Info, Wallet } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { useState, useEffect } from "react";
import {
  useAccount,
  useBalance,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { formatEther, parseEther } from "viem";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import deployments from "@/contracts/deployments";
import PoolAbi from "@/contracts/abi/Pool.abi";
import { toast } from "@/lib/utils";

const chartData = [
  { day: "26 Aug", apy: 14.1, volume: 95 },
  { day: "27 Aug", apy: 14.8, volume: 150 },
  { day: "28 Aug", apy: 15.1, volume: 180 },
  { day: "29 Aug", apy: 14.9, volume: 135 },
  { day: "30 Aug", apy: 15.3, volume: 165 },
];

const chartConfig = {
  apy: {
    label: "APY",
    color: "var(--chart-1)",
  },
  volume: {
    label: "Volume",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface DepositCardProps {
  depositAmount: string;
  setDepositAmount: (value: string) => void;
  isConnected: boolean;
  balance:
    | {
        value: bigint;
        decimals: number;
        symbol: string;
        formatted: string;
      }
    | undefined;
}

// Componente separado para evitar re-renders
const ChartCard = () => (
  <Card className="w-full h-full bg-purple-primary text-black rounded-[20px] overflow-hidden">
    <CardHeader className="text-left pb-4 bg-purple-primary ">
      <CardTitle className="text-2xl font-bold mb-2 ">
        🚀 APY Performance
      </CardTitle>

      <div className="flex items-center justify-start gap-6">
        <div className="flex items-center gap-2 font-medium">
          <TrendingUp className="h-4 w-4  flex-shrink-0 text-purple-600" />
          <span className="">
            Current APY: ~
            <span className="text-purple-600 font-semibold">
              {chartData[chartData.length - 1]?.apy}%
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 font-medium group relative">
          <Info className="h-4 w-4 cursor-help flex-shrink-0 text-gray-500" />
          <span className="text-gray-500">APY Breakdown</span>

          {/* Tooltip */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 max-w-xs">
            <div className="text-center space-y-1">
              <div>~10.2% from loan interests</div>
              <div>~5.1% from Symbiotic vault</div>

              {/* Separador */}
              <div className="border-t border-gray-600 my-2"></div>

              <div className="font-semibold">
                TOTAL: ~
                <span className="text-purple-300 font-semibold">
                  {chartData[chartData.length - 1]?.apy}%
                </span>
              </div>
            </div>
            {/* Arrow */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col justify-between h-full bg-white text-neutral-black rounded-t-[20px] pt-6">
      <ChartContainer config={chartConfig} className="h-[200px] w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${value}`}
            interval={0}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => `Aug ${value}`}
                hideLabel={false}
              />
            }
          />
          <Line
            dataKey="apy"
            type="natural"
            stroke="var(--color-apy)"
            strokeWidth={2}
            dot={{
              fill: "var(--color-apy)",
            }}
            activeDot={{
              r: 6,
            }}
          />
        </LineChart>
      </ChartContainer>
    </CardContent>
    <CardFooter className="flex-col items-start gap-3 text-sm bg-white text-neutral-black px-6 pb-6 mt-auto">
      <div className="flex items-center gap-4 w-full">
        <div className="flex gap-2 leading-none font-medium text-purple-primary">
          <TrendingUp className="h-4 w-4" />
          <span>5-Day Performance</span>
        </div>

        <div className="flex gap-2 leading-none font-medium text-green-600">
          <DollarSign className="h-4 w-4" />
          <span>Daily Updates</span>
        </div>
      </div>

      <div className="text-gray-600 leading-relaxed">
        APY performance over the last week
      </div>
    </CardFooter>
  </Card>
);

const DepositCard: React.FC<DepositCardProps> = ({
  depositAmount,
  setDepositAmount,
  isConnected,
  balance,
}) => {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  // Validation for insufficient funds
  const hasInsufficientFunds = () => {
    if (!depositAmount || !isConnected) return false;
    if (!balance) return parseFloat(depositAmount) > 0;
    const depositValue = parseFloat(depositAmount);
    const balanceValue = parseFloat(formatEther(balance.value));
    return depositValue > balanceValue;
  };

  // Handle input change with validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Prevent negative values
    if (value === "" || parseFloat(value) >= 0) {
      setDepositAmount(value);
    }
  };

  const handleDeposit = async () => {
    if (!walletClient || !publicClient) return;
    const txHash = await walletClient.writeContract({
      address: deployments.pool,
      abi: PoolAbi,
      functionName: "deposit",
      args: [],
      value: parseEther(depositAmount),
    });

    if (!txHash) {
      console.error("Failed to deposit, no tx hash");
      toast.error("Failed to deposit");
    }

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
    });

    if (receipt.status === "success") {
      toast.success("Deposit successful");
    } else {
      console.error("Failed to deposit, tx failed", receipt);
      toast.error("Failed to deposit");
    }
  };

  return (
    <Card className="w-full h-full bg-white rounded-[20px] border border-gray-200">
      <CardHeader className="text-left pb-6">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Deposit ETH to Earn Interest
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col justify-between h-full space-y-6 px-6">
        {/* Balance Display */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <Image
              src="/eth-logo.svg"
              alt="ETH Logo"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-gray-600">Your ETH Balance:</span>
          </div>
          <span className="font-semibold text-gray-900">
            {isConnected && balance
              ? parseFloat(formatEther(balance.value)).toFixed(4)
              : "0.0000"}{" "}
            ETH
          </span>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="number"
              placeholder="0.0000"
              value={depositAmount}
              onChange={handleInputChange}
              className="w-full px-4 py-4 text-2xl font-medium border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              disabled={!isConnected}
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <span className="text-gray-500 font-medium">ETH</span>
              <Image
                src="/eth-logo.svg"
                alt="ETH Logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
          </div>

          {/* Max Button */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                if (isConnected && balance) {
                  setDepositAmount(formatEther(balance.value));
                } else {
                  setDepositAmount("0.0000");
                }
              }}
              className={`text-sm font-medium ${
                isConnected && balance
                  ? "text-purple-600 hover:text-purple-800"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              disabled={!isConnected || !balance}
            >
              Max
            </button>
          </div>

          {/* Insufficient Funds Warning */}
          {hasInsufficientFunds() && (
            <div className="text-red-600 text-sm font-medium text-center">
              Insufficient funds available
            </div>
          )}
        </div>

        {/* Deposit Button */}
        <div className="pt-4">
          {isConnected ? (
            <Button
              className="w-full h-14 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
              disabled={
                !depositAmount ||
                parseFloat(depositAmount) <= 0 ||
                hasInsufficientFunds()
              }
              onClick={handleDeposit}
            >
              Deposit ETH
            </Button>
          ) : (
            <div className="w-full">
              <ConnectButton.Custom>
                {({ openConnectModal, mounted }) => {
                  if (!mounted) return null;

                  return (
                    <Button
                      onClick={openConnectModal}
                      className="w-full h-14 text-lg font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                    >
                      <Wallet className="w-5 h-5 mr-2" />
                      Connect Wallet
                    </Button>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center text-sm text-gray-500 space-y-2 mt-auto">
          <p>Minimum deposit: 0.01 ETH</p>
          <p>Funds will be locked for 7 days minimum</p>
        </div>
      </CardContent>
    </Card>
  );
};

// Mock data for deposits
const mockDeposits = [
  {
    id: 1,
    date: "2024-01-15",
    amount: "2.5",
    returns: "0.375", // 15% APY * 2.5 ETH * (time period)
    daysLocked: 45,
  },
  {
    id: 2,
    date: "2024-01-20",
    amount: "1.8",
    returns: "0.27",
    daysLocked: 40,
  },
  {
    id: 3,
    date: "2024-01-25",
    amount: "3.2",
    returns: "0.48",
    daysLocked: 35,
  },
];

// Deposit Item Component
const DepositItem = ({ deposit }: { deposit: (typeof mockDeposits)[0] }) => (
  <Card className="w-full bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/eth-logo.svg"
            alt="ETH Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <div>
            <p className="text-sm text-gray-500">
              Deposited on {new Date(deposit.date).toLocaleDateString()}
            </p>
            <p className="text-lg font-semibold text-gray-900">
              {deposit.amount} ETH
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-green-600">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              +{deposit.returns} ETH earned
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">~15% APY</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="group relative">
            <Info className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              All redeems take ~7 days to unlock funds
            </div>
          </div>
          <Button
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
          >
            Redeem
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Deposits Section Component
const DepositsSection = ({ isConnected }: { isConnected: boolean }) => {
  if (!isConnected) {
    return (
      <div className="w-full max-w-7xl mx-auto mt-8">
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            Connect your wallet to view your deposits
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">My Deposits</h2>
      <div className="space-y-4">
        {mockDeposits.map((deposit) => (
          <DepositItem key={deposit.id} deposit={deposit} />
        ))}
      </div>
    </div>
  );
};

export default function Lending() {
  const [mounted, setMounted] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="w-full h-[400px] bg-muted rounded-[20px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Column - Deposit */}
        <div className="w-full h-full">
          <DepositCard
            depositAmount={depositAmount}
            setDepositAmount={setDepositAmount}
            isConnected={isConnected}
            balance={balance}
          />
        </div>

        {/* Right Column - Chart */}
        <div className="w-full h-full">
          <ChartCard />
        </div>
      </div>

      {/* Deposits Section */}
      <DepositsSection isConnected={isConnected} />
    </div>
  );
}
