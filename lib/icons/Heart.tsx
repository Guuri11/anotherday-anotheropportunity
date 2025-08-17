import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { cn } from './cn';

export function Heart({ filled = false, className = '' }: { filled?: boolean; className?: string }) {
  return (
    <Svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('w-6 h-6', className)}
    >
      <Path
        d="M12 21s-6.2-5.2-8.5-8.1C1.2 10.1 2.1 7 4.6 5.5 6.2 4.5 8.3 5 9.5 6.4L12 9l2.5-2.6c1.2-1.4 3.3-1.9 4.9-0.9 2.5 1.5 3.4 4.6 1.1 7.4C18.2 15.8 12 21 12 21z"
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'currentColor' : 'currentColor'}
      />
    </Svg>
  );
}
