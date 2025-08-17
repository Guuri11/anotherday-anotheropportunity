import * as React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDailyMotivation } from '~/lib/useDailyMotivation';

export default function Screen() {
  const dailyQuote = useDailyMotivation();
  const { t } = useTranslation();

  const handleShare = async () => {
    const message = t('share.message', { quote: dailyQuote });
    try {
      await Share.share({ message });
    } catch (error) {
      alert(message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg">
        <Text className="text-2xl font-bold text-center mb-4">
          {dailyQuote}
        </Text>
        <Button variant="outline" className="mt-4" onPress={handleShare}>
          <Text className="font-semibold text-primary text-base">{t('share.button')}</Text>
        </Button>
      </Card>
    </View>
  );
}
