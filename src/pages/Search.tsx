import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchCards, getPopularCards } from '../api';
import { usePortfolioStore, CardData } from '../store';
import { Search as SearchIcon, Loader2, X, Camera, Star, SlidersHorizontal, Plus, ExternalLink } from 'lucide-react';

export function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { items, addItem } = usePortfolioStore();

  const handleAddCard = (e: React.MouseEvent, card: CardData) => {
    e.preventDefault(); // Prevent navigating to card details
    addItem(card, 1);
  };

  useEffect(() => {
    // Load popular cards on mount if no query
    if (!query) {
      setIsLoading(true);
      getPopularCards()
        .then((cards) => {
          setResults(cards);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError('Failed to load popular cards');
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        setIsLoading(true);
        setError(null);
        searchCards(query)
          .then((res) => {
            setResults(res.data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error(err);
            setError('Failed to search cards');
            setIsLoading(false);
          });
      } else if (query === '') {
        // Reset to popular if query is cleared
        setIsLoading(true);
        getPopularCards()
          .then((cards) => {
            setResults(cards);
            setIsLoading(false);
          })
          .catch(() => setIsLoading(false));
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraOpen) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
          // Only show alert if it's not a dismissal (which usually has name NotAllowedError or similar)
          if (err.name !== 'NotAllowedError' && err.name !== 'PermissionDeniedError') {
             alert(`Could not access camera: ${err.message || 'Unknown error'}. Please ensure permissions are granted.`);
          }
          setIsCameraOpen(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraOpen]);

  return (
    <div className="p-4 max-w-md mx-auto w-full h-full flex flex-col bg-black text-white font-sans">
      <div className="sticky top-0 z-10 bg-black pt-4 pb-2">
        {/* Search Bar Row */}
        <div className="flex items-center gap-3 mb-4">
          <button 
            onClick={() => setIsCameraOpen(true)}
            className="p-2 bg-zinc-900 rounded-full border border-zinc-800 transition-colors hover:bg-zinc-800"
          >
            <Camera className="w-5 h-5 text-zinc-300" />
          </button>
          
          <div className="relative flex-1">
            <input
              type="text"
              className="block w-full pl-4 pr-10 py-2.5 border border-zinc-800 rounded-full leading-5 bg-zinc-900 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 sm:text-sm transition-all"
              placeholder="Search for products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300"
                onClick={() => setQuery('')}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <button className="p-2 text-zinc-300">
            <Star className="w-5 h-5" />
          </button>
          <button className="p-2 text-zinc-300 bg-zinc-900 rounded-full border border-zinc-800">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Adding To Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-bold">
            Adding to: <span className="text-emerald-400">Main</span>
          </div>
          <button className="text-xs font-medium bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
            Show Sets
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full text-xs font-medium">
            <div className="relative w-3 h-3 bg-red-500 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700">
              <div className="w-full h-1/2 bg-white absolute bottom-0"></div>
              <div className="w-1 h-1 bg-black rounded-full z-10"></div>
            </div>
            Pokemon
            <X className="w-3 h-3 ml-1 text-zinc-500" />
          </div>
        </div>

        {/* Promo Banner */}
        <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/50 flex items-center gap-4 mb-2">
          <div className="w-16 h-12 flex-shrink-0 flex items-center justify-center">
             <img src="https://images.pokemontcg.io/sv3pt5/logo.png" className="w-full h-full object-contain" alt="Promo" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-bold mb-1 uppercase text-zinc-200">Get Your First Pack Free</div>
            <div className="text-[10px] text-zinc-400 leading-tight">
              Get Fanatics Live + join a stream for a pack with a graded or authenticated sports or Pokemon card.
            </div>
          </div>
          <button className="p-2 rounded-full border border-zinc-800 text-emerald-400">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-2 hide-scrollbar">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center text-red-400 p-4">{error}</div>
        ) : results.length === 0 ? (
          <div className="text-center text-zinc-500 p-8">No cards found for "{query}"</div>
        ) : (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {results.map((card) => {
              const prices = card.tcgplayer?.prices;
              const marketPrice =
                prices?.holofoil?.market ||
                prices?.normal?.market ||
                prices?.reverseHolofoil?.market ||
                prices?.firstEditionHolofoil?.market ||
                prices?.firstEditionNormal?.market ||
                0;

              // Mock price change
              const changeAmt = marketPrice * 0.0597;
              const isPositive = card.id.includes('6') || card.id.includes('4'); // just randomizing positive/negative
              
              const portfolioItem = items.find(i => i.card.id === card.id);
              const qty = portfolioItem?.quantity || 0;

              return (
                <Link
                  key={card.id}
                  to={`/card/${card.id}`}
                  className="bg-black rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col group"
                >
                  <div className="relative aspect-square p-4 bg-zinc-900 flex items-center justify-center">
                    <img
                      src={card.images.small}
                      alt={card.name}
                      className="w-full h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-zinc-100 leading-tight mb-1" title={card.name}>
                        {card.name}
                      </h3>
                      <p className="text-[10px] text-zinc-400 truncate">{card.set.name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{card.rarity || 'Sealed'}</p>
                    </div>
                    
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-sm font-medium text-zinc-200">
                          {marketPrice > 0 ? `$${marketPrice.toFixed(2)}` : 'N/A'}
                        </div>
                        {marketPrice > 0 && (
                          <div className={`text-[10px] ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                            {isPositive ? '+' : '-'}${changeAmt.toFixed(2)} ({isPositive ? '+' : '-'}{(5.97).toFixed(2)}%)
                          </div>
                        )}
                        <div className="text-[10px] text-zinc-500 mt-1">
                          Qty: {qty}
                        </div>
                      </div>
                      
                      <button 
                        onClick={(e) => handleAddCard(e, card)}
                        className="p-1.5 rounded-full border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Camera Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          <div className="flex items-center justify-between p-4 bg-black/50 absolute top-0 w-full z-10">
            <h2 className="text-white font-semibold">Scan Card</h2>
            <button 
              onClick={() => setIsCameraOpen(false)} 
              className="p-2 bg-zinc-800 rounded-full text-white hover:bg-zinc-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 relative flex items-center justify-center bg-zinc-900 overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="absolute min-w-full min-h-full object-cover"
            />
            {/* Overlay guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
              <div className="w-full max-w-sm aspect-[63/88] border-2 border-emerald-500/50 rounded-xl relative">
                {/* Corner markers */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
              </div>
            </div>
          </div>
          <div className="p-6 bg-black pb-safe flex justify-center items-center">
            <button
              onClick={() => {
                // Simulate scanning a card
                setQuery('Charizard');
                setIsCameraOpen(false);
              }}
              className="w-16 h-16 rounded-full bg-white border-4 border-zinc-400 flex items-center justify-center hover:bg-zinc-200 transition-colors"
            >
              <div className="w-14 h-14 rounded-full border-2 border-black"></div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
