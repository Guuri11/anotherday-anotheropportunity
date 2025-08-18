import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useToast(duration = 2000) {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timeout: number;
    if (message) {
      setVisible(true);
      AccessibilityInfo.announceForAccessibility(message);
      timeout = setTimeout(() => {
        setVisible(false);
        setMessage(null);
      }, duration) as unknown as number;
    }
    return () => clearTimeout(timeout);
  }, [message, duration]);

  return {
    showToast: setMessage,
    toastMessage: message,
    toastVisible: visible,
  };
}
