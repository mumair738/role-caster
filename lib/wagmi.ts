import { http, createConfig } from "wagmi";
import { base, baseSepolia, mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, walletConnect } from "wagmi/connectors";

// If you want to use the Base Sepolia testnet, you can include it here.
// We include mainnet/sepolia for L1 access, which might be useful for bridging logic later.
const chains = [base, baseSepolia, mainnet, sepolia] as const;

export const config = createConfig({
  chains,
  connectors: [
    coinbaseWallet({
      appName: "Role Caster Mini App",
      preference: "eoaOnly",
    }),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "" }),
  ],
  transports: chains.reduce((acc, chain) => {
    acc[chain.id] = http();
    return acc;
  }, {} as Record<number, ReturnType<typeof http>>),
});
