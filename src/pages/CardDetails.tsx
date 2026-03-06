import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCard } from '../api';
import { usePortfolioStore, CardData } from '../store';
import { ArrowLeft, Plus, Minus, Check, Loader2, TrendingUp, ExternalLink } from 'lucide-react';

export function CardDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [purchasePriceInput, setPurchasePriceInput] = useState('');

  const { items, addItem, updateQuantity, removeItem } = usePortfolioStore();
  const portfolioItem = items.find((item) => item.card.id === id);
  const quantity = portfolioItem?.quantity || 0;

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getCard(id)
        .then((data) => {
          setCard(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load card details');
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-zinc-950">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (error || !card) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-zinc-950 text-zinc-100 p-4 text-center">
        <p className="text-red-400 mb-4">{error || 'Card not found'}</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-zinc-800 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const prices = card.tcgplayer?.prices;
  const marketPrice =
    prices?.holofoil?.market ||
    prices?.normal?.market ||
    prices?.reverseHolofoil?.market ||
    prices?.firstEditionHolofoil?.market ||
    prices?.firstEditionNormal?.market ||
    0;

  const handleRemove = () => {
    if (quantity > 1) {
      updateQuantity(card.id, quantity - 1);
    } else if (quantity === 1) {
      removeItem(card.id);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-zinc-400 hover:text-zinc-100 transition-colors rounded-full hover:bg-zinc-800"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-sm font-semibold truncate max-w-[200px]">{card.name}</h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </div>

      <div className="max-w-md mx-auto w-full p-4">
        {/* Card Image */}
        <div className="relative aspect-[63/88] w-full max-w-[300px] mx-auto mb-8 perspective-1000">
          <img
            src={card.images.large}
            alt={card.name}
            className="w-full h-full object-contain drop-shadow-2xl rounded-xl"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.1)',
            }}
          />
        </div>

        {/* Title & Set */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-1">{card.name}</h2>
          <div className="flex items-center justify-center gap-2 text-zinc-400 text-sm">
            <span>{card.set.name}</span>
            <span>•</span>
            <span>{card.number}/{card.set.printedTotal}</span>
            <span>•</span>
            <span>{card.rarity || 'Common'}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider mb-1">Market Price</p>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-emerald-400">
                  {marketPrice > 0 ? `$${marketPrice.toFixed(2)}` : 'N/A'}
                </span>
              </div>
            </div>
            
            {card.tcgplayer?.url && (
              <a
                href={card.tcgplayer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-zinc-300 transition-colors p-2 rounded-full hover:bg-zinc-800"
                title="View on TCGPlayer"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </div>

          <div className="flex flex-col pt-4 border-t border-zinc-800">
            <div className="mb-4">
              <label className="block text-xs text-zinc-500 mb-1">Purchase Price ($) - Optional</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={purchasePriceInput}
                onChange={(e) => setPurchasePriceInput(e.target.value)}
                placeholder="0.00"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-zinc-300">
                In Portfolio: <span className="text-white font-bold">{quantity}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRemove}
                  disabled={quantity === 0}
                  className={`p-2 rounded-full transition-colors ${
                    quantity > 0
                      ? 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700'
                      : 'bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed'
                  }`}
                >
                  <Minus className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => {
                    const price = parseFloat(purchasePriceInput);
                    addItem(card, 1, isNaN(price) ? undefined : price);
                    setPurchasePriceInput('');
                  }}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-semibold transition-colors ${
                    quantity > 0
                      ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/50'
                      : 'bg-emerald-500 text-zinc-950 hover:bg-emerald-600'
                  }`}
                >
                  {quantity > 0 ? (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Another
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add to Portfolio
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-zinc-100 mb-3">Card Details</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <p className="text-zinc-500 text-xs mb-1">Supertype</p>
              <p className="text-zinc-200 text-sm font-medium">{card.supertype}</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
              <p className="text-zinc-500 text-xs mb-1">Subtypes</p>
              <p className="text-zinc-200 text-sm font-medium">{card.subtypes?.join(', ') || 'None'}</p>
            </div>
            {card.hp && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <p className="text-zinc-500 text-xs mb-1">HP</p>
                <p className="text-zinc-200 text-sm font-medium">{card.hp}</p>
              </div>
            )}
            {card.types && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">
                <p className="text-zinc-500 text-xs mb-1">Types</p>
                <p className="text-zinc-200 text-sm font-medium">{card.types.join(', ')}</p>
              </div>
            )}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 col-span-2">
              <p className="text-zinc-500 text-xs mb-1">Artist</p>
              <p className="text-zinc-200 text-sm font-medium">{card.artist || 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
