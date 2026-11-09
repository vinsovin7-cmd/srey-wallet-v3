import React, { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import { SreyWalletHeader } from './SreyWalletHeader';
import { SreyBalanceCard } from './SreyBalanceCard';
import { SreyAssetsList } from './SreyAssetsList';
import { SreyNFTsList } from './SreyNFTsList';
import { SreyNavigationFooter } from './SreyNavigationFooter';
import { SreyHistoryView } from './SreyHistoryView';
import { SreySettingsView } from './SreySettingsView';
import { SreyWalletOnboarding } from './SreyWalletOnboarding';
import { SreySendModal } from './SreySendModal';
import { SreyReceiveModal } from './SreyReceiveModal';
import { SreySwapModal } from './SreySwapModal';
import { SreyMoreDrawer } from './SreyMoreDrawer';
import { SreyAccountSwitcherModal } from './SreyAccountSwitcherModal';
import { SreyTokenDetailsModal } from './SreyTokenDetailsModal';
import { TransakMoonPayOfframpModal } from '../TransakMoonPayOfframpModal';
import {
  SreyAccount,
  SreyToken,
  SreyNFT,
  SreyTransaction,
  INITIAL_SREY_TOKENS,
  INITIAL_SREY_NFTS,
  generate24WordMnemonic,
  deriveAddressesFromMnemonic
} from './sreyWalletStore';

interface SreyWalletAppProps {
  onClose?: () => void;
  isStandaloneFullscreen?: boolean;
}

export const SreyWalletApp: React.FC<SreyWalletAppProps> = ({
  onClose,
  isStandaloneFullscreen = false
}) => {
  // Telegram Mini App Initialization
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        (window as any).Telegram.WebApp.ready();
        (window as any).Telegram.WebApp.expand();
      }
      if (WebApp && typeof WebApp.ready === 'function') {
        WebApp.ready();
        WebApp.expand();
      }
    } catch {
      // Safe fallback outside TMA
    }
  }, []);

  // Accounts state with persistence
  const [accounts, setAccounts] = useState<SreyAccount[]>(() => {
    const saved = localStorage.getItem('srey_wallet_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });

  const [activeAccountId, setActiveAccountId] = useState<string>(() => {
    return localStorage.getItem('srey_active_account_id') || 'wallet-1';
  });

  const activeAccount = accounts.find((a) => a.id === activeAccountId) || accounts[0];

  // Token Balances & NFT state
  const [tokens, setTokens] = useState<SreyToken[]>(() => {
    const saved = localStorage.getItem('srey_tokens_state');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return INITIAL_SREY_TOKENS;
  });

  const [nfts, setNfts] = useState<SreyNFT[]>(INITIAL_SREY_NFTS);

  // Transactions History State
  const [transactions, setTransactions] = useState<SreyTransaction[]>(() => {
    const saved = localStorage.getItem('srey_tx_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'tx-init-1',
        type: 'RECEIVE',
        symbol: 'SREY',
        amount: 5000,
        fiatValueUsd: 9.0,
        recipientOrSender: 'Srey Genesis Airdrop Vault',
        txHash: '0x8f9a2c...b1e8',
        timestamp: Date.now() - 3600000 * 2,
        status: 'COMPLETED',
        network: 'TON Mainnet'
      }
    ];
  });

  // App Navigation & View States
  const [activeNavTab, setActiveNavTab] = useState<'wallet' | 'history' | 'settings'>('wallet');
  const [activeAssetTab, setActiveAssetTab] = useState<'tokens' | 'nft'>('tokens');
  const [fiatCurrency, setFiatCurrency] = useState<string>('USD');
  const [selectedNetwork, setSelectedNetwork] = useState<string>('TON Mainnet');

  // Modals & Drawers States
  const [modalOpen, setModalOpen] = useState<{
    send: boolean;
    receive: boolean;
    swap: boolean;
    more: boolean;
    accountSwitcher: boolean;
    tokenDetails: boolean;
    offramp: boolean;
    offrampMode: 'sell' | 'buy';
  }>({
    send: false,
    receive: false,
    swap: false,
    more: false,
    accountSwitcher: false,
    tokenDetails: false,
    offramp: false,
    offrampMode: 'sell'
  });

  const [selectedTokenForDetails, setSelectedTokenForDetails] = useState<SreyToken | null>(null);

  // Persist State Changes
  useEffect(() => {
    if (accounts.length > 0) {
      localStorage.setItem('srey_wallet_accounts', JSON.stringify(accounts));
      localStorage.setItem('srey_active_account_id', activeAccountId);
    }
  }, [accounts, activeAccountId]);

  useEffect(() => {
    localStorage.setItem('srey_tokens_state', JSON.stringify(tokens));
  }, [tokens]);

  useEffect(() => {
    localStorage.setItem('srey_tx_history', JSON.stringify(transactions));
  }, [transactions]);

  // Handle Onboarding Completion
  const handleOnboardingComplete = (newAccount: SreyAccount) => {
    setAccounts([newAccount]);
    setActiveAccountId(newAccount.id);
  };

  // Add new account
  const handleAddNewAccount = () => {
    const nextIndex = accounts.length + 1;
    const mnemonic = generate24WordMnemonic();
    const addresses = deriveAddressesFromMnemonic(mnemonic);
    const newAcc: SreyAccount = {
      id: `wallet-${nextIndex}`,
      name: `Wallet ${nextIndex}`,
      mnemonic: mnemonic,
      tonAddress: addresses.tonAddress,
      evmAddress: addresses.evmAddress,
      btcAddress: addresses.btcAddress,
      trxAddress: addresses.trxAddress,
      solAddress: addresses.solAddress,
      createdAt: Date.now(),
      isBackedUp: true
    };

    setAccounts((prev) => [...prev, newAcc]);
    setActiveAccountId(newAcc.id);
  };

  // Reset Wallet (Erase all data)
  const handleResetWallet = () => {
    localStorage.removeItem('srey_wallet_accounts');
    localStorage.removeItem('srey_active_account_id');
    localStorage.removeItem('srey_tokens_state');
    localStorage.removeItem('srey_tx_history');
    setAccounts([]);
    setActiveNavTab('wallet');
  };

  // Record Transaction & Update Token Balances
  const handleTransactionSuccess = (tx: SreyTransaction) => {
    setTransactions((prev) => [tx, ...prev]);

    // Update balances locally
    if (tx.type === 'SEND') {
      setTokens((prev) =>
        prev.map((t) => (t.symbol === tx.symbol ? { ...t, balance: Math.max(0, t.balance - tx.amount) } : t))
      );
    } else if (tx.type === 'RECEIVE') {
      setTokens((prev) =>
        prev.map((t) => (t.symbol === tx.symbol ? { ...t, balance: t.balance + tx.amount } : t))
      );
    }
  };

  // If no account exists, render the cryptographic Onboarding Flow!
  if (!activeAccount) {
    return <SreyWalletOnboarding onComplete={handleOnboardingComplete} onClose={onClose} />;
  }

  // Calculate Total Balance in USD
  const totalBalanceUsd = tokens.reduce((acc, t) => acc + t.balance * t.priceUsd, 0);
  const change24hUsd = 0.0;
  const change24hPct = 0.0;

  return (
    <div className="min-h-screen bg-[#07090E] text-white flex flex-col justify-between font-sans selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-5%] left-1/2 -translate-x-1/2 w-[350px] h-[250px] bg-gradient-to-b from-amber-500/10 via-cyan-500/5 to-transparent rounded-full blur-[90px]" />
      </div>

      {/* Top Header (Matching Screenshot 1 & 2) */}
      <SreyWalletHeader
        account={activeAccount}
        onOpenAccountSwitcher={() => setModalOpen((m) => ({ ...m, accountSwitcher: true }))}
        onOpenSettings={() => setActiveNavTab('settings')}
        onCloseApp={onClose}
        selectedNetwork={selectedNetwork}
        onOpenNetworkModal={() => setActiveNavTab('settings')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-3 space-y-4 relative z-10 overflow-y-auto">
        
        {/* VIEW 1: WALLET (Default Home View Matching Screenshot 2) */}
        {activeNavTab === 'wallet' && (
          <div className="space-y-4 animate-fade-in">
            
            {/* Total Balance Card */}
            <SreyBalanceCard
              totalBalanceUsd={totalBalanceUsd}
              change24hUsd={change24hUsd}
              change24hPct={change24hPct}
              fiatCurrency={fiatCurrency}
              onOpenCurrencySwitcher={() => setActiveNavTab('settings')}
              onOpenSwap={() => setModalOpen((m) => ({ ...m, swap: true }))}
              onOpenSend={() => setModalOpen((m) => ({ ...m, send: true }))}
              onOpenReceive={() => setModalOpen((m) => ({ ...m, receive: true }))}
              onOpenMore={() => setModalOpen((m) => ({ ...m, more: true }))}
            />

            {/* Segmented Assets Section (Tokens vs NFT) */}
            {activeAssetTab === 'tokens' ? (
              <SreyAssetsList
                tokens={tokens}
                activeTab={activeAssetTab}
                onTabChange={setActiveAssetTab}
                onSelectToken={(token) => {
                  setSelectedTokenForDetails(token);
                  setModalOpen((m) => ({ ...m, tokenDetails: true }));
                }}
                onOpenFilter={() => setModalOpen((m) => ({ ...m, more: true }))}
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveAssetTab('tokens')}
                    className="px-4 py-1.5 rounded-full text-xs font-bold text-stone-400 hover:text-white transition cursor-pointer"
                  >
                    Tokens
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveAssetTab('nft')}
                    className="px-4 py-1.5 rounded-full text-xs font-black bg-white text-stone-950 shadow-md transition cursor-pointer"
                  >
                    NFT
                  </button>
                </div>

                <SreyNFTsList
                  nfts={nfts}
                  onSelectNFT={() => setModalOpen((m) => ({ ...m, receive: true }))}
                  onOpenMarketplace={() => setModalOpen((m) => ({ ...m, more: true }))}
                />
              </div>
            )}

          </div>
        )}

        {/* VIEW 2: TRANSACTION HISTORY */}
        {activeNavTab === 'history' && (
          <SreyHistoryView
            transactions={transactions}
            onOpenExplorer={(hash) => window.open(`https://tonscan.org/tx/${hash}`, '_blank')}
          />
        )}

        {/* VIEW 3: SETTINGS & BACKUP */}
        {activeNavTab === 'settings' && (
          <SreySettingsView
            account={activeAccount}
            fiatCurrency={fiatCurrency}
            onCurrencyChange={setFiatCurrency}
            selectedNetwork={selectedNetwork}
            onNetworkChange={setSelectedNetwork}
            onResetWallet={handleResetWallet}
          />
        )}

      </main>

      {/* Bottom Navigation Footer (Matching Screenshot 2) */}
      <SreyNavigationFooter
        activeTab={activeNavTab}
        onSelectTab={setActiveNavTab}
      />

      {/* ========================================================= */}
      {/* INTERACTIVE MODALS & DRAWERS */}
      {/* ========================================================= */}

      {/* 1. SEND MODAL */}
      <SreySendModal
        isOpen={modalOpen.send}
        onClose={() => setModalOpen((m) => ({ ...m, send: false }))}
        tokens={tokens}
        defaultToken={selectedTokenForDetails || tokens[0]}
        onSendSuccess={handleTransactionSuccess}
      />

      {/* 2. RECEIVE MODAL */}
      <SreyReceiveModal
        isOpen={modalOpen.receive}
        onClose={() => setModalOpen((m) => ({ ...m, receive: false }))}
        account={activeAccount}
      />

      {/* 3. SWAP MODAL */}
      <SreySwapModal
        isOpen={modalOpen.swap}
        onClose={() => setModalOpen((m) => ({ ...m, swap: false }))}
        tokens={tokens}
        onSwapSuccess={handleTransactionSuccess}
      />

      {/* 4. MORE DRAWER */}
      <SreyMoreDrawer
        isOpen={modalOpen.more}
        onClose={() => setModalOpen((m) => ({ ...m, more: false }))}
        onLaunchBuy={() => setModalOpen((m) => ({ ...m, offramp: true, offrampMode: 'buy' }))}
        onLaunchOfframp={() => setModalOpen((m) => ({ ...m, offramp: true, offrampMode: 'sell' }))}
      />

      {/* 5. ACCOUNT SWITCHER MODAL */}
      <SreyAccountSwitcherModal
        isOpen={modalOpen.accountSwitcher}
        onClose={() => setModalOpen((m) => ({ ...m, accountSwitcher: false }))}
        accounts={accounts}
        activeAccountId={activeAccountId}
        onSelectAccount={(acc) => setActiveAccountId(acc.id)}
        onAddNewAccount={handleAddNewAccount}
      />

      {/* 6. TOKEN DETAILS MODAL */}
      <SreyTokenDetailsModal
        isOpen={modalOpen.tokenDetails}
        onClose={() => setModalOpen((m) => ({ ...m, tokenDetails: false }))}
        token={selectedTokenForDetails}
        onOpenSend={(t) => {
          setSelectedTokenForDetails(t);
          setModalOpen((m) => ({ ...m, send: true }));
        }}
        onOpenReceive={() => setModalOpen((m) => ({ ...m, receive: true }))}
        onOpenSwap={(t) => {
          setSelectedTokenForDetails(t);
          setModalOpen((m) => ({ ...m, swap: true }));
        }}
      />

      {/* 7. TRANSAK / MOONPAY REAL OFF-RAMP & ON-RAMP MODAL */}
      <TransakMoonPayOfframpModal
        isOpen={modalOpen.offramp}
        onClose={() => setModalOpen((m) => ({ ...m, offramp: false }))}
        defaultProvider="transak"
        defaultMode={modalOpen.offrampMode}
        cryptoCurrency="USDT"
        walletAddress={activeAccount.tonAddress}
        defaultAmount={100}
      />

    </div>
  );
};
