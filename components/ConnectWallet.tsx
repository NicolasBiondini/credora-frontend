"use client";

import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function ConnectWallet() {
  return (
    <div className="flex w-full items-center justify-between gap-4 px-6 h-24">
      <p className="text-2xl font-bold">Credora</p>
      <ConnectButton />
    </div>
  );
}

export default ConnectWallet;
