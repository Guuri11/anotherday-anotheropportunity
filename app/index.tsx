import * as React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Share, FlatList, View as RNView } from 'react-native';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { useTranslation } from 'react-i18next';
import { useDailyMotivation } from '~/lib/useDailyMotivation';
import { useRouter } from 'expo-router';
import { useCustomQuotes, type CustomQuote } from '../lib/useCustomQuotes';
import { useFavoriteQuotes } from '../lib/useFavoriteQuotes';
import { Heart } from '~/lib/icons/Heart';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { Switch } from '~/components/ui/switch';

// Set notification handler globally (should be in app entry, but safe here for demo)
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

function useTestNotifications(quotes: string[], enabled: boolean, t: any) {
  React.useEffect(() => {
    let notificationId: string | undefined;
    async function schedule() {
      const ok = await registerForNotifications();
      if (!ok) return;
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: t('notifications.title'),
          body: t('notifications.test_message', { quote: randomQuote }),
          sound: false,
        },
        // @ts-expect-error Expo SDK 53+ expects 'timeInterval' as a string, but types are not aligned
        trigger: {
          type: 'timeInterval',
          seconds: 30,
          repeats: true,
        },
      });
    }
    if (enabled) {
      schedule();
    } else {
      // Cancel all scheduled notifications for this channel
      Notifications.cancelAllScheduledNotificationsAsync();
    }
    return () => {
      if (notificationId) Notifications.cancelScheduledNotificationAsync(notificationId);
    };
  }, [enabled, quotes, t]);
}
export default function Screen() {
  const dailyQuote = useDailyMotivation();
  const { t } = useTranslation();
  const { quotes, addQuote, editQuote, deleteQuote } = useCustomQuotes();
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavoriteQuotes();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  // All quotes for notifications (default + custom)
  const allQuotes = [
    ...t('motivation.quotes', { returnObjects: true }) as string[],
    ...quotes.map(q => q.text)
  ];
  useTestNotifications(allQuotes, notificationsEnabled, t);

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [inputValue, setInputValue] = React.useState('');
  const [error, setError] = React.useState('');

  const handleShare = async () => {
    const message = t('share.message', { quote: dailyQuote });
    try {
      await Share.share({ message });
    } catch (error) {
      alert(message);
    }
  };

  const openEditDialog = (quote: CustomQuote) => {
    setEditId(quote.id);
    setInputValue(quote.text);
    setError('');
    setDialogOpen(true);
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
    setDialogOpen(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
  <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg mb-6">
        {/* Notification toggle */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-1">
            <Text className="text-base font-semibold mb-1">{t('notifications.title')}</Text>
            <Text className="text-xs text-muted-foreground">{t('notifications.description')}</Text>
          </View>
          <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
        </View>
        <View className="flex-row items-center justify-center mb-4">
          <Text className="text-2xl font-bold text-center flex-1">
            {dailyQuote}
          </Text>
          <Button
            variant="ghost"
            className="ml-2"
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
        <View className="flex-row gap-2 mt-4">
          <Button variant="outline" onPress={handleShare}>
            <Text className="font-semibold text-primary text-base">{t('share.button')}</Text>
          </Button>
          <Button variant="outline" onPress={() => router.push('./favorites')}>
            <Text className="font-semibold text-primary text-base">{t('favorites.button')}</Text>
          </Button>
        </View>
      </Card>

      <Card className="w-full max-w-md p-6 rounded-2xl shadow">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-semibold">{t('customQuotes.add')}</Text>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Text className="text-primary font-bold">+</Text>
              </Button>
            </DialogTrigger>
            <DialogContent className="w-80 max-w-full mx-auto">
              <DialogHeader>
                <DialogTitle>{editId ? t('customQuotes.edit') : t('customQuotes.add')}</DialogTitle>
              </DialogHeader>
              <Input
                value={inputValue}
                onChangeText={setInputValue}
                placeholder={t('customQuotes.placeholder')}
                className="mb-2"
                autoFocus
                maxLength={200}
              />
              {!!error && <Text className="text-destructive mb-2">{error}</Text>}
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="ghost" onPress={() => setDialogOpen(false)}>
                    <Text>{t('customQuotes.cancel')}</Text>
                  </Button>
                </DialogClose>
                <Button variant="outline" onPress={handleSave}>
                  <Text>{t('customQuotes.save')}</Text>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </View>
        {quotes.length === 0 ? (
          <Text className="text-muted-foreground text-center py-4">{t('customQuotes.empty')}</Text>
        ) : (
          <RNView style={{ maxHeight: 200 }}>
            <FlatList
              data={quotes}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <View className="flex-row items-center justify-between border-b border-border py-2">
                  <Text className="flex-1 text-base">{item.text}</Text>
                  <Button variant="ghost" onPress={() => openEditDialog(item)}>
                    <Text className="text-xs text-primary font-semibold">{t('customQuotes.actions.edit')}</Text>
                  </Button>
                  <Button variant="ghost" onPress={() => deleteQuote(item.id)}>
                    <Text className="text-xs text-destructive font-semibold">{t('customQuotes.actions.delete')}</Text>
                  </Button>
                </View>
              )}
            />
          </RNView>
        )}
      </Card>
    </View>
  );
}
