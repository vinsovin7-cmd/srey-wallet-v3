import React, { useState, useEffect } from "react";
import GoogleAccountChooser, { GoogleAccount, INITIAL_GOOGLE_ACCOUNTS } from "./GoogleAccountChooser";
import GoogleGeminiApp from "./GoogleGeminiApp";

export const GoogleGeminiEcosystemSuite: React.FC = () => {
  const [activeAccount, setActiveAccount] = useState<GoogleAccount | null>(() => {
    try {
      const saved = localStorage.getItem("google_gemini_active_account");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Error reading active Google account:", e);
    }
    // Default to NDUNAKA PROSPER CHINEMEREM (kansasnelly@gmail.com) if available
    return INITIAL_GOOGLE_ACCOUNTS[2] || null;
  });

  const [isChoosingAccount, setIsChoosingAccount] = useState<boolean>(false);

  // Sync active account
  useEffect(() => {
    if (activeAccount) {
      localStorage.setItem("google_gemini_active_account", JSON.stringify(activeAccount));
    } else {
      localStorage.removeItem("google_gemini_active_account");
    }
  }, [activeAccount]);

  const handleAccountAuthenticated = (account: GoogleAccount) => {
    setActiveAccount(account);
    setIsChoosingAccount(false);
  };

  const handleSwitchAccount = () => {
    setIsChoosingAccount(true);
  };

  const handleSignOut = () => {
    if (activeAccount) {
      setActiveAccount({ ...activeAccount, signedIn: false });
    }
    setIsChoosingAccount(true);
  };

  if (!activeAccount || isChoosingAccount) {
    return (
      <div className="w-full min-h-screen bg-[#F0F4F9]">
        <GoogleAccountChooser 
          onAccountAuthenticated={handleAccountAuthenticated}
          onCancel={() => {
            if (activeAccount) setIsChoosingAccount(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#131314]">
      <GoogleGeminiApp
        currentAccount={activeAccount}
        onSwitchAccount={handleSwitchAccount}
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default GoogleGeminiEcosystemSuite;
