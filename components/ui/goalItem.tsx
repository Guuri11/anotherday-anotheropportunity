import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Checkbox } from '~/components/ui/checkbox';
import { cn } from '~/lib/utils';

export function GoalItem({
  goal,
  onToggle,
  editable,
  className,
}: {
  goal: { text: string; completed: boolean };
  onToggle?: () => void;
  editable?: boolean;
  className?: string;
}) {
  return (
    <View className={cn('flex-row items-center gap-2', className)}>
      <Checkbox
        checked={goal.completed}
        onCheckedChange={() => onToggle && onToggle()}
        disabled={!editable}
        accessibilityLabel={goal.text + (goal.completed ? ' completado' : ' no completado')}
      />
      <Text className={cn('text-base flex-1', goal.completed ? 'line-through text-muted-foreground' : 'text-foreground')}>{goal.text}</Text>
    </View>
  );
}
