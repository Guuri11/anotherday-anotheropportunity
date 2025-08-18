import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favoriteQuotes';

interface FavoriteQuotesState {
  favorites: string[];
  loading: boolean;
  loadFavorites: () => Promise<void>;
  addFavorite: (quote: string) => Promise<void>;
  removeFavorite: (quote: string) => Promise<void>;
  isFavorite: (quote: string) => boolean;
}

export const useFavoriteQuotesStore = create<FavoriteQuotesState>((set, get) => ({
  favorites: [],
  loading: true,
  loadFavorites: async () => {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    set({ favorites: data ? JSON.parse(data) : [], loading: false });
  },
  addFavorite: async (quote) => {
    const { favorites } = get();
    if (!favorites.includes(quote)) {
      const newFavorites = [...favorites, quote];
      set({ favorites: newFavorites });
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }
  },
  removeFavorite: async (quote) => {
    const { favorites } = get();
    const newFavorites = favorites.filter(q => q !== quote);
    set({ favorites: newFavorites });
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  },
  isFavorite: (quote) => get().favorites.includes(quote),
}));
