"use client";

import { useState, useEffect } from "react";
import { useBalance } from "wagmi";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { base } from "wagmi/chains";
// Removed import { parseAbi } from "viem";
import RoleCasterNFT_ABI from "../lib/RoleCasterNFT.json";

const ROLE_CASTER_NFT_ADDRESS = process.env.NEXT_PUBLIC_ROLE_CASTER_NFT_ADDRESS as `0x${string}`;

export function MintRoleNFT() {
  const { address, isConnected, chain } = useAccount();
  // Token holding check: ETH balance
  const { data: ethBalance, isLoading: isBalanceLoading } = useBalance({
    address,
    chainId: base.id,
    token: undefined, // ETH
  });
  // Example: minimum ETH required (0.01 ETH)
  const MIN_ETH = 0.01;
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
    // Token holding check
    if (!isBalanceLoading && ethBalance && Number(ethBalance.formatted) < MIN_ETH) {
      setMintStatus(`Insufficient ETH balance. Minimum required: ${MIN_ETH} ETH.`);
      return;
    }
    try {
      setMintStatus("Minting in progress...");
      writeContract({
        address: ROLE_CASTER_NFT_ADDRESS,
        abi: RoleCasterNFT_ABI,
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
          {isBalanceLoading ? (
            <p>Checking ETH balance...</p>
          ) : ethBalance ? (
            <p>Your ETH balance: {ethBalance.formatted} {ethBalance.symbol}</p>
          ) : null}
          <button
            onClick={handleMint}
            disabled={
              isPending || isConfirming || isBalanceLoading || (ethBalance && Number(ethBalance.formatted) < MIN_ETH)
            }
          >
            {isPending
              ? "Confirming..."
              : isConfirming
              ? "Minting..."
              : ethBalance && Number(ethBalance.formatted) < MIN_ETH
              ? `Insufficient ETH (min ${MIN_ETH})`
              : "Mint Role NFT"}
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
