import { useTranslation } from 'react-i18next';
import { useCustomQuotes } from './useCustomQuotes';

/**
 * Returns the motivational quote of the day, based on the current date and i18n quotes array.
 */
export function useDailyMotivation(): string {
    const { t } = useTranslation();
    const { quotes: customQuotes } = useCustomQuotes();
    // Get the quotes array from i18n (returns string[])
    const defaultQuotes = t('motivation.quotes', { returnObjects: true }) as string[];
    const allQuotes = [...defaultQuotes, ...customQuotes.map(q => q.text)];
    if (!Array.isArray(allQuotes) || allQuotes.length === 0) return '';
    // Use the day of the year to select a quote
    const today = new Date();
    const start = new Date(today.getFullYear(), 0, 0);
    const diff = today.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    const index = dayOfYear % allQuotes.length;
    return allQuotes[index];
}
