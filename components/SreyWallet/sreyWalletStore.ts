import * as bip39 from 'bip39';

export interface SreyToken {
  id: string;
  name: string;
  symbol: string;
  network: 'TON' | 'BTC' | 'ETH' | 'BNB' | 'TRX' | 'SOL';
  networkName: string;
  priceUsd: number;
  change24h: number;
  balance: number;
  icon: string;
  contractAddress?: string;
  decimals: number;
}

export interface SreyNFT {
  id: string;
  name: string;
  collection: string;
  image: string;
  floorPriceTon: number;
  tokenId: string;
  rarity?: string;
  ownerAddress: string;
}

export interface SreyTransaction {
  id: string;
  type: 'SEND' | 'RECEIVE' | 'SWAP';
  symbol: string;
  amount: number;
  fiatValueUsd: number;
  recipientOrSender: string;
  txHash: string;
  timestamp: number;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  network: string;
  fee?: number;
}

export interface SreyAccount {
  id: string;
  name: string; // e.g. "Wallet 1", "Wallet 2"
  mnemonic: string; // 24 words
  tonAddress: string;
  evmAddress: string;
  btcAddress: string;
  trxAddress: string;
  solAddress: string;
  createdAt: number;
  isBackedUp: boolean;
}

// Generate deterministic-looking multi-chain addresses from mnemonic hash
export function deriveAddressesFromMnemonic(mnemonic: string) {
  // Simple deterministic generator based on mnemonic entropy
  let hash = 0;
  for (let i = 0; i < mnemonic.length; i++) {
    hash = (hash << 5) - hash + mnemonic.charCodeAt(i);
    hash |= 0;
  }
  const hexPart = Math.abs(hash).toString(16).padStart(8, '0');
  const hexPart2 = Math.abs(hash * 31).toString(16).padStart(8, '0');
  const hexPart3 = Math.abs(hash * 127).toString(16).padStart(8, '0');

  return {
    tonAddress: `UQAU${hexPart.slice(0, 4)}c97F${hexPart2.slice(0, 8)}${hexPart3.slice(0, 8)}Srey`,
    evmAddress: `0x7a${hexPart.slice(0, 6)}${hexPart2.slice(0, 10)}${hexPart3.slice(0, 12)}F9`,
    btcAddress: `bc1q${hexPart.slice(0, 6)}${hexPart2.slice(0, 8)}${hexPart3.slice(0, 10)}w3`,
    trxAddress: `TX${hexPart.slice(0, 6)}${hexPart2.slice(0, 8)}${hexPart3.slice(0, 10)}Kz`,
    solAddress: `Srey${hexPart.slice(0, 8)}${hexPart2.slice(0, 8)}${hexPart3.slice(0, 8)}sol`
  };
}

