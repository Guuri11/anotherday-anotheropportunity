import { useTranslation } from 'react-i18next';

/**
 * Returns the motivational quote of the day, based on the current date and i18n quotes array.
 */
export function useDailyMotivation(): string {
  const { t } = useTranslation();
  // Get the quotes array from i18n (returns string[])
  const quotes = t('motivation.quotes', { returnObjects: true }) as string[];
  if (!Array.isArray(quotes) || quotes.length === 0) return '';
  // Use the day of the year to select a quote
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = dayOfYear % quotes.length;
  return quotes[index];
}
