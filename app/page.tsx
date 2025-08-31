"use client";
import Providers from "@/components/ui/Providers";
import ConnectWallet from "@/components/ConnectWallet";
import TabsContainer from "@/components/TabsContainer";

export default function Home() {
  return (
    <Providers>
      <div className="font-sans flex flex-col items-center justify-items-start min-h-screen gap-16">
        <main className="max-w-[1024px] w-full flex flex-col gap-[32px] items-center sm:items-start">
          <ConnectWallet />

          <TabsContainer />
        </main>
        <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
          Hackathon Aleph 2025
        </footer>
      </div>
    </Providers>
  );
}
