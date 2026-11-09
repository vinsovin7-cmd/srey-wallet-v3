# EXECUTIVE SREYMARA ECOSYSTEM - PRODUCTION DEPLOYMENT GUIDE

Welcome to your fully built Web3, TON, Telegram Mini App (TMA), and AI Ecosystem codebase!

## 🚀 Quick Start (Local Development)

1. **Prerequisites**: Ensure you have Node.js (v18+ recommended) installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in any optional production keys (e.g., `MASTER_WALLET_MNEMONIC` if you want authentic on-chain hot wallet transfers):
   ```bash
   cp .env.example .env
   ```
4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000`.

---

## 📦 Production Build & Deployment (Vercel, Render, Railway, or VPS)

1. **Build Project**:
   ```bash
   npm run build
   ```
2. **Start Production Server**:
   ```bash
   npm start
   ```

### Deploying to Vercel:
This repository includes `vercel.json` configured for full-stack Node.js & React Vite SPA support.
1. Push this repository to GitHub.
2. Import the repository on Vercel.
3. Vercel will automatically build and deploy your app.

### Deploying to Railway / Render / VPS:
1. Connect your GitHub repository.
2. Set Build Command: `npm install && npm run build`
3. Set Start Command: `npm start`
4. Set Node Version: `18` or `20`

---

## 🛡️ Architecture Highlights
- **Backend Vault (`server.ts`)**: Express server managing TON Connect endpoints, Telegram earnings streams, and simulated/authentic on-chain transactions via `@ton/ton` and Orbs high-throughput RPC gateways.
- **Frontend SPA (`src/App.tsx`)**: React + Tailwind CSS dark-glass executive matrix with Tonkeeper wallet connect, 11 ecosystem modules, AdsGram & Monetag monetization, and real-time yield compounding.
