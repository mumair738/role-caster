"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId, useWriteContract } from "wagmi";
import { base } from "wagmi/chains";
import RoleCasterNFT_ABI from "../lib/RoleCasterNFT.json"; // Using the same ABI for placeholder

const GM_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ROLE_CASTER_NFT_ADDRESS || "0x0000000000000000000000000000000000000000"; // Placeholder

type GmActionType = "farcaster" | "base";

interface GmActionRecord {
  count: number;
  points: number;
}

const getDailyGmRecord = (address: string, type: GmActionType): GmActionRecord => {
  const today = new Date().toDateString();
  const key = `dailyGmRecord-${address}-${type}-${today}`;
  const record = localStorage.getItem(key);
  return record ? JSON.parse(record) : { count: 0, points: 0 };
};

const updateDailyGmRecord = (address: string, type: GmActionType, newPoints: number) => {
  const today = new Date().toDateString();
  const key = `dailyGmRecord-${address}-${type}-${today}`;
  const currentRecord = getDailyGmRecord(address, type);
  localStorage.setItem(key, JSON.stringify({ count: currentRecord.count + 1, points: currentRecord.points + newPoints }));
};

export function DailyGmAction() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const isBaseChain = chainId === base.id;

  const [farcasterRecord, setFarcasterRecord] = useState<GmActionRecord>({ count: 0, points: 0 });
  const [baseRecord, setBaseRecord] = useState<GmActionRecord>({ count: 0, points: 0 });
  const [lastEarnedPoints, setLastEarnedPoints] = useState<number | null>(null);

  useEffect(() => {
    if (address) {
      setFarcasterRecord(getDailyGmRecord(address, "farcaster"));
      setBaseRecord(getDailyGmRecord(address, "base"));
    }
  }, [address]);

  const { writeContractAsync } = useWriteContract();

  const handleGmAction = async (type: GmActionType, gmType: number) => {
    if (!isConnected || !address || !isBaseChain) {
      alert("Please connect to Base Chain to perform this action.");
      return;
    }

    const currentRecord = (type === "farcaster" ? farcasterRecord : baseRecord);
    if (currentRecord.count >= 2) {
      alert(`You have reached the daily limit for ${type} GM actions.`);
      return;
    }

    try {
      // Simulate contract interaction
      // In a real scenario, you would call your GM contract function here.
      // A contract function might return points or emit an event with them.
      await writeContractAsync({
        address: GM_CONTRACT_ADDRESS as `0x${string}`,
        abi: RoleCasterNFT_ABI, // Using the placeholder ABI
        functionName: "sendGm",
        args: [gmType],
      });

      // Simulate random point generation (1-100 points)
      const earnedPoints = Math.floor(Math.random() * 100) + 1;

      alert(`Successfully sent GM for ${type}! You earned ${earnedPoints} points.`);
      updateDailyGmRecord(address, type, earnedPoints);
      setLastEarnedPoints(earnedPoints);

      if (type === "farcaster") {
        setFarcasterRecord((prev) => ({ count: prev.count + 1, points: prev.points + earnedPoints }));
      } else {
        setBaseRecord((prev) => ({ count: prev.count + 1, points: prev.points + earnedPoints }));
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
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleGmAction("farcaster", 0)}
              disabled={farcasterRecord.count >= 2}
              style={{
                padding: "10px 15px",
                backgroundColor: farcasterRecord.count >= 2 ? "#d3d3d3" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: farcasterRecord.count >= 2 ? "not-allowed" : "pointer",
              }}
            >
              gm farcaster ({farcasterRecord.count}/2)
            </button>
            <button
              onClick={() => handleGmAction("base", 1)}
              disabled={baseRecord.count >= 2}
              style={{
                padding: "10px 15px",
                backgroundColor: baseRecord.count >= 2 ? "#d3d3d3" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: baseRecord.count >= 2 ? "not-allowed" : "pointer",
              }}
            >
              gm base ({baseRecord.count}/2)
            </button>
          </div>
          <div style={{ marginTop: "10px" }}>
            <p>Total farcaster GM points today: {farcasterRecord.points}</p>
            <p>Total base GM points today: {baseRecord.points}</p>
            {lastEarnedPoints !== null && (
              <p style={{ color: "green", fontWeight: "bold" }}>You just earned {lastEarnedPoints} points!</p>
            )}
          </div>
        </div>
      )}
      <p style={{ marginTop: "10px", fontSize: "0.8em", color: "#666" }}>
        Note: Daily counts and points reset every day. Contract address: {GM_CONTRACT_ADDRESS}
      </p>
    </div>
  );
}