import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolioStore, CardData, PortfolioItem } from '../store';
import { TrendingUp, TrendingDown, Plus, Search as SearchIcon, History, X, Filter } from 'lucide-react';

export function Portfolio() {
  const { items, getTotalValue } = usePortfolioStore();
  const totalValue = getTotalValue();
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const [sortBy, setSortBy] = useState('name-asc');
  const [filterSet, setFilterSet] = useState('');
  const [filterRarity, setFilterRarity] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Mock a 24h change for visual flair
  const change24h = totalValue * 0.024; // 2.4% up
  const isPositive = change24h >= 0;

  // Extract unique sets and rarities
  const uniqueSets = useMemo(() => Array.from(new Set(items.map(item => item.card.set.name))).sort(), [items]);
  const uniqueRarities = useMemo(() => Array.from(new Set(items.map(item => item.card.rarity).filter(Boolean))).sort(), [items]);

  // Helper to get market price
  const getMarketPrice = (item: PortfolioItem) => {
    const prices = item.card.tcgplayer?.prices;
    return prices?.holofoil?.market ||
      prices?.normal?.market ||
      prices?.reverseHolofoil?.market ||
      prices?.firstEditionHolofoil?.market ||
      prices?.firstEditionNormal?.market ||
      0;
  };

  // Helper to get average purchase price
  const getAvgPurchasePrice = (item: PortfolioItem) => {
    if (item.history && item.history.length > 0) {
      const totalCost = item.history.reduce((sum, h) => sum + ((h.price || 0) * h.quantity), 0);
      const totalQty = item.history.reduce((sum, h) => sum + h.quantity, 0);
      return totalQty > 0 ? totalCost / totalQty : 0;
    }
    return item.purchasePrice || 0;
  };

  // Filter and sort items
  const processedItems = useMemo(() => {
    return items
      .filter(item => {
        if (filterSet && item.card.set.name !== filterSet) return false;
        if (filterRarity && item.card.rarity !== filterRarity) return false;
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name-asc':
            return a.card.name.localeCompare(b.card.name);
          case 'name-desc':
            return b.card.name.localeCompare(a.card.name);
          case 'purchase-asc':
            return getAvgPurchasePrice(a) - getAvgPurchasePrice(b);
          case 'purchase-desc':
            return getAvgPurchasePrice(b) - getAvgPurchasePrice(a);
          case 'market-asc':
            return getMarketPrice(a) - getMarketPrice(b);
          case 'market-desc':
            return getMarketPrice(b) - getMarketPrice(a);
          default:
            return 0;
        }
      });
  }, [items, sortBy, filterSet, filterRarity]);

  return (
    <div className="p-4 max-w-md mx-auto w-full pb-24">
      <header className="py-6">
        <h1 className="text-zinc-400 text-sm font-medium uppercase tracking-wider mb-2">Total Value</h1>
        <div className="flex items-end gap-3">
          <span className="text-4xl font-bold tracking-tight text-white">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          {totalValue > 0 && (
            <div className={`flex items-center text-sm font-medium mb-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
              <span>${Math.abs(change24h).toFixed(2)} (2.4%)</span>
            </div>
          )}
        </div>
      </header>

      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-100">Your Collection</h2>
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-sm">{processedItems.length} cards</span>
            {items.length > 0 && (
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`p-1.5 rounded-md border transition-colors ${showFilters ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
              >
                <Filter className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {showFilters && items.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4 space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Sort By</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="market-desc">Market Value (High-Low)</option>
                <option value="market-asc">Market Value (Low-High)</option>
                <option value="purchase-desc">Purchase Price (High-Low)</option>
                <option value="purchase-asc">Purchase Price (Low-High)</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Set</label>
                <select 
                  value={filterSet} 
                  onChange={(e) => setFilterSet(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">All Sets</option>
                  {uniqueSets.map(set => (
                    <option key={set} value={set}>{set}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Rarity</label>
                <select 
                  value={filterRarity} 
                  onChange={(e) => setFilterRarity(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="">All Rarities</option>
                  {uniqueRarities.map(rarity => (
                    <option key={rarity as string} value={rarity as string}>{rarity}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-8 text-center border border-zinc-800 flex flex-col items-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <SearchIcon className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-zinc-100 font-medium mb-2">No cards yet</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Start building your portfolio by searching for your favorite cards.
            </p>
            <Link
              to="/search"
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-semibold py-2 px-6 rounded-full transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Cards
            </Link>
          </div>
        ) : processedItems.length === 0 ? (
          <div className="bg-zinc-900 rounded-2xl p-8 text-center border border-zinc-800 flex flex-col items-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
              <Filter className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-zinc-100 font-medium mb-2">No matches found</h3>
            <p className="text-zinc-400 text-sm mb-6">
              Try adjusting your filters to see more cards.
            </p>
            <button
              onClick={() => {
                setFilterSet('');
                setFilterRarity('');
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-2 px-6 rounded-full transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {processedItems.map((item) => {
              const prices = item.card.tcgplayer?.prices;
              const marketPrice =
                prices?.holofoil?.market ||
                prices?.normal?.market ||
                prices?.reverseHolofoil?.market ||
                prices?.firstEditionHolofoil?.market ||
                prices?.firstEditionNormal?.market ||
                0;

              // Generate a stable mock percentage change based on card ID
              const hash = item.card.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const mockChange = ((hash % 100) / 10) - 5; // Range: -5.0 to +4.9
              const isPositiveChange = mockChange >= 0;

              return (
                <div
                  key={item.card.id}
                  className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col relative"
                >
                  <Link to={`/card/${item.card.id}`} className="block relative aspect-[63/88] p-2 bg-zinc-950/50">
                    <img
                      src={item.card.images.small}
                      alt={item.card.name}
                      className="w-full h-full object-contain drop-shadow-lg"
                      loading="lazy"
                    />
                    {item.quantity > 1 && (
                      <div className="absolute top-3 right-3 bg-zinc-900/90 backdrop-blur-sm text-zinc-100 text-xs font-bold px-2 py-1 rounded-md border border-zinc-700">
                        x{item.quantity}
                      </div>
                    )}
                  </Link>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-100 truncate" title={item.card.name}>
                        {item.card.name}
                      </h3>
                      <p className="text-xs text-zinc-500 truncate">{item.card.set.name}</p>
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-500">Market</span>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-zinc-100">
                            ${marketPrice.toFixed(2)}
                          </div>
                          <div className={`text-[10px] font-medium flex items-center justify-end mt-0.5 ${isPositiveChange ? 'text-emerald-400' : 'text-red-400'}`}>
                            {isPositiveChange ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                            {Math.abs(mockChange).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1 pt-2 border-t border-zinc-800">
                        <button 
                          onClick={() => setSelectedItem(item)}
                          className="text-xs flex items-center gap-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                          <History className="w-3 h-3" />
                          History
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-semibold text-zinc-100">Purchase History</h3>
              <button 
                onClick={() => setSelectedItem(null)}
                className="p-1 text-zinc-400 hover:text-white rounded-full hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-3 mb-6">
                <img src={selectedItem.card.images.small} alt={selectedItem.card.name} className="w-12 h-16 object-contain" />
                <div>
                  <div className="font-medium text-zinc-100">{selectedItem.card.name}</div>
                  <div className="text-xs text-zinc-500">Total Qty: {selectedItem.quantity}</div>
                </div>
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 hide-scrollbar">
                {selectedItem.history && selectedItem.history.length > 0 ? (
                  selectedItem.history.map((hist) => (
                    <div key={hist.id} className="flex items-center justify-between p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                      <div>
                        <div className="text-sm text-zinc-200">{new Date(hist.date).toLocaleDateString()}</div>
                        <div className="text-xs text-zinc-500 mt-0.5">Qty: {hist.quantity}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-emerald-400">
                          {hist.price !== undefined && hist.price !== null && !isNaN(hist.price) 
                            ? `$${hist.price.toFixed(2)}` 
                            : 'N/A'}
                        </div>
                        <div className="text-[10px] text-zinc-500">per card</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-zinc-500 py-4 text-sm">
                    No purchase history available.
                    {selectedItem.purchasePrice !== undefined && (
                      <div className="mt-2 text-zinc-400">
                        Legacy purchase price: ${selectedItem.purchasePrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
