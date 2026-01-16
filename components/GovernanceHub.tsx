"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { Proposal, MOCK_PROPOSALS, MOCK_NFTS } from "../lib/types";
import styles from "./features.module.css";

interface ProposalCardProps {
  proposal: Proposal;
  onVote: (proposalId: number, support: "for" | "against" | "abstain") => void;
  hasVoted: boolean;
  canVote: boolean;
}

function ProposalCard({ proposal, onVote, hasVoted, canVote }: ProposalCardProps) {
  const totalVotes = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const forPercentage = totalVotes > 0 ? (proposal.votesFor / totalVotes) * 100 : 0;
  const againstPercentage = totalVotes > 0 ? (proposal.votesAgainst / totalVotes) * 100 : 0;
  
  const getTimeRemaining = () => {
    const now = Date.now();
    if (proposal.status === "pending") {
      const timeUntilStart = proposal.startTime - now;
      const days = Math.floor(timeUntilStart / (1000 * 60 * 60 * 24));
      return `Starts in ${days} day(s)`;
    }
    if (proposal.status === "active") {
      const timeRemaining = proposal.endTime - now;
      const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      return `${days}d ${hours}h remaining`;
    }
    return "Voting ended";
  };

  return (
    <div className={styles.proposalCard}>
      <div className={styles.proposalHeader}>
        <div className={styles.proposalTitle}>{proposal.title}</div>
        <span className={`${styles.proposalStatus} ${styles[`status${proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}`]}`}>
          {proposal.status.toUpperCase()}
        </span>
      </div>
      
      <div className={styles.proposalDesc}>{proposal.description}</div>
      
      {/* Vote Progress Bar */}
      <div style={{ marginBottom: "16px" }}>
        <div style={{ 
          height: "8px", 
          background: "rgba(255,255,255,0.1)", 
          borderRadius: "4px",
          overflow: "hidden",
          display: "flex"
        }}>
          <div style={{ width: `${forPercentage}%`, background: "#10B981", transition: "width 0.3s" }} />
          <div style={{ width: `${againstPercentage}%`, background: "#EF4444", transition: "width 0.3s" }} />
        </div>
      </div>
      
      <div className={styles.proposalVotes}>
        <div className={styles.voteCount}>
          <div className={styles.voteLabel}>For</div>
          <div className={`${styles.voteNumber} ${styles.for}`}>{proposal.votesFor}</div>
        </div>
        <div className={styles.voteCount}>
          <div className={styles.voteLabel}>Against</div>
          <div className={`${styles.voteNumber} ${styles.against}`}>{proposal.votesAgainst}</div>
        </div>
        <div className={styles.voteCount}>
          <div className={styles.voteLabel}>Abstain</div>
          <div className={`${styles.voteNumber} ${styles.abstain}`}>{proposal.votesAbstain}</div>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "12px",
        fontSize: "0.85rem",
        color: "rgba(255,255,255,0.6)"
      }}>
        <span>Quorum: {totalVotes} / {proposal.quorum}</span>
        <span>{getTimeRemaining()}</span>
      </div>
      
      {proposal.status === "active" && canVote && !hasVoted && (
        <div className={styles.voteButtons}>
          <button 
            className={`${styles.voteBtn} ${styles.for}`}
            onClick={() => onVote(proposal.id, "for")}
          >
            Vote For
          </button>
          <button 
            className={`${styles.voteBtn} ${styles.against}`}
            onClick={() => onVote(proposal.id, "against")}
          >
            Vote Against
          </button>
          <button 
            className={`${styles.voteBtn} ${styles.abstain}`}
            onClick={() => onVote(proposal.id, "abstain")}
          >
            Abstain
          </button>
        </div>
      )}

      {hasVoted && (
        <div style={{ 
          padding: "10px", 
          background: "rgba(59, 130, 246, 0.2)", 
          borderRadius: "8px",
          textAlign: "center",
          color: "#3B82F6",
          fontWeight: "600"
        }}>
          You have voted on this proposal
        </div>
      )}

      {!canVote && proposal.status === "active" && (
        <div style={{ 
          padding: "10px", 
          background: "rgba(255,255,255,0.05)", 
          borderRadius: "8px",
          textAlign: "center",
          color: "rgba(255,255,255,0.6)"
        }}>
          Hold at least 1 NFT to vote
        </div>
      )}
    </div>
  );
}

export function GovernanceHub() {
  const { isConnected } = useAccount();
  const [proposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [votedProposals, setVotedProposals] = useState<number[]>([]);
  const [filter, setFilter] = useState<string>("all");
  
  const nftBalance = MOCK_NFTS.length;
  const canVote = isConnected && nftBalance > 0;

  const handleVote = (proposalId: number, support: "for" | "against" | "abstain") => {
    setVotedProposals(prev => [...prev, proposalId]);
    // In a real implementation, this would call the smart contract
    console.log(`Voted ${support} on proposal ${proposalId}`);
  };

  const filteredProposals = filter === "all"
    ? proposals
    : proposals.filter(p => p.status === filter);

  const statuses = ["all", "active", "passed", "rejected", "pending"];

  return (
    <div className={styles.featureSection}>
      <h2 className={styles.featureTitle}>
        <span className={styles.featureIcon}>🗳️</span>
        Governance
      </h2>

      {/* Voting Power */}
      <div style={{ 
        padding: "16px", 
        background: "rgba(0,0,0,0.2)", 
        borderRadius: "12px",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>Your Voting Power</div>
          <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{nftBalance} NFT(s)</div>
        </div>
        {canVote ? (
          <div style={{ 
            padding: "8px 16px", 
            background: "rgba(16, 185, 129, 0.2)", 
            borderRadius: "8px",
            color: "#10B981",
            fontWeight: "600"
          }}>
            Eligible to Vote
          </div>
        ) : (
          <div style={{ 
            padding: "8px 16px", 
            background: "rgba(239, 68, 68, 0.2)", 
            borderRadius: "8px",
            color: "#EF4444",
            fontWeight: "600"
          }}>
            {isConnected ? "Need NFTs to Vote" : "Connect Wallet"}
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className={styles.tabContainer}>
        {statuses.map(status => (
          <button
            key={status}
            className={`${styles.tab} ${filter === status ? styles.active : ""}`}
            onClick={() => setFilter(status)}
          >
            {status === "all" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Proposals List */}
      <div className={styles.proposalList}>
        {filteredProposals.length > 0 ? (
          filteredProposals.map(proposal => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              onVote={handleVote}
              hasVoted={votedProposals.includes(proposal.id)}
              canVote={canVote}
            />
          ))
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📋</div>
            <div className={styles.emptyText}>No proposals found</div>
          </div>
        )}
      </div>

      {/* Create Proposal CTA */}
      {nftBalance >= 5 && (
        <div style={{ 
          marginTop: "20px", 
          padding: "16px", 
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))",
          borderRadius: "12px",
          textAlign: "center"
        }}>
          <div style={{ marginBottom: "8px", fontWeight: "600" }}>You can create proposals!</div>
          <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginBottom: "12px" }}>
            With 5+ NFTs, you have the power to submit new governance proposals.
          </div>
          <button style={{
            background: "linear-gradient(135deg, #8B5CF6, #3B82F6)",
            border: "none",
            padding: "10px 24px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "600",
            cursor: "pointer"
          }}>
            Create Proposal
          </button>
        </div>
      )}
    </div>
  );
}
