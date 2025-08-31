"use client";

import { TrendingUp, DollarSign, PiggyBank } from "lucide-react";
import { useState, useEffect } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartData = [
  { date: "Dec 15", apy: 13.2 },
  { date: "Dec 16", apy: 13.8 },
  { date: "Dec 17", apy: 14.1 },
  { date: "Dec 18", apy: 14.7 },
  { date: "Dec 19", apy: 15.3 },
];

export default function Profile() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="w-full h-[400px] bg-muted rounded-[20px] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="w-full bg-orange-primary text-black rounded-[20px] overflow-hidden">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <PiggyBank className="h-8 w-8" />
            <CardTitle className="text-2xl font-bold">Profile</CardTitle>
            <DollarSign className="h-8 w-8" />
          </div>
          <CardDescription className="text-lg text-black">
            Manage your account and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white text-neutral-black rounded-t-[20px] pt-6">
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {chartData[chartData.length - 1]?.apy}%
              </div>
              <div className="text-gray-600">Your Profile Stats</div>
              <div className="mt-4 text-sm text-gray-500">
                Chart placeholder - Profile performance over time
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm bg-white text-neutral-black px-6 pb-6">
          <div className="flex gap-2 leading-none font-medium text-orange-primary">
            <TrendingUp className="h-4 w-4" />
            Current APY: {chartData[chartData.length - 1]?.apy}%
          </div>
          <div className="text-gray-600 leading-none">
            APY performance over the last 2 weeks
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
