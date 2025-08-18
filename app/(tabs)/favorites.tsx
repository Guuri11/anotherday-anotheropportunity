import * as React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '~/components/ui/text';
// Card removed for minimal UI
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
      <View className="w-full max-w-xl py-8 px-0">
        <Text className="text-3xl font-extrabold text-center mb-10 tracking-tight">
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
                className="flex-row items-center px-0 py-4"
              >
                <Text className="flex-1 text-base font-medium text-foreground pr-4">
                  {quote}
                </Text>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-2 rounded-full"
                  onPress={() => removeFavorite(quote)}
                  accessibilityLabel={t('favorites.remove')}
                >
                  <Heart filled className="text-red-500 w-6 h-6" />
                </Button>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
