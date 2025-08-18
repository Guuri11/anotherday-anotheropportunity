import { Tabs } from 'expo-router';
import { Check } from '~/lib/icons/Check';
import { useTranslation } from 'react-i18next';
import * as React from 'react';
import { Dumbbell, Heart } from 'lucide-react-native';
import { useColorScheme } from '~/lib/useColorScheme';

export default function TabLayout() {
  const { t } = useTranslation();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: isDark ? '#fff' : '#222',
        tabBarStyle: {
          backgroundColor: isDark ? '#000' : '#fff',
          borderTopColor: isDark ? '#222' : '#efef',
          borderTopWidth: 1,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('motivation.title', 'Motivation'),
    tabBarIcon: ({ color }) => <Dumbbell color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: t('favorites.title', 'Favorites'),
  tabBarIcon: ({ color }) => <Heart color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="ritual"
        options={{
          title: t('ritual.title', 'Ritual'),
    tabBarIcon: ({ color }) => <Check color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
