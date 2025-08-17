import * as React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { useFavoriteQuotes } from '~/lib/useFavoriteQuotes';
import { useTranslation } from 'react-i18next';
import { Heart } from '~/lib/icons/Heart';

export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { favorites, removeFavorite } = useFavoriteQuotes();

  return (
    <View className="flex-1 items-center bg-background p-6">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg mb-6">
        <Text className="text-2xl font-bold text-center mb-4">
          {t('favorites.title')}
        </Text>
        {favorites.length === 0 ? (
          <Text className="text-muted-foreground text-center py-4">{t('favorites.empty')}</Text>
        ) : (
          favorites.map((quote, idx) => (
            <View key={idx} className="flex-row items-center justify-between border-b border-border py-2">
              <Text className="flex-1 text-base">{quote}</Text>
              <Button
                variant="ghost"
                onPress={() => removeFavorite(quote)}
                accessibilityLabel={t('favorites.remove')}
              >
                <Heart filled className="text-red-500" />
              </Button>
            </View>
          ))
        )}
      </Card>
    </View>
  );
}
