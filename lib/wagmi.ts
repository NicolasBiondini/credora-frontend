import { http } from "wagmi";
import { mainnet, flareTestnet, liskSepolia } from "wagmi/chains";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

// Definir la red Filecoin Calibration
export const filecoinCalibration = {
  id: 314159,
  name: "Filecoin Calibration",
  network: "filecoin-calibration",
  nativeCurrency: {
    decimals: 18,
    name: "Filecoin",
    symbol: "FIL",
  },
  rpcUrls: {
    default: { http: ["https://api.calibration.node.glif.io/rpc/v1"] },
    public: { http: ["https://api.calibration.node.glif.io/rpc/v1"] },
  },
  blockExplorers: {
    default: { name: "Filfox", url: "https://calibration.filfox.info" },
  },
  testnet: true,
} as const;

export const config = getDefaultConfig({
  appName: "Credora",
  projectId: "YOUR_PROJECT_ID", // Replace with your WalletConnect project ID
  chains: [mainnet, flareTestnet, liskSepolia, filecoinCalibration],
  transports: {
    [mainnet.id]: http(),
    [flareTestnet.id]: http(),
    [liskSepolia.id]: http(),
    [filecoinCalibration.id]: http(),
  },
});
