// ...existing code...
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { Card } from '~/components/ui/card';
import { useDailyMotivation } from '~/lib/useDailyMotivation';

export default function Screen() {
  const dailyQuote = useDailyMotivation();

  return (
    <View className="flex-1 justify-center items-center bg-background p-6">
      <Card className="w-full max-w-md p-8 rounded-3xl shadow-lg">
        <Text className="text-2xl font-bold text-center mb-4">
          {dailyQuote}
        </Text>
      </Card>
    </View>
  );
}
