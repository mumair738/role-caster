"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { LeaderboardEntry, MOCK_LEADERBOARD } from "../lib/types";
import styles from "./features.module.css";

export function Leaderboard() {
  const { address, isConnected } = useAccount();
  const [leaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD);
  const [timeFilter, setTimeFilter] = useState<"weekly" | "monthly" | "allTime">("weekly");

  // Mock user data - in real app this would come from the contract
  const mockUserRank = 42;
  const mockUserPoints = 3250;

  const weeklyRewardPool = "0.5";
  const timeUntilReset = 4 * 24 * 60 * 60 * 1000; // 4 days

  const formatTimeRemaining = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days}d ${hours}h`;
  };

  const getRankClass = (rank: number) => {
    if (rank === 1) return styles.rank1;
    if (rank === 2) return styles.rank2;
    if (rank === 3) return styles.rank3;
    return "";
  };

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return `↑${change}`;
    if (change < 0) return `↓${Math.abs(change)}`;
    return "-";
  };

  return (
    <div className={styles.featureSection}>
      <h2 className={styles.featureTitle}>
        <span className={styles.featureIcon}>🏆</span>
        Leaderboard
      </h2>

      {/* Weekly Reward Pool */}
      <div className={styles.rewardPool}>
        <div className={styles.poolAmount}>{weeklyRewardPool} ETH</div>
        <div className={styles.poolLabel}>Weekly Reward Pool</div>
        <div style={{ fontSize: "0.85rem", marginTop: "8px", color: "rgba(255,255,255,0.6)" }}>
          Resets in {formatTimeRemaining(timeUntilReset)}
        </div>
      </div>

      {/* User's Current Position */}
      {isConnected && (
        <div style={{ 
          marginTop: "20px",
          padding: "16px", 
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2))",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Your Rank</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>#{mockUserRank}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Your Points</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "700", color: "#3B82F6" }}>{mockUserPoints.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Time Filter */}
      <div className={styles.tabContainer} style={{ marginTop: "20px" }}>
        <button
          className={`${styles.tab} ${timeFilter === "weekly" ? styles.active : ""}`}
          onClick={() => setTimeFilter("weekly")}
        >
          Weekly
        </button>
        <button
          className={`${styles.tab} ${timeFilter === "monthly" ? styles.active : ""}`}
          onClick={() => setTimeFilter("monthly")}
        >
          Monthly
        </button>
        <button
          className={`${styles.tab} ${timeFilter === "allTime" ? styles.active : ""}`}
          onClick={() => setTimeFilter("allTime")}
        >
          All Time
        </button>
      </div>

      {/* Leaderboard Header */}
      <div className={styles.leaderboardHeader}>
        <span>Rank</span>
        <span>User</span>
        <span style={{ textAlign: "right" }}>Points</span>
        <span style={{ textAlign: "center" }}>Change</span>
      </div>

      {/* Leaderboard List */}
      <div className={styles.leaderboardContainer}>
        {leaderboard.map((entry) => (
          <div 
            key={entry.rank}
            className={`${styles.leaderboardRow} ${entry.address === address ? styles.highlight : ""}`}
          >
            <div className={`${styles.rankCell} ${getRankClass(entry.rank)}`}>
              {getRankEmoji(entry.rank)}
            </div>
            <div className={styles.userCell}>
              <div className={styles.userName}>
                {entry.basename || entry.address}
              </div>
              {entry.basename && (
                <div className={styles.userAddress}>{entry.address}</div>
              )}
            </div>
            <div className={styles.pointsCell}>
              {entry.points.toLocaleString()}
            </div>
            <div className={`${styles.changeCell} ${
              entry.weeklyChange > 0 ? styles.changeUp : 
              entry.weeklyChange < 0 ? styles.changeDown : 
              styles.changeNeutral
            }`}>
              {getChangeIcon(entry.weeklyChange)}
            </div>
          </div>
        ))}
      </div>

      {/* Rewards Table */}
      <div style={{ marginTop: "24px" }}>
        <h4 style={{ marginBottom: "12px" }}>Weekly Rewards</h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "12px" }}>
          <div style={{ 
            padding: "12px", 
            background: "linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.1))",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid rgba(255, 215, 0, 0.3)"
          }}>
            <div style={{ fontSize: "1.2rem" }}>🥇</div>
            <div style={{ fontWeight: "600", color: "#FFD700" }}>1st Place</div>
            <div style={{ fontSize: "0.9rem" }}>0.1 ETH</div>
          </div>
          <div style={{ 
            padding: "12px", 
            background: "linear-gradient(135deg, rgba(192, 192, 192, 0.2), rgba(192, 192, 192, 0.1))",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid rgba(192, 192, 192, 0.3)"
          }}>
            <div style={{ fontSize: "1.2rem" }}>🥈</div>
            <div style={{ fontWeight: "600", color: "#C0C0C0" }}>2nd Place</div>
            <div style={{ fontSize: "0.9rem" }}>0.05 ETH</div>
          </div>
          <div style={{ 
            padding: "12px", 
            background: "linear-gradient(135deg, rgba(205, 127, 50, 0.2), rgba(205, 127, 50, 0.1))",
            borderRadius: "8px",
            textAlign: "center",
            border: "1px solid rgba(205, 127, 50, 0.3)"
          }}>
            <div style={{ fontSize: "1.2rem" }}>🥉</div>
            <div style={{ fontWeight: "600", color: "#CD7F32" }}>3rd Place</div>
            <div style={{ fontSize: "0.9rem" }}>0.025 ETH</div>
          </div>
          <div style={{ 
            padding: "12px", 
            background: "rgba(0,0,0,0.2)",
            borderRadius: "8px",
            textAlign: "center"
          }}>
            <div style={{ fontSize: "1.2rem" }}>🎖️</div>
            <div style={{ fontWeight: "600" }}>4-10th</div>
            <div style={{ fontSize: "0.9rem" }}>0.01 ETH</div>
          </div>
        </div>
      </div>

      {/* Points Info */}
      <div style={{ 
        marginTop: "24px", 
        padding: "16px", 
        background: "rgba(59, 130, 246, 0.1)", 
        borderRadius: "12px",
        fontSize: "0.85rem"
      }}>
        <h4 style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>📊</span> How to Earn Points
        </h4>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", 
          gap: "12px" 
        }}>
          <div style={{ padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
            <div style={{ fontWeight: "600" }}>Mint NFT</div>
            <div style={{ color: "#10B981" }}>+100 pts</div>
          </div>
          <div style={{ padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
            <div style={{ fontWeight: "600" }}>Referral</div>
            <div style={{ color: "#10B981" }}>+500 pts</div>
          </div>
          <div style={{ padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
            <div style={{ fontWeight: "600" }}>Vote</div>
            <div style={{ color: "#10B981" }}>+200 pts</div>
          </div>
          <div style={{ padding: "8px", background: "rgba(0,0,0,0.2)", borderRadius: "6px" }}>
            <div style={{ fontWeight: "600" }}>Daily Login</div>
            <div style={{ color: "#10B981" }}>+50 pts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
