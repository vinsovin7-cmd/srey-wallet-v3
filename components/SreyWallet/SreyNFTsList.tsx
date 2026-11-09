import React from 'react';
import { Sparkles, ExternalLink, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { SreyNFT } from './sreyWalletStore';

interface SreyNFTsListProps {
  nfts: SreyNFT[];
  onSelectNFT: (nft: SreyNFT) => void;
  onOpenMarketplace?: () => void;
}

export const SreyNFTsList: React.FC<SreyNFTsListProps> = ({
  nfts,
  onSelectNFT,
  onOpenMarketplace
}) => {
  return (
    <div className="w-full space-y-4">
      {/* Featured Collection Header */}
      <div className="p-4 bg-gradient-to-r from-[#141a2b] via-[#101424] to-[#0d101c] rounded-2xl border border-stone-800 flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold">
            <Sparkles size={13} />
            <span>SREY DIGITAL COLLECTIBLES</span>
          </div>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Telegram Collectibles & Sovereign Passes
          </h4>
        </div>
        <button
          type="button"
          onClick={onOpenMarketplace}
          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono flex items-center gap-1 transition cursor-pointer"
        >
          <span>Get Pass</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* NFT Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {nfts.map((nft) => (
          <div
            key={nft.id}
            onClick={() => onSelectNFT(nft)}
            className="bg-[#0d111c] border border-stone-800 rounded-2xl overflow-hidden hover:border-amber-500/50 transition-all cursor-pointer group shadow-lg flex flex-col"
          >
            {/* Image Preview */}
            <div className="relative aspect-video w-full overflow-hidden bg-stone-900">
              <img
                src={nft.image}
                alt={nft.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur text-[10px] font-mono text-amber-300 border border-amber-500/40 font-bold">
                {nft.rarity || 'Verified'}
              </span>
            </div>

            {/* Info */}
            <div className="p-3 space-y-1.5">
              <div className="text-[10px] font-mono text-stone-400 truncate">
                {nft.collection}
              </div>
              <div className="font-bold text-xs text-white truncate group-hover:text-amber-300 transition">
                {nft.name}
              </div>
              <div className="flex items-center justify-between pt-1 text-xs font-mono">
                <span className="text-stone-500">Floor Price:</span>
                <span className="text-cyan-300 font-bold">{nft.floorPriceTon} TON</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
