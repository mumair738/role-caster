"use client";

import { useState, useEffect } from "react";
import { useBalance, useAccount, useSwitchChain, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { base } from "wagmi/chains";
import RoleCasterNFT_ABI from "../lib/RoleCasterNFT.json";

const ROLE_CASTER_NFT_ADDRESS = process.env.NEXT_PUBLIC_ROLE_CASTER_NFT_ADDRESS as `0x${string}`;
const MIN_ETH_FOR_MINT = 0.01; // Feature 6 dependency: Simple check

export function MintRoleNFT() {
  const { address, isConnected, chain } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      setConnectionStatus(`Connected: ${address.substring(0, 6)}...${address.substring(address.length - 4)}`);
    } else {
      setConnectionStatus("Wallet Disconnected");
    }
  }, [isConnected, address]);

  // --- Feature 9: Network Switch Enforcement Logic ---
  const [isNetworkCorrect, setIsNetworkCorrect] = useState(false);
  const [switchAttempted, setSwitchAttempted] = useState(false);

  // Check network on mount and whenever chain changes
  useEffect(() => {
    if (isConnected && chain && chain.id !== base.id) {
      setIsNetworkCorrect(false);
    } else if (isConnected && chain && chain.id === base.id) {
      setIsNetworkCorrect(true);
    }
  }, [isConnected, chain]);

  const handleSwitchNetwork = async () => {
    if (!isConnected || !chain || chain.id === base.id) return;

    setSwitchAttempted(true);
    setMintStatus("Switching network to Base...");
    try {
      await switchChainAsync({ chainId: base.id });
      setIsNetworkCorrect(true);
      setMintStatus("Network switched to Base. You can now mint.");
    } catch (switchError) {
      console.error("Failed to switch network:", switchError);
      setMintStatus("Failed to switch network. Please switch manually.");
    }
  };
  // --------------------------------------------------

  // --- Feature 6: Cross-Chain/Role Gating (Token Holding Check) ---
  // We check for minimum ETH balance on Base L1 (mainnet equivalent chain ID for ETH balance check)
  const { data: ethBalance, isLoading: isBalanceLoading } = useBalance({
    address,
    chainId: base.id, // Check balance on Base L2
    token: undefined, // ETH
  });
  // -----------------------------------------

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: confirmError } = useWaitForTransactionReceipt({ hash });
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
    if (!isConnected || !address) {
      setMintStatus("Please connect your wallet.");
      return;
    }
    if (!isNetworkCorrect) {
        setMintStatus("Please switch to the Base network.");
        return;
    }
    // Token holding check (Feature 6)
    if (!isBalanceLoading && ethBalance && Number(ethBalance.formatted) < MIN_ETH_FOR_MINT) {
      setMintStatus(`Insufficient ETH balance. Minimum required: ${MIN_ETH_FOR_MINT} ETH.`);
      return;
    }
    try {
      setMintStatus("Minting in progress (optimistic feedback pending)...");
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

  const isMintButtonDisabled = isPending || isConfirming || isBalanceLoading || !isNetworkCorrect || (ethBalance && Number(ethBalance.formatted) < MIN_ETH_FOR_MINT);
  const networkWarning = isConnected && !isNetworkCorrect && !switchAttempted;

  return (
    <div>
      <h2>Cast Your Role NFT on Base</h2>
      {connectionStatus && <p style={{ fontWeight: 'bold' }}>{connectionStatus}</p>}
      {!isConnected ? (
        <p>Please connect your wallet.</p>
      ) : networkWarning ? (
        <>
          <p>You are currently on the wrong network. Please switch to **Base Mainnet** to mint your Role NFT.</p>
          <button onClick={handleSwitchNetwork} disabled={isPending || isConfirming}>
            Switch to Base
          </button>
        </>
      ) : isNetworkCorrect ? (
        <>
          <p>Connected to Base as: {address}</p>
          {isBalanceLoading ? (
            <p>Checking ETH balance...</p>
          ) : ethBalance ? (
            <p>Your Base ETH balance: {ethBalance.formatted} {ethBalance.symbol}</p>
          ) : null}
          <button
            onClick={handleMint}
            disabled={isMintButtonDisabled}
          >
            {isPending
              ? "Confirming..."
              : isConfirming
              ? "Minting..."
              : ethBalance && Number(ethBalance.formatted) < MIN_ETH_FOR_MINT
              ? `Insufficient ETH (min ${MIN_ETH_FOR_MINT})`
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
        <p>Wallet connected, but network is neither Base nor Base Sepolia. Please switch.</p>
      )}
    </div>
  );
}
