"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { base } from "wagmi/chains";
// Removed import { parseAbi } from "viem";
import RoleCasterNFT_ABI from "../lib/RoleCasterNFT.json";

const ROLE_CASTER_NFT_ADDRESS = process.env.NEXT_PUBLIC_ROLE_CASTER_NFT_ADDRESS as `0x${string}`;

export function MintRoleNFT() {
  const { address, isConnected, chain } = useAccount();
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({
    hash,
  });

  const [mintStatus, setMintStatus] = useState<string | null>(null);

  useEffect(() => {
    if (hash) {
      setMintStatus(`Transaction sent: ${hash}. Waiting for confirmation...`);
    }
    if (isConfirmed) {
      setMintStatus("Mint successful!");
    }
    if (writeError) {
      setMintStatus(`Mint failed: ${writeError.message}`);
    }
    if (confirmError) {
      setMintStatus(`Confirmation failed: ${confirmError.message}`);
    }
  }, [hash, isConfirmed, writeError, confirmError]);

  const handleMint = async () => {
    if (!isConnected || !address || chain?.id !== base.id) {
      setMintStatus("Please connect your wallet to Base network.");
      return;
    }

    try {
      setMintStatus("Minting in progress...");
      // For simplicity, assuming the 'mint' function takes no arguments
      writeContract({
        address: ROLE_CASTER_NFT_ADDRESS,
        abi: RoleCasterNFT_ABI, // Corrected: Directly use the imported ABI
        functionName: "mint",
      });
    } catch (error) {
      console.error("Minting error:", error);
      setMintStatus(`Minting failed: ${(error as Error).message}`);
    }
  };

  return (
    <div>
      <h2>Mint Your Role NFT on Base</h2>
      {isConnected && chain?.id === base.id ? (
        <>
          <p>Connected to Base as: {address}</p>
          <button onClick={handleMint} disabled={isPending || isConfirming}>
            {isPending ? "Confirming..." : isConfirming ? "Minting..." : "Mint Role NFT"}
          </button>
          {mintStatus && <p>{mintStatus}</p>}
          {hash && (
            <p>
              Transaction Hash:{" "}
              <a href={`https://basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer">
                {hash}
              </a>
            </p>
          )}
        </>
      ) : (
        <p>Please connect your wallet to the Base network to mint.</p>
      )}
    </div>
  );
}