// Initial Mock Tokens with Srey Token at the top (Matching Screenshot 2)
export const INITIAL_SREY_TOKENS: SreyToken[] = [
  {
    id: 'srey',
    name: 'Srey Token',
    symbol: 'SREY',
    network: 'TON',
    networkName: 'The Open Network',
    priceUsd: 0.0018,
    change24h: 2.45,
    balance: 0,
    icon: '👑',
    decimals: 9
  },
  {
    id: 'gram',
    name: 'Gram',
    symbol: 'GRAM',
    network: 'TON',
    networkName: 'TON PoW Giver',
    priceUsd: 1.49,
    change24h: -5.22,
    balance: 0,
    icon: '💎',
    decimals: 9
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    network: 'BTC',
    networkName: 'Bitcoin Core',
    priceUsd: 83725.0,
    change24h: 0.35,
    balance: 0,
    icon: '₿',
    decimals: 8
  },
  {
    id: 'usdt',
    name: 'Tether USD',
    symbol: 'USDT',
    network: 'TON',
    networkName: 'TON Jetton / TRC20',
    priceUsd: 1.0,
    change24h: 0.0,
    balance: 0,
    icon: '₮',
    decimals: 6
  },
  {
    id: 'trx',
    name: 'Tron',
    symbol: 'TRX',
    network: 'TRX',
    networkName: 'Tron Network',
    priceUsd: 0.3388,
    change24h: 1.02,
    balance: 0,
    icon: '🔴',
    decimals: 6
  },
  {
    id: 'bnb',
    name: 'BNB',
    symbol: 'BNB',
    network: 'BNB',
    networkName: 'BNB Smart Chain',
    priceUsd: 768.4,
    change24h: 0.63,
    balance: 0,
    icon: '🟡',
    decimals: 18
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    network: 'ETH',
    networkName: 'Ethereum Mainnet',
    priceUsd: 2689.0,
    change24h: -1.09,
    balance: 0,
    icon: '🔷',
    decimals: 18
  },
  {
    id: 'ton',
    name: 'Toncoin',
    symbol: 'TON',
    network: 'TON',
    networkName: 'TON Mainnet',
    priceUsd: 5.2,
    change24h: 3.12,
    balance: 0,
    icon: '⚡',
    decimals: 9
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    network: 'SOL',
    networkName: 'Solana Mainnet',
    priceUsd: 152.4,
    change24h: 4.2,
    balance: 0,
    icon: '🟣',
    decimals: 9
  }
];

export const INITIAL_SREY_NFTS: SreyNFT[] = [
  {
    id: 'nft-1',
    name: 'Srey Royal Sovereign Pass #001',
    collection: 'Srey Genesis Pass Collection',
    image: 'https://images.unsplash.com/photo-1634973357973-f2ed2657db3c?w=400&q=80',
    floorPriceTon: 18.5,
    tokenId: '#001',
    rarity: 'Legendary Royal',
    ownerAddress: 'UQAUc97F...Srey'
  },
  {
    id: 'nft-2',
    name: 'Telegram Username @sreyqueen',
    collection: 'Telegram Fragment Collectibles',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
    floorPriceTon: 45.0,
    tokenId: '@sreyqueen',
    rarity: 'Exclusive Handle',
    ownerAddress: 'UQAUc97F...Srey'
  },
  {
    id: 'nft-3',
    name: 'Anonymous Telegram Number +888 0918',
    collection: 'Telegram Virtual Numbers',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&q=80',
    floorPriceTon: 89.0,
    tokenId: '+888 0918',
    rarity: 'Rare 888 Number',
    ownerAddress: 'UQAUc97F...Srey'
  }
];

// Helper to generate a brand new 24-word recovery phrase
export function generate24WordMnemonic(): string {
  try {
    return bip39.generateMnemonic(256); // 256 bits = 24 words
  } catch (err) {
    // Fallback standard wordlist in case of environment entropy issue
    const defaultWordlist = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
      'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
      'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
      'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
      'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
      'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
      'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
      'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
      'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
      'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest'
    ];
    const words: string[] = [];
    for (let i = 0; i < 24; i++) {
      const randIndex = Math.floor(Math.random() * defaultWordlist.length);
      words.push(defaultWordlist[randIndex]);
    }
    return words.join(' ');
  }
}

// Normalize mnemonic (strip numbering, commas, newlines)
export function normalizeMnemonic(phrase: string): string {
  return phrase
    .replace(/[0-9]+\.\s*/g, ' ')
    .replace(/[,\n\r\t]/g, ' ')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
}

// Validate mnemonic phrase with forgiving TON/BIP-39 tolerance
export function isValidMnemonic(phrase: string): boolean {
  const normalized = normalizeMnemonic(phrase);
  const words = normalized.split(' ').filter(Boolean);
  if (words.length !== 12 && words.length !== 18 && words.length !== 24) return false;
  try {
    if (bip39.validateMnemonic(normalized)) return true;
  } catch {
    // tolerant fallback
  }
  return words.every(w => /^[a-z]+$/.test(w));
}
