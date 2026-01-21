"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import RoleCasterNFT_ABI from "../lib/RoleCasterNFT.json"; // Using the same ABI for placeholder

const GM_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GM_CONTRACT_ADDRESS || "0xYourGmContractAddressHere"; // Placeholder

type GmActionType = "farcaster" | "base";

const getDailyGmCount = (address: string, type: GmActionType): number => {
  const today = new Date().toDateString();
  const key = `dailyGmCount-${address}-${type}-${today}`;
  const count = localStorage.getItem(key);
  return count ? parseInt(count, 10) : 0;
};

const incrementDailyGmCount = (address: string, type: GmActionType) => {
  const today = new Date().toDateString();
  const key = `dailyGmCount-${address}-${type}-${today}`;
  const currentCount = getDailyGmCount(address, type);
  localStorage.setItem(key, (currentCount + 1).toString());
};

export function DailyGmAction() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isBaseChain = chainId === base.id;

  const [farcasterCount, setFarcasterCount] = useState(0);
  const [baseCount, setBaseCount] = useState(0);

  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (address) {
      setFarcasterCount(getDailyGmCount(address, "farcaster"));
      setBaseCount(getDailyGmCount(address, "base"));
    }
  }, [address]);

  const handleGmAction = async (type: GmActionType, gmType: number) => {
    if (!isConnected || !address || !isBaseChain) {
      alert("Please connect to Base Chain to perform this action.");
      return;
    }

    const currentCount = (type === "farcaster" ? farcasterCount : baseCount);
    if (currentCount >= 2) {
      alert(`You have reached the daily limit for ${type} GM actions.`);
      return;
    }

    try {
      // Simulate contract interaction
      // In a real scenario, you would call your GM contract function here.
      await writeContractAsync({
        address: GM_CONTRACT_ADDRESS as `0x${string}`,
        abi: RoleCasterNFT_ABI, // Using the placeholder ABI
        functionName: "sendGm",
        args: [gmType],
      });

      alert(`Successfully sent GM for ${type}!`);
      incrementDailyGmCount(address, type);
      if (type === "farcaster") {
        setFarcasterCount((prev) => prev + 1);
      } else {
        setBaseCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error sending GM:", error);
      alert("Failed to send GM. See console for details.");
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", margin: "20px 0" }}>
      <h3>Daily GM Actions (Base Chain Only)</h3>
      {!isConnected && <p>Please connect your wallet.</p>}
      {isConnected && !isBaseChain && <p>Please switch to Base Chain.</p>}
      {isConnected && isBaseChain && (
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => handleGmAction("farcaster", 0)}
            disabled={farcasterCount >= 2}
            style={{
              padding: "10px 15px",
              backgroundColor: farcasterCount >= 2 ? "#d3d3d3" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: farcasterCount >= 2 ? "not-allowed" : "pointer",
            }}
          >
            gm farcaster ({farcasterCount}/2)
          </button>
          <button
            onClick={() => handleGmAction("base", 1)}
            disabled={baseCount >= 2}
            style={{
              padding: "10px 15px",
              backgroundColor: baseCount >= 2 ? "#d3d3d3" : "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: baseCount >= 2 ? "not-allowed" : "pointer",
            }}
          >
            gm base ({baseCount}/2)
          </button>
        </div>
      )}
      <p style={{ marginTop: "10px", fontSize: "0.8em", color: "#666" }}>
        Note: Daily counts reset every day. Contract address: {GM_CONTRACT_ADDRESS}
      </p>
    </div>
  );
}