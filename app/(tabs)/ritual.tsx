
import React, { useState } from 'react';
import { View, TextInput, ScrollView, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useDailyMotivation } from '../../lib/useDailyMotivation';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { Card } from '../../components/ui/card';
import { saveRitualData, getRitualData, getRitualHistory } from '../../lib/ritualStorage';

const MAX_GOALS = 3;

export default function RitualScreen() {
  const { t } = useTranslation();
  const quote = useDailyMotivation();
  const [goals, setGoals] = useState<{ text: string; completed: boolean }[]>([{ text: '', completed: false }]);
  const [reflection, setReflection] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  // (already declared, remove duplicate)
  // Get today's date as YYYY-MM-DD
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(today);

  // Load ritual data for today on mount
  React.useEffect(() => {
    getRitualData(selectedDate).then((data) => {
      if (data) {
        setGoals(data.goals.length ? data.goals : [{ text: '', completed: false }]);
        setReflection(data.reflection || '');
      } else {
        setGoals([{ text: '', completed: false }]);
        setReflection('');
      }
    });
  }, [selectedDate]);

  React.useEffect(() => {
    getRitualHistory().then(setHistory);
  }, [saved]);
  // Save handler
  const handleSave = async () => {
    setSaving(true);
    await saveRitualData({ date: selectedDate, goals: goals.filter(g => g.text.trim()), reflection });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };
  const insets = useSafeAreaInsets();

  const handleGoalChange = (text: string, idx: number) => {
    const updated = [...goals];
    updated[idx] = { ...updated[idx], text };
    setGoals(updated);
  };

  const handleGoalToggle = (idx: number) => {
    const updated = [...goals];
    updated[idx] = { ...updated[idx], completed: !updated[idx].completed };
    setGoals(updated);
  };

  const addGoal = () => {
    if (goals.length < MAX_GOALS) setGoals([...goals, { text: '', completed: false }]);
  };

  const removeGoal = (idx: number) => {
    setGoals(goals.filter((_, i) => i !== idx));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-background px-4"
      style={{ paddingTop: insets.top + 32 }}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ alignItems: 'center' }}>
        <Card className="w-full max-w-xl py-10 px-6 rounded-3xl shadow-xl bg-card/80 border-0">
          <Text className="text-3xl font-extrabold text-center mb-8 tracking-tight text-foreground">
            {t('ritual.title')}
          </Text>
          <View className="mb-10">
            <Text className="text-lg font-semibold mb-2 text-primary">
              {t('ritual.quoteOfTheDay')}
            </Text>
            <Text className="text-base italic bg-muted/60 rounded-xl px-4 py-4 text-foreground">
              {quote}
            </Text>
          </View>
          <View className="mb-10">
            <Text className="text-lg font-semibold mb-4 text-primary">
              {t('ritual.yourGoals')}
            </Text>
            <View className="gap-3">
              {goals.map((goal, idx) => (
                <View key={idx} className="flex-row items-center bg-muted/40 rounded-xl px-3 py-3">
                  <Pressable
                    onPress={() => handleGoalToggle(idx)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: goal.completed }}
                    className="mr-2"
                  >
                    <View className={goal.completed ? 'bg-primary rounded-full w-5 h-5 items-center justify-center' : 'border border-primary rounded-full w-5 h-5'}>
                      {goal.completed && <Text className="text-primary-foreground text-xs">✓</Text>}
                    </View>
                  </Pressable>
                  <TextInput
                    className={goal.completed ? "flex-1 bg-transparent text-base text-muted-foreground line-through px-2 py-1" : "flex-1 bg-transparent text-base text-foreground px-2 py-1"}
                    placeholder={t('ritual.goalPlaceholder')}
                    placeholderTextColor="#A3A3A3"
                    value={goal.text}
                    onChangeText={text => handleGoalChange(text, idx)}
                    maxLength={60}
                    editable={selectedDate === today}
                    accessibilityLabel={t('ritual.goalPlaceholder')}
                  />
                  {goals.length > 1 && selectedDate === today && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-2 rounded-full ml-2"
                      onPress={() => removeGoal(idx)}
                      accessibilityLabel={t('customQuotes.delete')}
                    >
                      <Text className="text-xl text-destructive">×</Text>
                    </Button>
                  )}
                </View>
              ))}
            </View>
            {goals.length < MAX_GOALS && (
              <Button
                variant="outline"
                className="mt-4 border-primary text-primary"
                onPress={addGoal}
              >
                <Text>{t('ritual.addGoal')}</Text>
              </Button>
            )}
            <Text className="text-xs text-muted-foreground mt-2 text-center">
              {t('ritual.maxGoals')}
            </Text>
          </View>
          <View className="mb-10">
            <Text className="text-lg font-semibold mb-2 text-primary">
              {t('ritual.reflectionTitle')}
            </Text>
            <Text className="text-sm mb-2 text-muted-foreground">
              {t('ritual.inviteReflection')}
            </Text>
            <TextInput
              className="bg-muted/40 rounded-xl text-base text-foreground px-3 py-3 min-h-[64px]"
              placeholder={t('ritual.reflectionPlaceholder')}
              placeholderTextColor="#A3A3A3"
              value={reflection}
              onChangeText={setReflection}
              maxLength={120}
              multiline
            />
          </View>
          <Button
            className="bg-primary text-background font-bold py-3 rounded-xl text-lg mt-2"
            onPress={handleSave}
            disabled={saving}
          >
            <Text>
              {saved
                ? t('ritual.done')
                : saving
                  ? t('ritual.save') + '...'
                  : t('ritual.save')}
            </Text>
          </Button>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
