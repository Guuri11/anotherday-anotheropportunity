import { useEffect } from 'react';
import { useFavoriteQuotesStore } from './favoriteQuotesStore';

export function useFavoriteQuotes() {
  const { favorites, loading, loadFavorites, addFavorite, removeFavorite, isFavorite } = useFavoriteQuotesStore();
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  return { favorites, loading, addFavorite, removeFavorite, isFavorite };
}
