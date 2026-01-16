"use client";

import { useState } from "react";
import { MintRoleNFT } from "../components/MintRoleNFT";
import { NFTGallery } from "../components/NFTGallery";
import { BasenameDisplay } from "../components/BasenameDisplay";
import { AchievementBadges } from "../components/AchievementBadges";
import { RoleGate } from "../components/RoleGate";
import { BridgeWidget } from "../components/BridgeWidget";
import { GaslessMint } from "../components/GaslessMint";
import { GovernanceHub } from "../components/GovernanceHub";
import { ReferralDashboard } from "../components/ReferralDashboard";
import { DynamicNFTEvolution } from "../components/DynamicNFTEvolution";
import { Leaderboard } from "../components/Leaderboard";
import styles from "./page.module.css";

type FeatureTab = 
  | "mint"
  | "gallery"
  | "basename"
  | "achievements"
  | "roles"
  | "bridge"
  | "gasless"
  | "governance"
  | "referral"
  | "evolution"
  | "leaderboard";

const FEATURE_TABS: { id: FeatureTab; name: string; icon: string }[] = [
  { id: "mint", name: "Mint", icon: "🎨" },
  { id: "gallery", name: "Gallery", icon: "🖼️" },
  { id: "basename", name: "Identity", icon: "🏷️" },
  { id: "achievements", name: "Badges", icon: "🏆" },
  { id: "roles", name: "Roles", icon: "🎭" },
  { id: "bridge", name: "Bridge", icon: "🌉" },
  { id: "gasless", name: "Gasless", icon: "⛽" },
  { id: "governance", name: "Vote", icon: "🗳️" },
  { id: "referral", name: "Referral", icon: "👥" },
  { id: "evolution", name: "Evolution", icon: "✨" },
  { id: "leaderboard", name: "Rankings", icon: "📊" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<FeatureTab>("mint");

  const renderFeature = () => {
    switch (activeTab) {
      case "mint":
        return <MintRoleNFT />;
      case "gallery":
        return <NFTGallery />;
      case "basename":
        return <BasenameDisplay />;
      case "achievements":
        return <AchievementBadges />;
      case "roles":
        return <RoleGate />;
      case "bridge":
        return <BridgeWidget />;
      case "gasless":
        return <GaslessMint />;
      case "governance":
        return <GovernanceHub />;
      case "referral":
        return <ReferralDashboard />;
      case "evolution":
        return <DynamicNFTEvolution />;
      case "leaderboard":
        return <Leaderboard />;
      default:
        return <MintRoleNFT />;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <img src="/logo.png" alt="Role Caster" width={40} height={40} />
          <span>Role Caster</span>
        </div>
        <div className={styles.badge}>Base Chain</div>
      </header>

      {/* Feature Navigation */}
      <nav className={styles.featureNav}>
        {FEATURE_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.featureTab} ${activeTab === tab.id ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabName}>{tab.name}</span>
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className={styles.content}>
        {renderFeature()}
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="https://base.org" target="_blank" rel="noopener noreferrer">Base</a>
          <a href="https://docs.base.org" target="_blank" rel="noopener noreferrer">Docs</a>
          <a href="https://basescan.org" target="_blank" rel="noopener noreferrer">Explorer</a>
        </div>
        <div className={styles.footerText}>
          Built on Base with Coinbase OnchainKit
        </div>
      </footer>
    </div>
  );
}
