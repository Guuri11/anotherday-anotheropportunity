import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { useFavoriteQuotes } from '~/lib/useFavoriteQuotes';
import { useTranslation } from 'react-i18next';
import { Heart } from '~/lib/icons/Heart';


export default function FavoritesScreen() {
  const { t } = useTranslation();
  const { favorites, removeFavorite } = useFavoriteQuotes();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center bg-background px-4"
      style={{ paddingTop: insets.top + 32 }}
    >
      <Card className="w-full max-w-xl py-10 px-6 rounded-3xl shadow-xl bg-card/80 border-0">
        <Text className="text-3xl font-extrabold text-center mb-8 tracking-tight">
          {t('favorites.title')}
        </Text>
        {favorites.length === 0 ? (
          <Text className="text-muted-foreground text-center py-8 text-lg">
            {t('favorites.empty')}
          </Text>
        ) : (
          <View className="gap-4">
            {favorites.map((quote, idx) => (
              <View
                key={idx}
                className="flex-row items-center bg-muted/40 rounded-2xl px-4 py-5 shadow-sm"
              >
                <Text className="flex-1 text-base font-medium text-foreground pr-4">
                  {quote}
                </Text>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-full hover:bg-red-50 active:bg-red-100"
                  onPress={() => removeFavorite(quote)}
                  accessibilityLabel={t('favorites.remove')}
                >
                  <Heart filled className="text-red-500 w-6 h-6" />
                </Button>
              </View>
            ))}
          </View>
        )}
      </Card>
    </View>
  );
}
