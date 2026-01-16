"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { BasenameData } from "../lib/types";
import styles from "./features.module.css";

// Mock function to simulate basename lookup
function useMockBasename(address: string | undefined): BasenameData | null {
  const [data, setData] = useState<BasenameData | null>(null);

  useEffect(() => {
    if (!address) {
      setData(null);
      return;
    }

    // Simulate API call with mock data
    const mockNames: Record<string, BasenameData> = {
      "0x1234": {
        name: "cryptoking.base",
        avatar: "🦁",
        address: address,
        isRegistered: true,
      },
    };

    // 30% chance of having a basename for demo
    const hasBasename = Math.random() > 0.7;
    
    setTimeout(() => {
      if (hasBasename) {
        setData({
          name: "user.base",
          avatar: "🎭",
          address: address,
          isRegistered: true,
        });
      } else {
        setData({
          name: null,
          avatar: null,
          address: address,
          isRegistered: false,
        });
      }
    }, 500);
  }, [address]);

  return data;
}

export function BasenameDisplay() {
  const { address, isConnected } = useAccount();
  const basenameData = useMockBasename(address);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className={styles.featureSection}>
        <h2 className={styles.featureTitle}>
          <span className={styles.featureIcon}>🏷️</span>
          Basenames
        </h2>
        <div className={styles.basenameContainer}>
          <div className={styles.basenameAvatar}>?</div>
          <div className={styles.basenameInfo}>
            <div className={styles.baseAddress}>Connect wallet to view your Basename</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.featureSection}>
      <h2 className={styles.featureTitle}>
        <span className={styles.featureIcon}>🏷️</span>
        Basenames
      </h2>
      
      <div className={styles.basenameContainer}>
        <div className={styles.basenameAvatar}>
          {basenameData?.avatar || "👤"}
        </div>
        <div className={styles.basenameInfo}>
          {basenameData?.isRegistered ? (
            <>
              <div className={styles.baseName}>{basenameData.name}</div>
              <div className={styles.baseAddress}>{formatAddress(address || "")}</div>
            </>
          ) : (
            <>
              <div className={styles.baseAddress}>{formatAddress(address || "")}</div>
              <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
                No Basename registered
              </div>
            </>
          )}
        </div>
        {!basenameData?.isRegistered && (
          <a 
            href="https://www.base.org/names" 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.registerButton}
          >
            Register .base Name
          </a>
        )}
      </div>

      <div style={{ marginTop: "16px", padding: "12px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "8px", fontSize: "0.85rem" }}>
        <strong>What are Basenames?</strong>
        <p style={{ marginTop: "8px", color: "rgba(255,255,255,0.7)" }}>
          Basenames are human-readable names for your Base addresses. Instead of sharing 0x1234...5678, 
          share your unique .base name for easier transactions and identity.
        </p>
      </div>
    </div>
  );
}
