import * as React from 'react';
import { View, Image, ImageProps } from 'react-native';

// This wrapper allows us to use the SVG as a component with className for NativeWind
export function Logo({ className = '', ...props }: { className?: string } & Partial<ImageProps>) {
  return (
    <View className={className}>
      <Image
        source={require('assets/images/adao.png')}
        style={{ width: 96, height: 96 }}
        resizeMode="contain"
        accessibilityLabel="Logo"
        {...props}
      />
    </View>
  );
}
