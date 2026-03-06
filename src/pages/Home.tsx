import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolioStore, CardData } from '../store';
import { getPopularCards } from '../api';
import { Eye, EyeOff, DollarSign, TrendingUp, X, Crown, Check } from 'lucide-react';

export function Home() {
  const { items, getTotalValue } = usePortfolioStore();
  const totalValue = getTotalValue();
  const [trending, setTrending] = useState<CardData[]>([]);
  const [hideBalance, setHideBalance] = useState(false);
  const [activeTimeline, setActiveTimeline] = useState('1M');
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    getPopularCards().then(setTrending).catch(console.error);
  }, []);

  // Find most valuable item
  const mostValuable = items.length > 0 
    ? [...items].sort((a, b) => {
        const priceA = (a.card.tcgplayer?.prices?.holofoil?.market || a.card.tcgplayer?.prices?.normal?.market || 0) * a.quantity;
        const priceB = (b.card.tcgplayer?.prices?.holofoil?.market || b.card.tcgplayer?.prices?.normal?.market || 0) * b.quantity;
        return priceB - priceA;
      })[0]
    : null;

  const mvPrice = mostValuable 
    ? (mostValuable.card.tcgplayer?.prices?.holofoil?.market || mostValuable.card.tcgplayer?.prices?.normal?.market || 0) * mostValuable.quantity
    : 0;

  const timelines = ['1D', '7D', '1M', '3M', '6M', 'MAX'];

  return (
    <div className="bg-black min-h-screen text-white pb-6 font-sans">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <div className="flex gap-4 text-sm font-medium">
          <div className="relative pb-2 text-white">
            Overview
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-400"></div>
          </div>
          <button onClick={() => setShowPaywall(true)} className="pb-2 text-zinc-500 flex items-center gap-1 hover:text-zinc-300 transition-colors">
            Performance <span className="bg-yellow-500 text-black text-[9px] font-bold px-1 rounded-sm">PRO</span>
          </button>
        </div>
        <div className="flex items-center gap-1 bg-zinc-900 rounded-full px-2 py-1 text-xs font-medium border border-zinc-800">
          <div className="bg-emerald-500 rounded-full p-0.5">
            <DollarSign className="w-3 h-3 text-black" strokeWidth={3} />
          </div>
          USD
        </div>
      </div>

      {/* Portfolio Value */}
      <div className="px-4 py-4">
        <div className="text-sm font-medium text-zinc-300 flex items-center gap-1">
          Portfolio <span className="text-emerald-400">Main</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <h1 className="text-4xl font-bold tracking-tight">
            {hideBalance ? '****' : `$${totalValue.toFixed(2)}`}
          </h1>
          <button 
            onClick={() => setHideBalance(!hideBalance)}
            className="bg-zinc-900 p-1.5 rounded-full hover:bg-zinc-800 transition-colors"
          >
            {hideBalance ? (
              <EyeOff className="w-4 h-4 text-zinc-500" />
            ) : (
              <Eye className="w-4 h-4 text-zinc-500" />
            )}
          </button>
        </div>
        <div className="text-emerald-400 text-sm font-medium mt-1">
          {hideBalance ? '****' : '+$0.00 in the last 30 days'}
        </div>
      </div>

      {/* Chart Area / Time Selector */}
      <div className="mt-4 border-t border-zinc-900 pt-4">
        <div className="flex justify-between items-center px-6 text-xs font-medium text-zinc-500">
          {timelines.map((time) => (
            <button
              key={time}
              onClick={() => {
                if (time === 'MAX') {
                  setShowPaywall(true);
                } else {
                  setActiveTimeline(time);
                }
              }}
              className={`transition-colors ${
                activeTimeline === time
                  ? 'bg-zinc-200 text-black px-3 py-1.5 rounded-full font-bold'
                  : 'hover:text-zinc-300 px-3 py-1.5'
              } ${time === 'MAX' ? 'flex flex-col items-center px-1' : ''}`}
            >
              <div>{time}</div>
              {time === 'MAX' && (
                <div className="bg-yellow-500 text-black text-[8px] font-bold px-1 rounded-sm mt-0.5">PRO</div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Most Valuable */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-bold mb-3 text-zinc-100">Most Valuable</h2>
        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/50">
          {mostValuable ? (
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium text-sm text-zinc-200">{mostValuable.card.name}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{mostValuable.card.set.name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium text-sm">${mvPrice.toFixed(2)}</div>
                <div className="text-xs text-red-400 mt-0.5">-0.00%</div>
              </div>
            </div>
          ) : (
            <div className="text-zinc-500 text-sm">No items in portfolio</div>
          )}
          <div className="mt-4 text-center border-t border-zinc-800 pt-3">
            <Link to="/portfolio" className="text-emerald-400 text-sm font-medium">View All</Link>
          </div>
        </div>
      </div>

      {/* Just For You */}
      <div className="mt-8">
        <h2 className="text-sm font-bold mb-3 px-4 text-zinc-100">Just For You</h2>
        <div className="flex overflow-x-auto gap-3 px-4 pb-4 snap-x hide-scrollbar">
          <div className="min-w-[280px] h-32 bg-gradient-to-br from-purple-900 to-black border border-purple-800/50 rounded-xl snap-center flex-shrink-0 relative overflow-hidden p-4 flex flex-col justify-center">
             <div className="text-xs font-bold text-white mb-1">FANATICS LIVE</div>
             <div className="text-xl font-black text-white leading-tight uppercase italic">Get Your First<br/>Pack Free</div>
             <div className="text-[8px] text-zinc-400 mt-2 max-w-[120px]">Graded or authenticated sports or Pokemon card inside.</div>
          </div>
          <div className="min-w-[280px] h-32 bg-gradient-to-br from-blue-900 to-black border border-blue-800/50 rounded-xl snap-center flex-shrink-0 relative overflow-hidden p-4 flex flex-col justify-center">
             <div className="text-xl font-black text-white leading-tight uppercase italic">Exclusive<br/>Giveaways</div>
          </div>
        </div>
      </div>

      {/* Trending Today */}
      <div className="mt-4 px-4">
        <h2 className="text-sm font-bold mb-3 text-zinc-100">Trending Today</h2>
        <div className="border border-zinc-800 rounded-xl divide-y divide-zinc-800 bg-zinc-950/50">
          {trending.slice(0, 3).map(card => {
            const price = card.tcgplayer?.prices?.holofoil?.market || card.tcgplayer?.prices?.normal?.market || 0;
            return (
              <Link key={card.id} to={`/card/${card.id}`} className="flex items-center p-3 gap-3">
                <div className="w-12 h-16 bg-zinc-900 rounded flex-shrink-0 p-1">
                  <img src={card.images.small} alt={card.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-zinc-200 truncate">{card.name} - {card.number}</div>
                  <div className="text-xs text-zinc-400 truncate mt-0.5">Pokemon • {card.set.name}</div>
                  <div className="text-xs text-zinc-500 truncate">{card.rarity || 'Promo'} • {card.number}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-medium text-sm flex items-center justify-end gap-1 text-emerald-400">
                    <TrendingUp className="w-3 h-3" />
                    ${price.toFixed(2)}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">${price.toFixed(2)} (0.00%)</div>
                </div>
              </Link>
            );
          })}
          <div className="p-3 text-center">
            <Link to="/search" className="text-emerald-400 text-sm font-medium">View All</Link>
          </div>
        </div>
      </div>

      {/* Collections */}
      <div className="mt-8 px-4">
        <h2 className="text-sm font-bold mb-3 text-zinc-100">Collections</h2>
        <div className="border border-zinc-800 rounded-xl p-4 flex items-center justify-between bg-zinc-950/50">
          <div className="flex items-center gap-3">
            <div className="w-14 h-10 bg-black border border-zinc-800 rounded flex items-center justify-center p-1">
              <img src="https://images.pokemontcg.io/base1/logo.png" className="w-full h-full object-contain" alt="Pokemon" />
            </div>
            <span className="font-medium text-sm text-zinc-200">Pokemon</span>
          </div>
          <div className="text-right">
            <div className="font-medium text-sm">${totalValue.toFixed(2)}</div>
            <div className="text-xs text-zinc-500 mt-0.5">$0.00 (0.00%)</div>
          </div>
        </div>
      </div>

      {/* Content Creators Corner */}
      <div className="mt-8 px-4 mb-4">
        <h2 className="text-sm font-bold mb-3 text-zinc-100">Content Creators Corner</h2>
        <div className="flex overflow-x-auto gap-3 pb-4 hide-scrollbar">
          <div className="min-w-[100px] border border-zinc-800 rounded-xl p-3 flex flex-col items-center bg-zinc-950/50">
            <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border-2 border-zinc-800">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=TCA" alt="TCA Gaming" className="w-full h-full bg-zinc-800" />
            </div>
            <div className="text-xs font-bold text-center truncate w-full">TCA Gaming</div>
            <div className="text-[10px] text-zinc-500">1.38K followers</div>
          </div>
          <div className="min-w-[100px] border border-zinc-800 rounded-xl p-3 flex flex-col items-center bg-zinc-950/50">
            <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border-2 border-zinc-800 relative">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Steve" alt="Steve Aoki" className="w-full h-full bg-zinc-800" />
            </div>
            <div className="text-xs font-bold text-center truncate w-full flex items-center justify-center gap-1">
              Steve Aoki <span className="text-yellow-500 text-[10px]">✓</span>
            </div>
            <div className="text-[10px] text-zinc-500">11.5K followers</div>
          </div>
          <div className="min-w-[100px] border border-zinc-800 rounded-xl p-3 flex flex-col items-center bg-zinc-950/50">
            <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center text-xl font-bold">
              :D
            </div>
            <div className="text-xs font-bold text-center truncate w-full flex items-center justify-center gap-1">
              Dubsy <span className="bg-yellow-500 text-black text-[8px] px-1 rounded-sm">PRO</span>
            </div>
            <div className="text-[10px] text-zinc-500">234 followers</div>
          </div>
          <div className="min-w-[100px] border border-zinc-800 rounded-xl p-3 flex flex-col items-center bg-zinc-950/50">
            <div className="w-12 h-12 rounded-full overflow-hidden mb-2 border-2 border-zinc-800">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa" alt="LisaCollects" className="w-full h-full bg-zinc-800" />
            </div>
            <div className="text-xs font-bold text-center truncate w-full">LisaCollects</div>
            <div className="text-[10px] text-zinc-500">5.11K followers</div>
          </div>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
            <button 
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                <Crown className="w-8 h-8 text-black" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Unlock PRO</h2>
              <p className="text-zinc-400 text-sm mb-6">
                Get access to all-time performance history, advanced portfolio analytics, and exclusive market insights.
              </p>

              <div className="space-y-3 mb-6 text-left bg-black/50 p-4 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="bg-emerald-500/20 p-1 rounded-full">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  MAX Timeline History
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="bg-emerald-500/20 p-1 rounded-full">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  Advanced Analytics
                </div>
                <div className="flex items-center gap-3 text-sm text-zinc-300">
                  <div className="bg-emerald-500/20 p-1 rounded-full">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  Priority Support
                </div>
              </div>

              <button
                onClick={() => setShowPaywall(false)}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-bold py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Upgrade for $4.99/mo
              </button>
              
              <button
                onClick={() => setShowPaywall(false)}
                className="mt-4 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
