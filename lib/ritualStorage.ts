import AsyncStorage from '@react-native-async-storage/async-storage';

export type RitualGoal = { text: string; completed: boolean };
export type RitualData = {
  date: string; // YYYY-MM-DD
  goals: RitualGoal[];
  reflection: string;
};

const RITUAL_KEY_PREFIX = 'ritual:';

export async function saveRitualData(data: RitualData) {
  const key = `${RITUAL_KEY_PREFIX}${data.date}`;
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function getRitualData(date: string): Promise<RitualData | null> {
  const key = `${RITUAL_KEY_PREFIX}${date}`;
  const value = await AsyncStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export async function getRitualHistory(): Promise<RitualData[]> {
  const keys = await AsyncStorage.getAllKeys();
  const ritualKeys = keys.filter(k => k.startsWith(RITUAL_KEY_PREFIX));
  const items = await AsyncStorage.multiGet(ritualKeys);
  return items
    .map(([, v]) => (v ? JSON.parse(v) : null))
    .filter(Boolean);
}
