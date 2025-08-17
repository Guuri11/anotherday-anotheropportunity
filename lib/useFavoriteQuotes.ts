import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = 'favoriteQuotes';

export function useFavoriteQuotes() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(FAVORITES_KEY)
      .then((data: string | null) => {
        if (data) setFavorites(JSON.parse(data));
      })
      .finally(() => setLoading(false));
  }, []);

  const saveFavorites = useCallback(async (newFavorites: string[]) => {
    setFavorites(newFavorites);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }, []);

  const addFavorite = useCallback(async (quote: string) => {
    if (!favorites.includes(quote)) {
      await saveFavorites([...favorites, quote]);
    }
  }, [favorites, saveFavorites]);

  const removeFavorite = useCallback(async (quote: string) => {
    await saveFavorites(favorites.filter(q => q !== quote));
  }, [favorites, saveFavorites]);

  const isFavorite = useCallback((quote: string) => favorites.includes(quote), [favorites]);

  return { favorites, loading, addFavorite, removeFavorite, isFavorite };
}
