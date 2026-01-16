"use client";

import { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { base } from "wagmi/chains";
import { UserRole, RoleConfig, ROLE_CONFIGS, MOCK_NFTS } from "../lib/types";
import styles from "./features.module.css";

// Mock hook to simulate NFT balance
function useMockNFTBalance(): number {
  return MOCK_NFTS.length; // Return mock NFT count
}

function calculateRole(nftBalance: number, ethBalance: number): RoleConfig {
  // Sort configs by requirements (descending) to find highest matching role
  const sortedConfigs = [...ROLE_CONFIGS].sort((a, b) => {
    const aScore = a.minNFTs * 10 + a.minETH;
    const bScore = b.minNFTs * 10 + b.minETH;
    return bScore - aScore;
  });

  for (const config of sortedConfigs) {
    if (nftBalance >= config.minNFTs && ethBalance >= config.minETH) {
      return config;
    }
  }

  return ROLE_CONFIGS[0]; // VISITOR
}

function getNextRole(currentRole: UserRole): RoleConfig | null {
  const currentIndex = ROLE_CONFIGS.findIndex(c => c.role === currentRole);
  if (currentIndex < ROLE_CONFIGS.length - 1) {
    return ROLE_CONFIGS[currentIndex + 1];
  }
  return null;
}

export function RoleGate() {
  const { address, isConnected } = useAccount();
  const { data: ethBalanceData } = useBalance({
    address,
    chainId: base.id,
  });
  
  const nftBalance = useMockNFTBalance();
  const ethBalance = ethBalanceData ? parseFloat(ethBalanceData.formatted) : 0;
  
  const [currentRoleConfig, setCurrentRoleConfig] = useState<RoleConfig>(ROLE_CONFIGS[0]);
  const [nextRoleConfig, setNextRoleConfig] = useState<RoleConfig | null>(null);

  useEffect(() => {
    if (isConnected) {
      const role = calculateRole(nftBalance, ethBalance);
      setCurrentRoleConfig(role);
      setNextRoleConfig(getNextRole(role.role));
    } else {
      setCurrentRoleConfig(ROLE_CONFIGS[0]);
      setNextRoleConfig(ROLE_CONFIGS[1]);
    }
  }, [isConnected, nftBalance, ethBalance]);

  const allFeatures = ["view", "vote", "chat", "earlyAccess", "proposals"];

  return (
    <div className={styles.featureSection}>
      <h2 className={styles.featureTitle}>
        <span className={styles.featureIcon}>🎭</span>
        Your Role Access
      </h2>

      <div className={styles.roleContainer}>
        <div className={styles.roleBadge}>{currentRoleConfig.badge}</div>
        <div 
          className={styles.roleName} 
          style={{ color: currentRoleConfig.color }}
        >
          {currentRoleConfig.role}
        </div>
        
        <div style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.7)", marginTop: "8px" }}>
          {isConnected ? (
            <>You hold {nftBalance} NFT(s) and {ethBalance.toFixed(4)} ETH</>
          ) : (
            <>Connect wallet to check your role</>
          )}
        </div>

        <div className={styles.roleFeatures}>
          {allFeatures.map(feature => (
            <span 
              key={feature}
              className={`${styles.roleFeature} ${currentRoleConfig.features.includes(feature) ? styles.active : ""}`}
            >
              {currentRoleConfig.features.includes(feature) ? "✓" : "✗"} {feature}
            </span>
          ))}
        </div>

        {nextRoleConfig && (
          <div className={styles.roleProgress}>
            <div className={styles.progressText}>
              Next Role: <strong style={{ color: nextRoleConfig.color }}>{nextRoleConfig.role}</strong>
            </div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>
              Requirements: {nextRoleConfig.minNFTs} NFT(s)
              {nextRoleConfig.minETH > 0 && ` + ${nextRoleConfig.minETH} ETH`}
            </div>
            <div style={{ marginTop: "12px" }}>
              <div style={{ 
                height: "8px", 
                background: "rgba(255,255,255,0.1)", 
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${Math.min(100, (nftBalance / nextRoleConfig.minNFTs) * 100)}%`,
                  background: `linear-gradient(90deg, ${currentRoleConfig.color}, ${nextRoleConfig.color})`,
                  borderRadius: "4px",
                  transition: "width 0.5s"
                }} />
              </div>
            </div>
          </div>
        )}

        {!nextRoleConfig && (
          <div className={styles.roleProgress}>
            <div style={{ color: "#F59E0B", fontWeight: "600" }}>
              🎉 You have achieved the highest role!
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: "20px", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "12px" }}>
        <h4 style={{ marginBottom: "12px" }}>Role Benefits</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          {ROLE_CONFIGS.map(config => (
            <div 
              key={config.role}
              style={{ 
                padding: "12px", 
                background: "rgba(255,255,255,0.05)", 
                borderRadius: "8px",
                borderLeft: `3px solid ${config.color}`
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <span>{config.badge}</span>
                <strong style={{ color: config.color }}>{config.role}</strong>
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
                {config.minNFTs > 0 && `${config.minNFTs}+ NFTs`}
                {config.minETH > 0 && ` + ${config.minETH}+ ETH`}
                {config.minNFTs === 0 && config.minETH === 0 && "No requirements"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
