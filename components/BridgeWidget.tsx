"use client";

import { useState } from "react";
import { BridgeBalance, BridgeTransaction, MOCK_BRIDGE_BALANCES } from "../lib/types";
import styles from "./features.module.css";

export function BridgeWidget() {
  const [balances] = useState<BridgeBalance>(MOCK_BRIDGE_BALANCES);
  const [amount, setAmount] = useState<string>("");
  const [direction, setDirection] = useState<"toBase" | "toEthereum">("toBase");
  const [isLoading, setIsLoading] = useState(false);
  const [recentTx, setRecentTx] = useState<BridgeTransaction | null>(null);

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsLoading(true);
    
    // Simulate bridge transaction
    setTimeout(() => {
      const mockTx: BridgeTransaction = {
        id: `bridge-${Date.now()}`,
        amount: amount,
        token: "ETH",
        fromChain: direction === "toBase" ? "Ethereum" : "Base",
        toChain: direction === "toBase" ? "Base" : "Ethereum",
        status: "pending",
        timestamp: Date.now(),
        txHash: `0x${Math.random().toString(16).slice(2, 66)}`,
      };
      setRecentTx(mockTx);
      setIsLoading(false);
      setAmount("");
      
      // Simulate confirmation
      setTimeout(() => {
        setRecentTx(prev => prev ? { ...prev, status: "completed" } : null);
      }, 3000);
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "#F59E0B";
      case "confirmed": return "#3B82F6";
      case "completed": return "#10B981";
      case "failed": return "#EF4444";
      default: return "#6B7280";
    }
  };

  return (
    <div className={styles.featureSection}>
      <h2 className={styles.featureTitle}>
        <span className={styles.featureIcon}>🌉</span>
        Base Bridge
      </h2>

      <div className={styles.bridgeContainer}>
        {/* Balance Display */}
        <div className={styles.bridgeBalances}>
          <div className={styles.chainBalance}>
            <div className={styles.chainName}>Ethereum Mainnet</div>
            <div className={styles.chainAmount}>{balances.ethereum} ETH</div>
          </div>
          
          <div 
            className={styles.bridgeArrow}
            style={{ cursor: "pointer" }}
            onClick={() => setDirection(d => d === "toBase" ? "toEthereum" : "toBase")}
          >
            {direction === "toBase" ? "→" : "←"}
          </div>
          
          <div className={styles.chainBalance}>
            <div className={styles.chainName}>Base</div>
            <div className={styles.chainAmount}>{balances.base} ETH</div>
          </div>
        </div>

        {/* Direction Tabs */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${direction === "toBase" ? styles.active : ""}`}
            onClick={() => setDirection("toBase")}
          >
            Bridge to Base
          </button>
          <button
            className={`${styles.tab} ${direction === "toEthereum" ? styles.active : ""}`}
            onClick={() => setDirection("toEthereum")}
          >
            Bridge to Ethereum
          </button>
        </div>

        {/* Bridge Input */}
        <div className={styles.bridgeInput}>
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="0"
            step="0.01"
          />
          <button
            className={styles.bridgeButton}
            onClick={handleBridge}
            disabled={isLoading || !amount || parseFloat(amount) <= 0}
          >
            {isLoading ? "Bridging..." : `Bridge to ${direction === "toBase" ? "Base" : "Ethereum"}`}
          </button>
        </div>

        {/* Fee Estimate */}
        <div style={{ 
          padding: "12px", 
          background: "rgba(255,255,255,0.05)", 
          borderRadius: "8px",
          fontSize: "0.85rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>Estimated Gas Fee</span>
            <span>~0.001 ETH</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(255,255,255,0.6)" }}>Estimated Time</span>
            <span>{direction === "toBase" ? "~10 minutes" : "~7 days"}</span>
          </div>
        </div>

        {/* Recent Transaction */}
        {recentTx && (
          <div style={{ 
            padding: "16px", 
            background: "rgba(0,0,0,0.3)", 
            borderRadius: "12px",
            border: `1px solid ${getStatusColor(recentTx.status)}`
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontWeight: "600" }}>Recent Bridge Transaction</span>
              <span style={{ 
                padding: "4px 8px", 
                borderRadius: "4px", 
                background: getStatusColor(recentTx.status),
                fontSize: "0.75rem",
                fontWeight: "600"
              }}>
                {recentTx.status.toUpperCase()}
              </span>
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
              <div>Amount: {recentTx.amount} {recentTx.token}</div>
              <div>{recentTx.fromChain} → {recentTx.toChain}</div>
              <div style={{ marginTop: "8px" }}>
                <a 
                  href={`https://basescan.org/tx/${recentTx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#3B82F6" }}
                >
                  View on Explorer →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
          <a 
            href="https://bridge.base.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              flex: 1, 
              padding: "12px", 
              background: "rgba(59, 130, 246, 0.2)", 
              borderRadius: "8px",
              textAlign: "center",
              color: "#3B82F6",
              textDecoration: "none",
              fontSize: "0.9rem"
            }}
          >
            Official Base Bridge
          </a>
          <a 
            href="https://superbridge.app/base"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              flex: 1, 
              padding: "12px", 
              background: "rgba(139, 92, 246, 0.2)", 
              borderRadius: "8px",
              textAlign: "center",
              color: "#8B5CF6",
              textDecoration: "none",
              fontSize: "0.9rem"
            }}
          >
            Superbridge
          </a>
        </div>
      </div>
    </div>
  );
}
