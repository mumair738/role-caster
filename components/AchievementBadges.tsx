"use client";

import { useState } from "react";
import { Achievement, MOCK_ACHIEVEMENTS } from "../lib/types";
import styles from "./features.module.css";

interface AchievementCardProps {
  achievement: Achievement;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = achievement.unlockedAt !== undefined;
  const progress = achievement.progress && achievement.maxProgress 
    ? (achievement.progress / achievement.maxProgress) * 100 
    : isUnlocked ? 100 : 0;

  const rarityClass = `rarity${achievement.rarity}`;

  return (
    <div className={`${styles.achievementCard} ${isUnlocked ? styles.unlocked : styles.locked}`}>
      <div className={styles.achievementIcon}>{achievement.icon}</div>
      <div className={styles.achievementInfo}>
        <div className={styles.achievementName}>{achievement.name}</div>
        <div className={styles.achievementDesc}>{achievement.description}</div>
        
        {!isUnlocked && achievement.maxProgress && (
          <>
            <div className={styles.achievementProgress}>
              <div 
                className={styles.achievementProgressBar} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div style={{ fontSize: "0.75rem", marginTop: "4px", color: "rgba(255,255,255,0.6)" }}>
              {achievement.progress} / {achievement.maxProgress}
            </div>
          </>
        )}
        
        <span className={`${styles.achievementRarity} ${styles[rarityClass]}`}>
          {achievement.rarity}
        </span>
        
        {isUnlocked && achievement.unlockedAt && (
          <div style={{ fontSize: "0.75rem", marginTop: "8px", color: "rgba(255,255,255,0.6)" }}>
            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
}

export function AchievementBadges() {
  const [achievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [filter, setFilter] = useState<string>("all");

  const categories = ["all", "minting", "social", "governance", "referral", "trading"];
  
  const filteredAchievements = filter === "all"
    ? achievements
    : achievements.filter(a => a.category === filter);

  const unlockedCount = achievements.filter(a => a.unlockedAt !== undefined).length;

  return (
    <div className={styles.featureSection}>
      <h2 className={styles.featureTitle}>
        <span className={styles.featureIcon}>🏆</span>
        Achievement Badges
        <span style={{ fontSize: "0.9rem", fontWeight: "normal", marginLeft: "auto", color: "rgba(255,255,255,0.7)" }}>
          {unlockedCount} / {achievements.length} Unlocked
        </span>
      </h2>

      <div className={styles.tabContainer}>
        {categories.map(cat => (
          <button
            key={cat}
            className={`${styles.tab} ${filter === cat ? styles.active : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.achievementGrid}>
        {filteredAchievements.map(achievement => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </div>
    </div>
  );
}
