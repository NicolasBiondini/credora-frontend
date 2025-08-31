import { http } from "wagmi";
import { sepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "Credora",
  projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});
