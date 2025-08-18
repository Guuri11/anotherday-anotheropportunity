import * as React from 'react';
import { View, TouchableOpacity, Platform, Share } from 'react-native';
import { Text } from '~/components/ui/text';
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import { useCustomQuotes, type CustomQuote } from '../lib/useCustomQuotes';
import { Input } from '~/components/ui/input';
import { useDailyMotivation } from '~/lib/useDailyMotivation';
import { useTranslation } from 'react-i18next';
import { useFavoriteQuotes } from '../lib/useFavoriteQuotes';
import { useColorScheme } from '~/lib/useColorScheme';
import { Heart } from '~/lib/icons/Heart';
import { Logo } from '../components/Logo';
import { Switch } from '~/components/ui/switch';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Set notification handler global (seguro en app entry, pero aquí para demo)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('motivational', {
      name: 'Motivational',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('No permission for notifications');
      return false;
    }
    return true;
  }
  return false;
}

function useDailyNotifications(quotes: string[], enabled: boolean, t: any) {
  React.useEffect(() => {
    let notificationId: string | undefined;
    async function scheduleDailyNotification() {
      const ok = await registerForNotifications();
      if (!ok) return;
      // Cancel previous scheduled notifications to avoid duplicates
      await Notifications.cancelAllScheduledNotificationsAsync();
      // Pick a random quote for today
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      // Platform-specific trigger for daily notification at 9:00 AM
      let trigger;
      if (Platform.OS === 'android') {
        trigger = { type: 'daily', hour: 9, minute: 0 };
      } else {
        trigger = { type: 'calendar', repeats: true, dateComponents: { hour: 9, minute: 0 } };
      }
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: t('notifications.title'),
          body: t('notifications.push_message', { quote: randomQuote }),
          sound: false,
        },
        trigger: trigger as any,
      });
    }
    if (enabled) {
      scheduleDailyNotification();
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
    return () => {
      if (notificationId) Notifications.cancelScheduledNotificationAsync(notificationId);
    };
  }, [enabled, quotes, t]);
}

