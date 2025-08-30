import { http } from "wagmi";
import { mainnet, flareTestnet, liskSepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

export const config = getDefaultConfig({
  appName: "Credora",
  projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
  chains: [mainnet, flareTestnet, liskSepolia],
  transports: {
    [mainnet.id]: http(),
    [flareTestnet.id]: http(),
    [liskSepolia.id]: http(),
  },
});
