import { CardData } from './store';

// Mock data fallback in case the API is down or blocked
const MOCK_CARDS: CardData[] = [];

export async function searchCards(query: string, page = 1, pageSize = 20): Promise<{ data: CardData[], totalCount: number }> {
  try {
    const response = await fetch('https://c81a437a-3b1d-4af8-97ce-870719d33c4c.mock.pstmn.io/cards');
    if (!response.ok) {
      throw new Error('Failed to fetch cards');
    }
    
    const rawData = await response.json();
    
    // Map rawData to CardData
    const mapped: CardData[] = rawData.map((item: any, index: number) => ({
      id: `mock-${index}-${item.name.replace(/[^a-zA-Z0-9]/g, '')}`,
      name: item.name,
      supertype: 'Pokémon',
      subtypes: [],
      hp: '100',
      types: ['Colorless'],
      set: {
        id: 'mock',
        name: 'Mock Set',
        series: 'Mock Series',
        printedTotal: 100,
        total: 100,
        releaseDate: '2024/01/01',
        updatedAt: '2024/01/01',
        images: { symbol: '', logo: '' }
      },
      number: String(index + 1),
      artist: item.desc,
      rarity: 'Rare',
      images: {
        small: item.img || item.images?.[0] || '',
        large: item.img || item.images?.[0] || '',
      },
      tcgplayer: {
        url: item.url,
        updatedAt: '2024/01/01',
        prices: {
          holofoil: { market: Math.random() * 100, low: 10, mid: 50, high: 100 }
        }
      }
    }));

    const filtered = query 
      ? mapped.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
      : mapped;

    return {
      data: filtered,
      totalCount: filtered.length
    };
  } catch (error) {
    console.warn('API fetch failed:', error);
    return {
      data: [],
      totalCount: 0
    };
  }
}

export async function getCard(id: string): Promise<CardData> {
  const { data } = await searchCards('');
  const card = data.find(c => c.id === id);
  if (!card) throw new Error('Card not found');
  return card;
}

export async function getPopularCards(): Promise<CardData[]> {
  const { data } = await searchCards('');
  return data;
}
