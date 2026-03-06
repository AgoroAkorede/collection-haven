import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CardPrice {
  market: number;
  low: number;
  mid: number;
  high: number;
}

export interface CardData {
  id: string;
  name: string;
  supertype: string;
  subtypes: string[];
  hp?: string;
  types?: string[];
  set: {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    ptcgoCode?: string;
    releaseDate: string;
    updatedAt: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  artist?: string;
  rarity?: string;
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices?: {
      normal?: CardPrice;
      holofoil?: CardPrice;
      reverseHolofoil?: CardPrice;
      firstEditionHolofoil?: CardPrice;
      firstEditionNormal?: CardPrice;
    };
  };
}

export interface PurchaseHistory {
  id: string;
  date: string;
  price?: number;
  quantity: number;
}

export interface PortfolioItem {
  card: CardData;
  quantity: number;
  purchasePrice?: number;
  dateAdded: string;
  history?: PurchaseHistory[];
}

export interface User {
  id: string;
  email: string;
  name: string;
}

interface PortfolioState {
  user: User | null;
  setUser: (user: User | null) => void;
  items: PortfolioItem[];
  addItem: (card: CardData, quantity?: number, purchasePrice?: number) => void;
  removeItem: (cardId: string) => void;
  updateQuantity: (cardId: string, quantity: number) => void;
  getTotalValue: () => number;
}

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      items: [],
      addItem: (card, quantity = 1, purchasePrice) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.card.id === card.id);
          const newHistoryItem: PurchaseHistory = {
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
            price: purchasePrice,
            quantity,
          };

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.card.id === card.id
                  ? { 
                      ...item, 
                      quantity: item.quantity + quantity,
                      history: [...(item.history || []), newHistoryItem]
                    }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                card,
                quantity,
                purchasePrice,
                dateAdded: new Date().toISOString(),
                history: [newHistoryItem],
              },
            ],
          };
        });
      },
      removeItem: (cardId) => {
        set((state) => ({
          items: state.items.filter((item) => item.card.id !== cardId),
        }));
      },
      updateQuantity: (cardId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.card.id !== cardId),
            };
          }
          return {
            items: state.items.map((item) =>
              item.card.id === cardId ? { ...item, quantity } : item
            ),
          };
        });
      },
      getTotalValue: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const prices = item.card.tcgplayer?.prices;
          // Try to get the most relevant market price
          const marketPrice =
            prices?.holofoil?.market ||
            prices?.normal?.market ||
            prices?.reverseHolofoil?.market ||
            prices?.firstEditionHolofoil?.market ||
            prices?.firstEditionNormal?.market ||
            0;
          return total + marketPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: 'collectr-portfolio',
    }
  )
);
