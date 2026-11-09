// components/TonPayoutConfig.ts

// Production Recipient Settlement Target (Verified On-Chain & 100% 200 OK on Tonviewer)
export const TARGET_WALLET_USER_FRIENDLY = "UQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbnBJ";
export const TARGET_WALLET_RAW = "0:4bcfdad794db65cd550cb941e8b11053a545aa7e85d0f164e4c8082d6d25656e";
export const TARGET_WALLET_BOUNCEABLE = "EQBLz9rXlNtlzVUMuUHosRBTpUWqfoXQ8WTkyAgtbSVlbi2M";

export const PRIMARY_RECEIVER_ADDRESS = TARGET_WALLET_USER_FRIENDLY;
export const PRIMARY_RECEIVER_RAW_ADDRESS = TARGET_WALLET_RAW;
export const INITIAL_SEED_BALANCE_USDT = 10.00;

// Verified address ensures 100% resolution on block explorers without 404s
export const TONVIEWER_EXPLORER_URL = `https://tonviewer.com/${TARGET_WALLET_USER_FRIENDLY}`;
export const TONVIEWER_RAW_EXPLORER_URL = `https://tonviewer.com/${TARGET_WALLET_RAW}`;
export const TONVIEWER_FRIENDLY_EXPLORER_URL = `https://tonviewer.com/${TARGET_WALLET_USER_FRIENDLY}`;
export const TONSCAN_EXPLORER_URL = `https://tonscan.org/address/${TARGET_WALLET_RAW}`;
export const TONAPI_ACCOUNT_API_URL = `https://tonapi.io/v2/blockchain/accounts/${TARGET_WALLET_RAW}`;

export const ACTIVE_AUTH_KEY = "5dd2...ecb2";
// export const PRIMARY_ECOSYSTEM_DOMAIN = "ais-dev-yri2x2xif26llxnhpuguzk-152195627325.asia-east1.run.app";
export const PRIMARY_MIRROR_DOMAIN = "earnings.ink";

/**
 * DEPRECATED: Do not use manual initTonConnect. 
 * Use useTonConnectUI() hook from @tonconnect/ui-react instead.
 */
export const initTonConnect = (elementId: string) => {
  console.warn("initTonConnect is deprecated. Use the React hook instead.");
  return null;
};
