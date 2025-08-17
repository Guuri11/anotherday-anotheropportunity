import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'customQuotes';

export type CustomQuote = {
  id: string;
  text: string;
};

export function useCustomQuotes() {
  const [quotes, setQuotes] = useState<CustomQuote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((data: string | null) => {
        if (data) setQuotes(JSON.parse(data));
      })
      .finally(() => setLoading(false));
  }, []);

  const saveQuotes = useCallback(async (newQuotes: CustomQuote[]) => {
    setQuotes(newQuotes);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newQuotes));
  }, []);

  const addQuote = useCallback(async (text: string) => {
    const newQuote = { id: Date.now().toString(), text };
    await saveQuotes([...quotes, newQuote]);
  }, [quotes, saveQuotes]);

  const editQuote = useCallback(async (id: string, text: string) => {
    await saveQuotes(quotes.map(q => q.id === id ? { ...q, text } : q));
  }, [quotes, saveQuotes]);

  const deleteQuote = useCallback(async (id: string) => {
    await saveQuotes(quotes.filter(q => q.id !== id));
  }, [quotes, saveQuotes]);

  return { quotes, loading, addQuote, editQuote, deleteQuote };
}
