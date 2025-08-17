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
import { useCustomQuotes, type CustomQuote } from '../lib/useCustomQuotes';
export default function Screen() {
  const dailyQuote = useDailyMotivation();
  const { t } = useTranslation();
  const { quotes, addQuote, editQuote, deleteQuote } = useCustomQuotes();

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

  const openAddDialog = () => {
    setEditId(null);
    setInputValue('');
    setError('');
    setDialogOpen(true);
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
        <Text className="text-2xl font-bold text-center mb-4">
          {dailyQuote}
        </Text>
        <Button variant="outline" className="mt-4" onPress={handleShare}>
          <Text className="font-semibold text-primary text-base">{t('share.button')}</Text>
        </Button>
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
