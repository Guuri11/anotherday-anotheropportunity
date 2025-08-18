import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Card } from '~/components/ui/card';
import { cn } from '~/lib/utils';

export function HistoryList({
  data,
  onSelect,
  selectedDate,
}: {
  data: { date: string; goals: { text: string; completed: boolean }[]; reflection: string }[];
  onSelect: (date: string) => void;
  selectedDate: string;
}) {
  if (!data.length) return null;
  return (
    <Card className="w-full max-w-xl mb-8 p-4 bg-muted/30 border-0">
      <Text className="text-lg font-bold mb-2 text-gold">Historial</Text>
      <View className="flex-row flex-wrap gap-2">
        {data.map((item) => (
          <Pressable
            key={item.date}
            onPress={() => onSelect(item.date)}
            className={cn(
              'px-3 py-1 rounded-lg',
              item.date === selectedDate ? 'bg-gold' : 'bg-muted/60'
            )}
            accessibilityRole="button"
            accessibilityLabel={`Ver ritual del ${item.date}`}
          >
            <Text className={cn('text-xs font-semibold', item.date === selectedDate ? 'text-black' : 'text-gold')}>{item.date}</Text>
          </Pressable>
        ))}
      </View>
    </Card>
  );
}
