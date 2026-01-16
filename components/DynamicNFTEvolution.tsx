"use client";

import { useState } from "react";
import { DynamicNFTStats, MOCK_DYNAMIC_NFT, XP_VALUES, EVOLUTION_THRESHOLDS } from "../lib/types";
import styles from "./features.module.css";

export function DynamicNFTEvolution() {
  const [nftStats, setNftStats] = useState<DynamicNFTStats>(MOCK_DYNAMIC_NFT);
  const [isAddingXP, setIsAddingXP] = useState(false);

  const getEvolutionClass = (evolution: string) => {
    return `evolution${evolution}`;
  };

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const getEvolution = (level: number): "Novice" | "Apprentice" | "Master" | "Legend" => {
    if (level >= EVOLUTION_THRESHOLDS.Legend.minLevel) return "Legend";
    if (level >= EVOLUTION_THRESHOLDS.Master.minLevel) return "Master";
    if (level >= EVOLUTION_THRESHOLDS.Apprentice.minLevel) return "Apprentice";
    return "Novice";
  };

  const handleAddXP = (action: keyof typeof XP_VALUES) => {
    setIsAddingXP(true);
    setTimeout(() => {
      setNftStats(prev => {
        const newXP = prev.xp + XP_VALUES[action];
        const newLevel = calculateLevel(newXP);
        const newEvolution = getEvolution(newLevel);
        return {
          ...prev,
          xp: newXP,
          level: newLevel,
          evolution: newEvolution,
          xpToNextLevel: (newLevel + 1) * 100,
          lastUpdated: Date.now()
        };
      });
      setIsAddingXP(false);
    }, 500);
  };

  const xpPercentage = (nftStats.xp % 100) / 100 * 100;

  const getEvolutionColor = (evolution: string) => {
    switch (evolution) {
      case "Novice": return "#6B7280";
      case "Apprentice": return "#3B82F6";
      case "Master": return "#8B5CF6";
      case "Legend": return "#F59E0B";
      default: return "#6B7280";
    }
  };

  return (
    <div className={styles.featureSection}>
      <h2 className={styles.featureTitle}>
        <span className={styles.featureIcon}>✨</span>
        Dynamic NFT Evolution
      </h2>

      <div className={styles.dynamicNFTContainer}>
        {/* NFT Preview */}
        <div className={`${styles.nftPreview} ${styles[getEvolutionClass(nftStats.evolution)]}`}>
          <div className={styles.evolutionImage}>
            <img src="/sphere.svg" alt={`Role Caster #${nftStats.tokenId}`} />
            {nftStats.evolution === "Legend" && (
              <div style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)",
                animation: "pulse 2s infinite"
              }} />
            )}
          </div>
          <div className={styles.evolutionTag} style={{ color: getEvolutionColor(nftStats.evolution) }}>
            {nftStats.evolution}
          </div>
          <div className={styles.levelDisplay}>
            Level {nftStats.level} | Token #{nftStats.tokenId}
          </div>
        </div>

        {/* Stats Panel */}
        <div className={styles.nftStats}>
          {/* XP Bar */}
          <div className={styles.xpBar}>
            <div className={styles.xpHeader}>
              <span>Experience Points</span>
              <span>{nftStats.xp} XP</span>
            </div>
            <div className={styles.xpProgress}>
              <div 
                className={styles.xpFill}
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>
              {100 - (nftStats.xp % 100)} XP to next level
            </div>
          </div>

          {/* Traits */}
          <div>
            <h4 style={{ marginBottom: "12px" }}>Traits</h4>
            <div className={styles.traitsGrid}>
              <div className={styles.traitCard}>
                <div className={styles.traitName}>Power</div>
                <div className={styles.traitValue} style={{ color: "#EF4444" }}>{nftStats.traits.power}</div>
              </div>
              <div className={styles.traitCard}>
                <div className={styles.traitName}>Wisdom</div>
                <div className={styles.traitValue} style={{ color: "#3B82F6" }}>{nftStats.traits.wisdom}</div>
              </div>
              <div className={styles.traitCard}>
                <div className={styles.traitName}>Charisma</div>
                <div className={styles.traitValue} style={{ color: "#8B5CF6" }}>{nftStats.traits.charisma}</div>
              </div>
            </div>
          </div>

          {/* Evolution Progress */}
          <div style={{ padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "12px" }}>
            <h4 style={{ marginBottom: "12px" }}>Evolution Progress</h4>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px" }}>
              {(["Novice", "Apprentice", "Master", "Legend"] as const).map((evo) => (
                <div 
                  key={evo}
                  style={{ 
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    background: nftStats.evolution === evo 
                      ? `linear-gradient(135deg, ${getEvolutionColor(evo)}33, ${getEvolutionColor(evo)}11)`
                      : "rgba(255,255,255,0.05)",
                    border: nftStats.evolution === evo 
                      ? `1px solid ${getEvolutionColor(evo)}`
                      : "1px solid transparent",
                    textAlign: "center",
                    opacity: nftStats.level >= EVOLUTION_THRESHOLDS[evo].minLevel ? 1 : 0.4
                  }}
                >
                  <div style={{ fontSize: "0.7rem", color: getEvolutionColor(evo) }}>{evo}</div>
                  <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.5)" }}>
                    Lvl {EVOLUTION_THRESHOLDS[evo].minLevel}+
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* XP Actions */}
          <div>
            <h4 style={{ marginBottom: "12px" }}>Earn XP</h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
              {Object.entries(XP_VALUES).map(([action, xp]) => (
                <button
                  key={action}
                  onClick={() => handleAddXP(action as keyof typeof XP_VALUES)}
                  disabled={isAddingXP}
                  style={{
                    padding: "10px",
                    background: "rgba(59, 130, 246, 0.2)",
                    border: "1px solid rgba(59, 130, 246, 0.3)",
                    borderRadius: "8px",
                    color: "white",
                    cursor: isAddingXP ? "not-allowed" : "pointer",
                    opacity: isAddingXP ? 0.6 : 1,
                    transition: "all 0.2s"
                  }}
                >
                  <div style={{ fontWeight: "600", textTransform: "capitalize" }}>
                    {action.replace(/([A-Z])/g, " $1")}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#10B981" }}>+{xp} XP</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ 
        marginTop: "20px", 
        padding: "16px", 
        background: "rgba(59, 130, 246, 0.1)", 
        borderRadius: "12px",
        fontSize: "0.85rem"
      }}>
        <h4 style={{ marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
          <span>💡</span> How Dynamic NFTs Work
        </h4>
        <p style={{ color: "rgba(255,255,255,0.7)" }}>
          Your NFT evolves as you interact with the platform. Earn XP through various activities like minting, 
          voting, and referring friends. As your level increases, your NFT evolves through different stages: 
          Novice, Apprentice, Master, and the legendary Legend status. Each evolution brings unique visual 
          enhancements and increased traits!
        </p>
      </div>
    </div>
  );
}
