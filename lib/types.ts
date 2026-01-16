// Types and Mock Data for Role Caster Base Chain Features

// ============== Feature 1: NFT Gallery Types ==============
export interface NFTMetadata {
  tokenId: number;
  name: string;
  description: string;
  image: string;
  attributes: NFTAttribute[];
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

// ============== Feature 2: Basenames Types ==============
export interface BasenameData {
  name: string | null;
  avatar: string | null;
  address: string;
  isRegistered: boolean;
}

// ============== Feature 3: Achievement Types ==============
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAt?: number;
  progress?: number;
  maxProgress?: number;
  category: 'minting' | 'social' | 'governance' | 'referral' | 'trading';
}

// ============== Feature 4: Role Types ==============
export type UserRole = 'VISITOR' | 'MEMBER' | 'VIP' | 'WHALE';

export interface RoleConfig {
  role: UserRole;
  minNFTs: number;
  minETH: number;
  features: string[];
  color: string;
  badge: string;
}

// ============== Feature 5: Bridge Types ==============
export interface BridgeTransaction {
  id: string;
  amount: string;
  token: string;
  fromChain: 'Ethereum' | 'Base';
  toChain: 'Ethereum' | 'Base';
  status: 'pending' | 'confirmed' | 'completed' | 'failed';
  timestamp: number;
  txHash: string;
}

export interface BridgeBalance {
  ethereum: string;
  base: string;
  token: string;
}

// ============== Feature 6: Gasless Types ==============
export interface GaslessConfig {
  enabled: boolean;
  remainingFreeTransactions: number;
  totalFreeTransactions: number;
  sponsoredActions: string[];
}

// ============== Feature 7: Governance Types ==============
export interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  status: 'active' | 'passed' | 'rejected' | 'pending' | 'executed';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  startTime: number;
  endTime: number;
  quorum: number;
}

export interface Vote {
  proposalId: number;
  voter: string;
  support: 'for' | 'against' | 'abstain';
  weight: number;
  timestamp: number;
}

// ============== Feature 8: Referral Types ==============
export interface ReferralStats {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  pendingRewards: string;
  claimedRewards: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  referrals: ReferralEntry[];
}

export interface ReferralEntry {
  address: string;
  mintedAt: number;
  rewardAmount: string;
  claimed: boolean;
}

// ============== Feature 9: Dynamic NFT Types ==============
export interface DynamicNFTStats {
  tokenId: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  evolution: 'Novice' | 'Apprentice' | 'Master' | 'Legend';
  traits: {
    power: number;
    wisdom: number;
    charisma: number;
  };
  achievements: string[];
  lastUpdated: number;
}

export interface XPEvent {
  type: string;
  xp: number;
  timestamp: number;
}

// ============== Feature 10: Leaderboard Types ==============
export interface LeaderboardEntry {
  rank: number;
  address: string;
  basename?: string;
  points: number;
  level: number;
  achievements: number;
  weeklyChange: number;
}

export interface LeaderboardStats {
  userRank: number;
  totalUsers: number;
  userPoints: number;
  weeklyRewardPool: string;
  timeUntilReset: number;
}

// ============== Mock Data ==============

export const MOCK_NFTS: NFTMetadata[] = [
  {
    tokenId: 1,
    name: 'Role Caster #1',
    description: 'A legendary role caster NFT on Base',
    image: '/sphere.svg',
    rarity: 'Legendary',
    attributes: [
      { trait_type: 'Power', value: 95 },
      { trait_type: 'Wisdom', value: 88 },
      { trait_type: 'Background', value: 'Cosmic' },
    ],
  },
  {
    tokenId: 2,
    name: 'Role Caster #2',
    description: 'An epic role caster NFT on Base',
    image: '/sphere.svg',
    rarity: 'Epic',
    attributes: [
      { trait_type: 'Power', value: 75 },
      { trait_type: 'Wisdom', value: 82 },
      { trait_type: 'Background', value: 'Nebula' },
    ],
  },
  {
    tokenId: 3,
    name: 'Role Caster #3',
    description: 'A rare role caster NFT on Base',
    image: '/sphere.svg',
    rarity: 'Rare',
    attributes: [
      { trait_type: 'Power', value: 60 },
      { trait_type: 'Wisdom', value: 65 },
      { trait_type: 'Background', value: 'Aurora' },
    ],
  },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Among the first 100 minters',
    icon: '🌟',
    rarity: 'Legendary',
    unlockedAt: Date.now() - 86400000,
    category: 'minting',
  },
  {
    id: 'role-master',
    name: 'Role Master',
    description: 'Minted 5+ NFTs',
    icon: '👑',
    rarity: 'Epic',
    progress: 3,
    maxProgress: 5,
    category: 'minting',
  },
  {
    id: 'social-butterfly',
    name: 'Social Butterfly',
    description: 'Shared 10+ casts',
    icon: '🦋',
    rarity: 'Rare',
    progress: 7,
    maxProgress: 10,
    category: 'social',
  },
  {
    id: 'governance-voter',
    name: 'Governance Voter',
    description: 'Voted on 5 proposals',
    icon: '🗳️',
    rarity: 'Rare',
    progress: 2,
    maxProgress: 5,
    category: 'governance',
  },
  {
    id: 'whale-status',
    name: 'Whale Status',
    description: 'Hold 1+ ETH on Base',
    icon: '🐋',
    rarity: 'Epic',
    category: 'trading',
  },
  {
    id: 'referral-king',
    name: 'Referral King',
    description: 'Referred 20+ users',
    icon: '👥',
    rarity: 'Legendary',
    progress: 5,
    maxProgress: 20,
    category: 'referral',
  },
];