export default function Screen() {
  const router = useRouter();
  const { quotes, addQuote, editQuote, deleteQuote } = useCustomQuotes();
  const dailyQuote = useDailyMotivation();
  const { t } = useTranslation();
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteQuotes();
  const [showSettings, setShowSettings] = React.useState(false);
  const [showCustomQuoteDialog, setShowCustomQuoteDialog] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');
  const [editId, setEditId] = React.useState<string | null>(null);
  const [error, setError] = React.useState('');
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [streak, setStreak] = React.useState(1); // TODO: Replace with real streak logic
  const colorScheme = useColorScheme();

  // Todas las frases para notificaciones (default + custom)
  const allQuotes = React.useMemo(() => [
    ...t('motivation.quotes', { returnObjects: true }) as string[],
    ...quotes.map((q: { text: string }) => q.text)
  ], [t, quotes]);
  useDailyNotifications(allQuotes, notificationsEnabled, t);

  // Minimal menu (top-right)
  function Menu() {
    const [open, setOpen] = React.useState(false);
    return (
      <View className="absolute top-6 right-6 z-10">
        <TouchableOpacity onPress={() => setOpen(!open)} accessibilityLabel={t('menu.open', 'Open menu')}>
          <Text className="text-2xl text-muted-foreground">⋮</Text>
        </TouchableOpacity>
        {open && (
          <View className="absolute right-0 mt-2 bg-background rounded-xl shadow-lg py-2 w-44 z-20 border border-border">
            <TouchableOpacity className="px-4 py-2" onPress={() => { setOpen(false); router.push('./favorites'); }}>
              <Text className="text-base text-foreground">{t('favorites.button')}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2" onPress={() => { setOpen(false); setShowCustomQuoteDialog(true); }}>
              <Text className="text-base text-foreground">{t('customQuotes.add')}</Text>
            </TouchableOpacity>
            <TouchableOpacity className="px-4 py-2" onPress={() => { setOpen(false); setShowSettings(true); }}>
              <Text className="text-base text-foreground">{t('notifications.title')}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // Settings modal (notification toggle, custom quotes, etc.)
  function SettingsModal({ notificationsEnabled, setNotificationsEnabled }: { notificationsEnabled: boolean, setNotificationsEnabled: (v: boolean) => void }) {
    if (!showSettings) return null;
    return (
      <View className="absolute inset-0 bg-black/40 dark:bg-black/60 justify-center items-center z-20">
        <View className="bg-background rounded-2xl p-6 w-80 max-w-full shadow-lg">
          <Text className="text-lg font-bold mb-4 text-center">{t('notifications.title')}</Text>
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base text-muted-foreground flex-1">{t('notifications.description')}</Text>
            <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
          </View>
          <Button variant="outline" className="mb-2" onPress={() => { setShowCustomQuoteDialog(true); setShowSettings(false); }}>
            <Text>{t('customQuotes.add')}</Text>
          </Button>
          <Button variant="outline" onPress={() => setShowSettings(false)}>
            <Text>{t('customQuotes.cancel')}</Text>
          </Button>
        </View>
      </View>
    );
  }
  // Share logic
  const handleShare = async () => {
    const message = t('share.message', { quote: dailyQuote });
    try {
      await Share.share({ message });
    } catch (error) {
      alert(message);
    }
  };

  // Custom quote dialog logic
  const openEditDialog = (quote: CustomQuote) => {
    setEditId(quote.id);
    setInputValue(quote.text);
    setError('');
    setShowCustomQuoteDialog(true);
  };
  const handleSave = async () => {
    if (!inputValue.trim()) {
      setError(t('customQuotes.error_empty'));
      return;
    }
    if (editId) {
      await editQuote(editId, inputValue.trim());
    } else {
      await addQuote(inputValue.trim());
    }
    setShowCustomQuoteDialog(false);
    setInputValue('');
    setEditId(null);
    setError('');
  };

  return (
    <View className="flex-1 justify-center items-center relative">
      {/* Animated gradient background (static for now, can animate with Reanimated) */}
      {/* Minimal menu */}
      <Menu />
      {/* Settings modal */}
      <SettingsModal notificationsEnabled={notificationsEnabled} setNotificationsEnabled={setNotificationsEnabled} />
      {/* Logo at the top */}
      <View className="w-full items-center mt-12">
        <Logo className="w-24 h-24" />
      </View>
      {/* Main content */}
      <View className="flex-1 justify-center items-center w-full px-6">
        {/* Motivational streak */}
        <View className="mb-4">
          <Text className="text-xs text-accent-foreground text-center opacity-80">🔥 {streak} {t('streak.label', { count: streak, defaultValue: 'days motivated' })}</Text>
        </View>
        {/* Daily quote */}
        <Text className="text-3xl md:text-4xl font-extrabold text-center mb-2 text-foreground leading-snug" style={{ letterSpacing: 0.5 }}>
          {dailyQuote}
        </Text>
        {/* Share button just below the quote */}
        <Button variant="outline" className="mb-4" onPress={handleShare}>
          <Text className="font-semibold text-primary text-base">{t('share.button')}</Text>
        </Button>
        {/* Favorite button */}
        <Button
          variant="ghost"
          className="mb-2"
          onPress={() =>
            isFavorite(dailyQuote)
              ? removeFavorite(dailyQuote)
              : addFavorite(dailyQuote)
          }
          accessibilityLabel={isFavorite(dailyQuote) ? t('favorites.remove') : t('favorites.add')}
        >
          <Heart filled={isFavorite(dailyQuote)} className={isFavorite(dailyQuote) ? 'text-red-500' : 'text-muted-foreground'} />
        </Button>
      </View>
      {/* Custom Quote Dialog */}
      {showCustomQuoteDialog && (
        <View className="absolute inset-0 bg-black/40 dark:bg-black/60 justify-center items-center z-30">
          <View className="bg-background rounded-2xl p-6 w-80 max-w-full shadow-lg">
            <Text className="text-lg font-bold mb-4 text-center">{editId ? t('customQuotes.edit') : t('customQuotes.add')}</Text>
            <Input
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={t('customQuotes.placeholder')}
              className="mb-2"
              autoFocus
              maxLength={200}
            />
            {!!error && <Text className="text-destructive mb-2">{error}</Text>}
            <View className="flex-row justify-end gap-2 mt-2">
              <Button variant="ghost" onPress={() => { setShowCustomQuoteDialog(false); setInputValue(''); setEditId(null); setError(''); }}>
                <Text>{t('customQuotes.cancel')}</Text>
              </Button>
              <Button variant="outline" onPress={handleSave}>
                <Text>{t('customQuotes.save')}</Text>
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}