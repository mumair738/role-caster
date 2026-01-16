"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ReferralStats, MOCK_REFERRAL_STATS } from "../lib/types";
import styles from "./features.module.css";

export function ReferralDashboard() {
  const { isConnected, address } = useAccount();
  const [stats] = useState<ReferralStats>(MOCK_REFERRAL_STATS);
  const [copied, setCopied] = useState(false);
  const [claiming, setClaiming] = useState(false);

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(stats.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimRewards = async () => {
    setClaiming(true);
    // Simulate claim
    setTimeout(() => {
      setClaiming(false);
      alert("Rewards claimed successfully!");
    }, 2000);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Bronze": return "#CD7F32";
      case "Silver": return "#C0C0C0";
      case "Gold": return "#FFD700";
      case "Platinum": return "#E5E4E2";
      default: return "#6B7280";
    }
  };

  const getNextTier = () => {
    const tiers = ["Bronze", "Silver", "Gold", "Platinum"];
    const currentIndex = tiers.indexOf(stats.tier);
    if (currentIndex < tiers.length - 1) {
      return tiers[currentIndex + 1];
    }
    return null;
  };

  const getTierRequirements = (tier: string) => {
    switch (tier) {
      case "Bronze": return 1;
      case "Silver": return 6;
      case "Gold": return 21;
      case "Platinum": return 51;
      default: return 0;
    }
  };

  const nextTier = getNextTier();
  const nextTierReq = nextTier ? getTierRequirements(nextTier) : 0;
  const progress = nextTier ? (stats.totalReferrals / nextTierReq) * 100 : 100;

  return (
    <div className={styles.featureSection}>
      <h2 className={styles.featureTitle}>
        <span className={styles.featureIcon}>👥</span>
        Referral Program
      </h2>

      <div className={styles.referralContainer}>
        {/* Stats Cards */}
        <div className={styles.referralStats}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{stats.totalReferrals}</div>
            <div className={styles.statLabel}>Total Referrals</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: "#10B981" }}>{stats.pendingRewards} ETH</div>
            <div className={styles.statLabel}>Pending Rewards</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: "#3B82F6" }}>{stats.claimedRewards} ETH</div>
            <div className={styles.statLabel}>Claimed Rewards</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue} style={{ color: getTierColor(stats.tier) }}>{stats.tier}</div>
            <div className={styles.statLabel}>Current Tier</div>
          </div>
        </div>

        {/* Referral Link */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ fontSize: "0.9rem", marginBottom: "8px", color: "rgba(255,255,255,0.7)" }}>
            Your Referral Link
          </div>
          <div className={styles.referralLink}>
            <input
              type="text"
              value={stats.referralLink}
              readOnly
            />
            <button className={styles.copyButton} onClick={handleCopyLink}>
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div style={{ fontSize: "0.8rem", marginTop: "8px", color: "rgba(255,255,255,0.5)" }}>
            Code: <strong>{stats.referralCode}</strong>
          </div>
        </div>

        {/* Tier Progress */}
        {nextTier && (
          <div style={{ 
            marginTop: "20px", 
            padding: "16px", 
            background: "rgba(0,0,0,0.2)", 
            borderRadius: "12px" 
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span>Progress to <strong style={{ color: getTierColor(nextTier) }}>{nextTier}</strong></span>
              <span>{stats.totalReferrals} / {nextTierReq}</span>
            </div>
            <div style={{ 
              height: "8px", 
              background: "rgba(255,255,255,0.1)", 
              borderRadius: "4px",
              overflow: "hidden"
            }}>
              <div style={{
                height: "100%",
                width: `${Math.min(100, progress)}%`,
                background: `linear-gradient(90deg, ${getTierColor(stats.tier)}, ${getTierColor(nextTier)})`,
                borderRadius: "4px",
                transition: "width 0.5s"
              }} />
            </div>
          </div>
        )}

        {/* Claim Button */}
        {parseFloat(stats.pendingRewards) > 0 && (
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={handleClaimRewards}
              disabled={claiming || !isConnected}
              style={{
                background: "linear-gradient(135deg, #10B981, #3B82F6)",
                border: "none",
                padding: "14px 32px",
                borderRadius: "12px",
                color: "white",
                fontWeight: "600",
                fontSize: "1rem",
                cursor: claiming ? "not-allowed" : "pointer",
                opacity: claiming ? 0.7 : 1
              }}
            >
              {claiming ? "Claiming..." : `Claim ${stats.pendingRewards} ETH`}
            </button>
          </div>
        )}

        {/* Reward Tiers */}
        <div style={{ marginTop: "24px" }}>
          <h4 style={{ marginBottom: "12px" }}>Reward Tiers</h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" }}>
            {["Bronze", "Silver", "Gold", "Platinum"].map(tier => (
              <div 
                key={tier}
                style={{ 
                  padding: "12px", 
                  background: stats.tier === tier 
                    ? `linear-gradient(135deg, ${getTierColor(tier)}33, ${getTierColor(tier)}11)`
                    : "rgba(0,0,0,0.2)", 
                  borderRadius: "8px",
                  border: stats.tier === tier ? `1px solid ${getTierColor(tier)}` : "1px solid transparent",
                  textAlign: "center"
                }}
              >
                <div style={{ color: getTierColor(tier), fontWeight: "600", marginBottom: "4px" }}>
                  {tier}
                </div>
                <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
                  {getTierRequirements(tier)}+ referrals
                </div>
                <div style={{ fontSize: "0.75rem", marginTop: "4px" }}>
                  {tier === "Bronze" && "0.001 ETH/ref"}
                  {tier === "Silver" && "0.002 ETH/ref"}
                  {tier === "Gold" && "0.003 ETH/ref"}
                  {tier === "Platinum" && "0.005 ETH/ref"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Referrals */}
        <div style={{ marginTop: "24px" }}>
          <h4 style={{ marginBottom: "12px" }}>Recent Referrals</h4>
          {stats.referrals.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {stats.referrals.map((ref, idx) => (
                <div 
                  key={idx}
                  style={{ 
                    padding: "12px 16px", 
                    background: "rgba(0,0,0,0.2)", 
                    borderRadius: "8px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{ fontWeight: "500" }}>{ref.address}</div>
                    <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)" }}>
                      {new Date(ref.mintedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#10B981", fontWeight: "600" }}>+{ref.rewardAmount} ETH</div>
                    <div style={{ 
                      fontSize: "0.75rem", 
                      color: ref.claimed ? "#10B981" : "#F59E0B" 
                    }}>
                      {ref.claimed ? "Claimed" : "Pending"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: "20px", 
              background: "rgba(0,0,0,0.2)", 
              borderRadius: "8px",
              textAlign: "center",
              color: "rgba(255,255,255,0.5)"
            }}>
              No referrals yet. Share your link to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