export const ROLE_CONFIGS: RoleConfig[] = [
  {
    role: 'VISITOR',
    minNFTs: 0,
    minETH: 0,
    features: ['view'],
    color: '#6B7280',
    badge: '👤',
  },
  {
    role: 'MEMBER',
    minNFTs: 1,
    minETH: 0,
    features: ['view', 'vote', 'chat'],
    color: '#3B82F6',
    badge: '🎭',
  },
  {
    role: 'VIP',
    minNFTs: 3,
    minETH: 0,
    features: ['view', 'vote', 'chat', 'earlyAccess'],
    color: '#8B5CF6',
    badge: '⭐',
  },
  {
    role: 'WHALE',
    minNFTs: 5,
    minETH: 1,
    features: ['view', 'vote', 'chat', 'earlyAccess', 'proposals'],
    color: '#F59E0B',
    badge: '🐋',
  },
];

export const MOCK_PROPOSALS: Proposal[] = [
  {
    id: 1,
    title: 'Increase Referral Rewards',
    description: 'Proposal to increase the referral reward from 0.001 ETH to 0.002 ETH per successful referral.',
    proposer: '0x1234...5678',
    status: 'active',
    votesFor: 1250,
    votesAgainst: 340,
    votesAbstain: 89,
    startTime: Date.now() - 86400000,
    endTime: Date.now() + 172800000,
    quorum: 1000,
  },
  {
    id: 2,
    title: 'Add New Achievement Category',
    description: 'Create a new "Trading" achievement category for active traders on Base.',
    proposer: '0xabcd...efgh',
    status: 'passed',
    votesFor: 2100,
    votesAgainst: 450,
    votesAbstain: 120,
    startTime: Date.now() - 432000000,
    endTime: Date.now() - 172800000,
    quorum: 1000,
  },
  {
    id: 3,
    title: 'Launch NFT Staking',
    description: 'Implement NFT staking mechanism with daily rewards for stakers.',
    proposer: '0x9876...5432',
    status: 'pending',
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    startTime: Date.now() + 86400000,
    endTime: Date.now() + 432000000,
    quorum: 1500,
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, address: '0x1234...5678', basename: 'cryptoking.base', points: 15420, level: 45, achievements: 12, weeklyChange: 2 },
  { rank: 2, address: '0xabcd...efgh', basename: 'defi_whale.base', points: 14200, level: 42, achievements: 11, weeklyChange: -1 },
  { rank: 3, address: '0x9876...5432', basename: 'nft_lover.base', points: 13890, level: 41, achievements: 10, weeklyChange: 1 },
  { rank: 4, address: '0xfedc...ba98', points: 12500, level: 38, achievements: 9, weeklyChange: 0 },
  { rank: 5, address: '0x5555...6666', basename: 'base_builder.base', points: 11200, level: 35, achievements: 8, weeklyChange: 3 },
  { rank: 6, address: '0x7777...8888', points: 10800, level: 33, achievements: 8, weeklyChange: -2 },
  { rank: 7, address: '0x9999...0000', basename: 'moonboy.base', points: 9500, level: 30, achievements: 7, weeklyChange: 1 },
  { rank: 8, address: '0xaaaa...bbbb', points: 8900, level: 28, achievements: 6, weeklyChange: 0 },
  { rank: 9, address: '0xcccc...dddd', basename: 'hodler.base', points: 8200, level: 26, achievements: 6, weeklyChange: -1 },
  { rank: 10, address: '0xeeee...ffff', points: 7800, level: 24, achievements: 5, weeklyChange: 2 },
];

export const MOCK_REFERRAL_STATS: ReferralStats = {
  referralCode: 'RC-X7K9M2',
  referralLink: 'https://rolecaster.xyz?ref=RC-X7K9M2',
  totalReferrals: 12,
  pendingRewards: '0.024',
  claimedRewards: '0.012',
  tier: 'Silver',
  referrals: [
    { address: '0x1111...2222', mintedAt: Date.now() - 86400000, rewardAmount: '0.002', claimed: true },
    { address: '0x3333...4444', mintedAt: Date.now() - 172800000, rewardAmount: '0.002', claimed: true },
    { address: '0x5555...6666', mintedAt: Date.now() - 43200000, rewardAmount: '0.002', claimed: false },
  ],
};

export const MOCK_DYNAMIC_NFT: DynamicNFTStats = {
  tokenId: 1,
  level: 24,
  xp: 2450,
  xpToNextLevel: 3000,
  evolution: 'Apprentice',
  traits: {
    power: 65,
    wisdom: 72,
    charisma: 58,
  },
  achievements: ['early-adopter', 'social-butterfly'],
  lastUpdated: Date.now() - 3600000,
};

export const MOCK_BRIDGE_BALANCES: BridgeBalance = {
  ethereum: '1.5',
  base: '0.25',
  token: 'ETH',
};

export const MOCK_GASLESS_CONFIG: GaslessConfig = {
  enabled: true,
  remainingFreeTransactions: 2,
  totalFreeTransactions: 3,
  sponsoredActions: ['mint', 'vote', 'claimAchievement'],
};

// XP Configuration
export const XP_VALUES = {
  mint: 100,
  referral: 500,
  vote: 200,
  proposal: 1000,
  dailyLogin: 50,
  castShare: 150,
  achievementUnlock: 300,
};

// Evolution Thresholds
export const EVOLUTION_THRESHOLDS = {
  Novice: { minLevel: 1, maxLevel: 10 },
  Apprentice: { minLevel: 11, maxLevel: 30 },
  Master: { minLevel: 31, maxLevel: 60 },
  Legend: { minLevel: 61, maxLevel: 100 },
};
