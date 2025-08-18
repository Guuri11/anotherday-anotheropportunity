import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '~/lib/utils';

export function Toast({ message, visible, className }: { message: string; visible: boolean; className?: string }) {
  if (!visible) return null;
  return (
    <View
      className={cn(
        'absolute top-8 left-1/2 -translate-x-1/2 bg-black/90 px-4 py-2 rounded-xl z-50 shadow-lg',
        className
      )}
      accessibilityLiveRegion="polite"
      accessible
    >
      <Text className="text-gold text-base font-semibold text-center">{message}</Text>
    </View>
  );
}
