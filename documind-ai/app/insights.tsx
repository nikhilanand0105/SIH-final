import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, Surface } from '@/components/ui';
import { useColors } from '@/hooks/useColors';

import { fetchApi } from '@/services/apiClient';
import { insights as mockInsights } from '@/mockData';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function InsightsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi('/insights')
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        setInsights(data.insights || data || []);
      })
      .catch(err => {
        console.warn('Backend unavailable or failed, falling back to mock data:', err);
        setInsights(mockInsights);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.info} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
           <View style={styles.topBar}><Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.topBarButton}><Feather name="arrow-left" size={20} color={colors.ink} /></Pressable><Text style={[styles.topBarTitle, { color: colors.ink }]}>Intelligence insights</Text><View style={styles.topBarSpacer} /></View>
          <AppHeader title="Insights" subtitle="Review conflicts, deadlines, and actions found in your workspace." />
          <View style={styles.metricRow}><InsightMetric label="Conflicts" value="2" icon="alert-triangle" tone="amber" /><InsightMetric label="Deadlines" value="1" icon="calendar" tone="blue" /><InsightMetric label="Actions" value="4" icon="check-square" tone="green" /></View>
          <Text style={[styles.label, { color: colors.ink }]}>Needs attention</Text>
          {insights.map((insight) => <Surface key={insight.id} style={styles.card}><View style={[styles.cardIcon, { backgroundColor: insight.severity === 'Medium' ? colors.warningSoft : colors.infoSoft }]}><Feather name={insight.severity === 'Medium' ? 'alert-triangle' : 'calendar'} size={18} color={insight.severity === 'Medium' ? colors.warning : colors.info} /></View><View style={styles.cardCopy}><View style={styles.cardTitleRow}><Text style={[styles.cardTitle, { color: colors.ink }]}>{insight.title}</Text><Text style={[styles.severity, { color: insight.severity === 'Medium' ? colors.warning : colors.info }]}>{insight.severity}</Text></View><Text style={[styles.cardDetail, { color: colors.slate }]}>{insight.detail}</Text><Text style={[styles.cardSource, { color: colors.info }]}>{insight.source} · Review evidence</Text></View></Surface>)}
           <Pressable accessibilityRole="button" accessibilityLabel="Open knowledge graph" onPress={() => router.push('/knowledge-graph')}><Surface style={styles.relationship}><View style={[styles.relationshipIcon, { backgroundColor: colors.navy }]}><Feather name="share-2" size={18} color={colors.white} /></View><View style={styles.cardCopy}><Text style={[styles.cardTitle, { color: colors.ink }]}>Cross-document relationships</Text><Text style={[styles.cardDetail, { color: colors.slate }]}>Entities are connected across multiple documents.</Text></View><Feather name="chevron-right" size={17} color={colors.slate} /></Surface></Pressable>
          <View style={[styles.note, { backgroundColor: colors.infoSoft }]}><Feather name="info" size={15} color={colors.info} /><Text style={[styles.noteText, { color: colors.secondaryForeground }]}>Insights are generated from live content and are intended to demonstrate explainable review patterns.</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

function InsightMetric({ label, value, icon, tone }: { label: string; value: string; icon: keyof typeof Feather.glyphMap; tone: 'amber' | 'blue' | 'green' }) {
  const colors = useColors();
  const bg = tone === 'amber' ? colors.warningSoft : tone === 'green' ? colors.successSoft : colors.infoSoft;
  const fg = tone === 'amber' ? colors.warning : tone === 'green' ? colors.success : colors.info;
  return <View style={[styles.metric, { backgroundColor: bg }]}><Feather name={icon} size={15} color={fg} /><Text style={[styles.metricValue, { color: colors.ink }]}>{value}</Text><Text style={[styles.metricLabel, { color: colors.slate }]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  topBarButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  topBarSpacer: { width: 44 },
  metricRow: { flexDirection: 'row', gap: 9, marginBottom: 25 },
  metric: { flex: 1, borderRadius: 13, padding: 12 },
  metricValue: { fontSize: 22, fontFamily: 'Inter_700Bold', marginTop: 10 },
  metricLabel: { fontSize: 10, fontFamily: 'Inter_500Medium', marginTop: 2 },
  label: { fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  card: { flexDirection: 'row', gap: 11, marginBottom: 9 },
  cardIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  cardCopy: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold', flex: 1 },
  severity: { fontSize: 10, fontFamily: 'Inter_700Bold' },
  cardDetail: { fontSize: 11, lineHeight: 17, fontFamily: 'Inter_400Regular', marginTop: 5 },
  cardSource: { fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 8 },
  relationship: { flexDirection: 'row', alignItems: 'center', gap: 11, marginTop: 8 },
  relationshipIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  note: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 10, marginTop: 18 },
  noteText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
});