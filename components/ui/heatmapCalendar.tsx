import * as React from 'react';
import { View, Pressable, Text } from 'react-native';
import { cn } from '~/lib/utils';

function getDayColor(status: 'full' | 'partial' | 'none' | 'empty') {
  switch (status) {
    case 'full':
      return 'bg-gold';
    case 'partial':
      return 'bg-yellow-400';
    case 'none':
      return 'bg-muted-foreground';
    default:
      return 'bg-muted';
  }
}

export function HeatmapCalendar({
  days,
  onSelect,
  selectedDate,
  className,
}: {
  days: { date: string; status: 'full' | 'partial' | 'none' | 'empty' }[];
  onSelect: (date: string) => void;
  selectedDate: string;
  className?: string;
}) {
  // Agrupa por semanas (asume días ordenados)
  const weeks: { date: string; status: 'full' | 'partial' | 'none' | 'empty' }[][] = [];
  let week: { date: string; status: 'full' | 'partial' | 'none' | 'empty' }[] = [];
  days.forEach((d) => {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length) weeks.push(week);

  return (
    <View className={cn('mb-8', className)}>
      {weeks.map((w, wi) => (
        <View key={wi} className="flex-row justify-center mb-1 gap-2">
          {w.map((d) => (
            <Pressable
              key={d.date}
              onPress={() => onSelect(d.date)}
              className={cn(
                'w-7 h-7 rounded-md items-center justify-center',
                getDayColor(d.status),
                d.date === selectedDate && 'ring-2 ring-gold'
              )}
              accessibilityLabel={`Día ${d.date}`}
              accessibilityRole="button"
            >
              <Text className="text-xs font-bold text-foreground">
                {parseInt(d.date.split('-')[2], 10)}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}
