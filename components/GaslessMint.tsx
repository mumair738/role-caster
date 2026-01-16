"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { GaslessConfig, MOCK_GASLESS_CONFIG } from "../lib/types";
import styles from "./features.module.css";

export function GaslessMint() {
  const { isConnected } = useAccount();
  const [config] = useState<GaslessConfig>(MOCK_GASLESS_CONFIG);
  const [isMinting, setIsMinting] = useState(false);
  const [mintResult, setMintResult] = useState<string | null>(null);

  const handleGaslessMint = async () => {
    if (!isConnected) {
      setMintResult("Please connect your wallet first");
      return;
    }

    if (config.remainingFreeTransactions <= 0) {
      setMintResult("No free transactions remaining");
      return;
    }

    setIsMinting(true);
    setMintResult(null);

    // Simulate gasless mint
    setTimeout(() => {
      setIsMinting(false);
      setMintResult("NFT minted successfully with sponsored gas!");
    }, 2000);
  };

  return (
    <div className={styles.featureSection}>
      <h2 className={styles.featureTitle}>
        <span className={styles.featureIcon}>⛽</span>
        Gasless Transactions
      </h2>

      <div className={styles.gaslessContainer}>
        <div className={styles.gaslessStatus}>
          <div className={styles.gaslessIndicator} />
          <span style={{ color: "#10B981", fontWeight: "600" }}>Paymaster Active</span>
        </div>

        <div className={styles.gaslessCount}>
          {config.remainingFreeTransactions} / {config.totalFreeTransactions}
        </div>
        <div className={styles.gaslessLabel}>Free Transactions Remaining</div>

        {/* Progress Bar */}
        <div style={{ 
          width: "100%", 
          maxWidth: "300px", 
          height: "8px", 
          background: "rgba(255,255,255,0.1)", 
          borderRadius: "4px",
          margin: "0 auto 20px",
          overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            width: `${(config.remainingFreeTransactions / config.totalFreeTransactions) * 100}%`,
            background: "linear-gradient(90deg, #10B981, #3B82F6)",
            borderRadius: "4px",
            transition: "width 0.5s"
          }} />
        </div>

        <div className={styles.sponsoredActions}>
          {config.sponsoredActions.map(action => (
            <span key={action} className={styles.sponsoredAction}>
              {action === "mint" && "🎨"} 
              {action === "vote" && "🗳️"} 
              {action === "claimAchievement" && "🏆"} 
              {action}
            </span>
          ))}
        </div>

        <div style={{ marginTop: "24px" }}>
          <button
            onClick={handleGaslessMint}
            disabled={isMinting || !isConnected || config.remainingFreeTransactions <= 0}
            style={{
              background: config.remainingFreeTransactions > 0 
                ? "linear-gradient(135deg, #10B981, #3B82F6)" 
                : "rgba(255,255,255,0.1)",
              border: "none",
              padding: "14px 28px",
              borderRadius: "12px",
              color: "white",
              fontWeight: "600",
              fontSize: "1rem",
              cursor: config.remainingFreeTransactions > 0 ? "pointer" : "not-allowed",
              opacity: isMinting ? 0.7 : 1,
              transition: "all 0.2s"
            }}
          >
            {isMinting ? "Minting..." : "Mint NFT (Gasless)"}
          </button>
        </div>

        {mintResult && (
          <div style={{
            marginTop: "16px",
            padding: "12px 20px",
            background: mintResult.includes("successfully") 
              ? "rgba(16, 185, 129, 0.2)" 
              : "rgba(239, 68, 68, 0.2)",
            borderRadius: "8px",
            color: mintResult.includes("successfully") ? "#10B981" : "#EF4444"
          }}>
            {mintResult}
          </div>
        )}

        {/* Info Section */}
        <div style={{ 
          marginTop: "24px", 
          padding: "16px", 
          background: "rgba(59, 130, 246, 0.1)", 
          borderRadius: "12px",
          textAlign: "left"
        }}>
          <h4 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>💡</span> How Gasless Works
          </h4>
          <ul style={{ 
            fontSize: "0.85rem", 
            color: "rgba(255,255,255,0.7)",
            paddingLeft: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <li>Coinbase Paymaster sponsors gas fees for eligible actions</li>
            <li>Your first {config.totalFreeTransactions} mints are completely free</li>
            <li>Voting and claiming achievements are always gasless</li>
            <li>No ETH required for sponsored transactions</li>
          </ul>
        </div>

        {/* Paymaster Status */}
        <div style={{ 
          marginTop: "16px", 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
          gap: "12px" 
        }}>
          <div style={{ 
            padding: "12px", 
            background: "rgba(0,0,0,0.2)", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#10B981" }}>Active</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Paymaster Status</div>
          </div>
          <div style={{ 
            padding: "12px", 
            background: "rgba(0,0,0,0.2)", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "700" }}>~$0.00</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Your Gas Cost</div>
          </div>
          <div style={{ 
            padding: "12px", 
            background: "rgba(0,0,0,0.2)", 
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.2rem", fontWeight: "700", color: "#3B82F6" }}>Base</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)" }}>Network</div>
          </div>
        </div>
      </div>
    </div>
  );
}
