"use client";

import { useState } from "react";
import { NFTMetadata, MOCK_NFTS } from "../lib/types";
import styles from "./features.module.css";

interface NFTCardProps {
  nft: NFTMetadata;
}

function NFTCard({ nft }: NFTCardProps) {
  const rarityClass = `rarity${nft.rarity}`;
  
  return (
    <div className={styles.nftCard}>
      <div className={styles.nftImage}>
        <img src={nft.image} alt={nft.name} />
      </div>
      <div className={styles.nftInfo}>
        <div className={styles.nftName}>{nft.name}</div>
        <span className={`${styles.nftRarity} ${styles[rarityClass]}`}>
          {nft.rarity}
        </span>
        <div className={styles.nftAttributes}>
          {nft.attributes.map((attr, idx) => (
            <span key={idx} className={styles.nftAttribute}>
              {attr.trait_type}: {attr.value}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function NFTGallery() {
  const [nfts] = useState<NFTMetadata[]>(MOCK_NFTS);
  const [filter, setFilter] = useState<string>("all");

  const filteredNFTs = filter === "all" 
    ? nfts 
    : nfts.filter(nft => nft.rarity === filter);

  const rarities = ["all", "Common", "Uncommon", "Rare", "Epic", "Legendary"];

  return (
    <div className={styles.featureSection}>
      <h2 className={styles.featureTitle}>
        <span className={styles.featureIcon}>🖼️</span>
        NFT Gallery
      </h2>
      
      <div className={styles.tabContainer}>
        {rarities.map(rarity => (
          <button
            key={rarity}
            className={`${styles.tab} ${filter === rarity ? styles.active : ""}`}
            onClick={() => setFilter(rarity)}
          >
            {rarity === "all" ? "All NFTs" : rarity}
          </button>
        ))}
      </div>

      {filteredNFTs.length > 0 ? (
        <div className={styles.nftGrid}>
          {filteredNFTs.map(nft => (
            <NFTCard key={nft.tokenId} nft={nft} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🎨</div>
          <div className={styles.emptyText}>No NFTs found in this category</div>
        </div>
      )}
    </div>
  );
}
