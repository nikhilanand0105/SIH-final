import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EvidenceCard } from '@/components/intelligence/EvidenceCard';
import { AppHeader, Surface } from '@/components/ui';
import { crossDocumentQuestions, currentDocumentQuestions, type ChatScope } from '@/mockData/chat';
import { chatService } from '@/services/chatService';
import { useColors } from '@/hooks/useColors';

const scopes: ChatScope[] = ['Current Document', 'Selected Documents', 'All Documents'];

export default function AiScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [scope, setScope] = useState<ChatScope>('Current Document');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<{ question: string; answer: string; source: string; confidence: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const suggestions = scope === 'Current Document' ? currentDocumentQuestions : crossDocumentQuestions;

  const ask = async (value = question) => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      const response = await chatService.ask(value);
      setAnswer({ question: value, ...response });
      setQuestion('');
    } catch (e) {
      console.warn('Chat request failed:', e);
      setAnswer({ 
        question: value, 
        answer: 'I am currently unable to reach the document intelligence backend. Please check your connection or ensure the server is running.', 
        source: 'System Error', 
        confidence: 0 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.root, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 112 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <AppHeader title="AI Assistant" subtitle="Evidence-grounded answers across your document workspace." />

          <Surface style={styles.scopeCard}>
            <Text style={[styles.scopeTitle, { color: colors.ink }]}>Answer scope</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scopeRow}>
              {scopes.map((item) => (
                <Pressable key={item} onPress={() => setScope(item)} style={[styles.scopeChip, { backgroundColor: scope === item ? colors.primary : colors.background, borderColor: scope === item ? colors.primary : colors.border }]}>
                  <Text style={[styles.scopeChipText, { color: scope === item ? colors.white : colors.slate }]}>{item}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Text style={[styles.scopeMeta, { color: colors.slate }]}>
              {scope === 'Current Document' ? 'Procurement Contract 2026' : scope === 'All Documents' ? '4 documents available' : '2 selected documents'}
            </Text>
          </Surface>

          {!answer ? (
            <View style={styles.welcome}>
              <View style={[styles.aiIcon, { backgroundColor: colors.navy }]}><Feather name="aperture" size={22} color={colors.white} /></View>
              <Text style={[styles.welcomeTitle, { color: colors.ink }]}>Ask the source</Text>
              <Text style={[styles.welcomeDetail, { color: colors.slate }]}>Every answer ties back to a document and page reference.</Text>
            </View>
          ) : (
            <View style={styles.chat}>
              <View style={[styles.userBubble, { backgroundColor: colors.navy }]}>
                <Text style={[styles.userText, { color: colors.white }]}>{answer.question}</Text>
              </View>
              <Surface style={styles.answerCard}>
                <View style={styles.answerHeader}>
                  <Feather name="aperture" size={14} color={colors.info} />
                  <Text style={[styles.answerLabel, { color: colors.info }]}>Mock intelligence response</Text>
                  <Text style={[styles.confidence, { color: colors.success }]}>{answer.confidence}% confidence</Text>
                </View>
                <Text style={[styles.answer, { color: colors.ink }]}>{answer.answer}</Text>
                <EvidenceCard result="Answer evidence" document={answer.source?.split('·')[0]?.trim() ?? 'Source'} page={answer.source} evidence={answer.answer} confidence={`${answer.confidence}% confidence`} />
              </Surface>
            </View>
          )}

          <Text style={[styles.sectionLabel, { color: colors.ink }]}>{answer ? 'Follow-up questions' : 'Suggested questions'}</Text>
          <View style={styles.suggestions}>
            {suggestions.map((item) => (
              <Pressable key={item} accessibilityRole="button" accessibilityLabel={item} onPress={() => ask(item)} style={({ pressed }) => [styles.suggestion, { backgroundColor: colors.white, borderColor: colors.border }, pressed && { opacity: 0.78 }]}>
                <Text style={[styles.suggestionText, { color: colors.ink }]}>{item}</Text>
                <Feather name="arrow-up-right" size={14} color={colors.info} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.composer, { backgroundColor: colors.background, borderTopColor: colors.border, paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={[styles.inputWrap, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <TextInput accessibilityLabel="Ask a question" multiline onChangeText={setQuestion} onSubmitEditing={() => ask()} placeholder="Ask about this evidence..." placeholderTextColor={colors.slate} style={[styles.input, { color: colors.ink }]} value={question} />
          <Pressable accessibilityRole="button" accessibilityLabel="Send question" disabled={loading} onPress={() => ask()} style={[styles.send, { backgroundColor: colors.primary }]}>
            {loading ? <ActivityIndicator size="small" color={colors.white} /> : <Feather name="arrow-up" size={17} color={colors.white} />}
          </Pressable>
        </View>
        <Text style={[styles.disclaimer, { color: colors.slate }]}>Responses use fictional demo content for UI preview.</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  scopeCard: { marginBottom: 20 },
  scopeTitle: { fontSize: 12, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  scopeRow: { gap: 8 },
  scopeChip: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  scopeChipText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  scopeMeta: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 10 },
  welcome: { alignItems: 'center', paddingHorizontal: 25, paddingVertical: 26 },
  aiIcon: { width: 50, height: 50, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  welcomeTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  welcomeDetail: { fontSize: 12, lineHeight: 18, textAlign: 'center', fontFamily: 'Inter_400Regular', marginTop: 7 },
  chat: { gap: 12, marginBottom: 20 },
  userBubble: { alignSelf: 'flex-end', maxWidth: '88%', borderRadius: 14, borderTopRightRadius: 4, padding: 12 },
  userText: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_500Medium' },
  answerCard: { marginBottom: 4 },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  answerLabel: { flex: 1, fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.6 },
  confidence: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  answer: { fontSize: 13, lineHeight: 20, fontFamily: 'Inter_400Regular', marginBottom: 12 },
  sectionLabel: { fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 11 },
  suggestions: { gap: 8 },
  suggestion: { minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 10 },
  suggestionText: { fontSize: 12, fontFamily: 'Inter_500Medium', flex: 1 },
  composer: { position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, paddingHorizontal: 18, paddingTop: 11 },
  inputWrap: { minHeight: 48, maxHeight: 110, borderRadius: 12, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 13, paddingRight: 6 },
  input: { flex: 1, fontSize: 13, lineHeight: 18, fontFamily: 'Inter_400Regular', paddingVertical: 9 },
  send: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  disclaimer: { fontSize: 9, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 7 },
});
