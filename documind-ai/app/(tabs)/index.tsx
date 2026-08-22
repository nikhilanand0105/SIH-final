import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DocumentCard } from '@/components/DocumentCard';
import { AppHeader, MetricCard, SectionTitle, Surface } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';
import { activity, dashboardMetrics, demoDocuments, insights } from '@/mockData';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <AppHeader title={`Good morning, ${user?.name?.split(' ')[0] ?? 'Aarav'}`} subtitle="Your intelligence workspace at a glance." onProfile={() => router.push('/(tabs)/profile')} />
          <View style={[styles.demoBanner, { backgroundColor: colors.infoSoft, borderColor: colors.accent }]}>
            <Feather name="info" size={15} color={colors.info} />
            <Text style={[styles.demoBannerText, { color: colors.secondaryForeground }]}>Sample workspace · Fictional demo data</Text>
            <Feather name="chevron-right" size={15} color={colors.info} />
          </View>
          <SectionTitle title="Workspace overview" />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricsRow}>
            {dashboardMetrics.map((metric) => <MetricCard key={metric.label} label={metric.label} value={metric.value} detail={metric.detail} icon={metric.icon as keyof typeof Feather.glyphMap} tone={metric.tone as 'navy' | 'green' | 'amber' | 'red'} />)}
          </ScrollView>

          <SectionTitle title="Quick actions" />
          <View style={styles.actionsGrid}>
            <ActionTile icon="camera" label="Scan document" detail="Capture a page" onPress={() => router.push('/(tabs)/scan')} />
            <ActionTile icon="upload-cloud" label="Upload document" detail="Choose a file" onPress={() => router.push('/upload')} />
            <ActionTile icon="message-square" label="Ask AI" detail="Query your sources" onPress={() => router.push('/(tabs)/ai')} />
            <ActionTile icon="copy" label="Compare" detail="Find differences" onPress={() => router.push('/compare')} />
          </View>

          <SectionTitle title="Advanced tools" />
          <View style={styles.actionsGrid}>
            <ActionTile icon="share-2" label="Knowledge graph" detail="Entity explorer" onPress={() => router.push('/knowledge-graph')} />
            <ActionTile icon="bar-chart-2" label="Reports" detail="Intelligence reports" onPress={() => router.push('/reports')} />
            <ActionTile icon="bell" label="Notifications" detail="Activity center" onPress={() => router.push('/notifications')} />
            <ActionTile icon="settings" label="Settings" detail="Workspace preferences" onPress={() => router.push('/settings')} />
          </View>

          <SectionTitle title="Recent documents" action="View all" onAction={() => router.push('/(tabs)/documents')} />
          {demoDocuments.slice(0, 3).map((document) => <DocumentCard key={document.id} document={document} />)}

          <SectionTitle title="Important insights" action="See all" onAction={() => router.push('/insights')} />
          {insights.map((insight) => (
            <Surface key={insight.id} style={styles.insightCard}>
              <View style={[styles.insightIcon, { backgroundColor: insight.severity === 'Medium' ? colors.warningSoft : colors.infoSoft }]}>
                <Feather name={insight.severity === 'Medium' ? 'alert-triangle' : 'calendar'} size={17} color={insight.severity === 'Medium' ? colors.warning : colors.info} />
              </View>
              <View style={styles.insightCopy}><Text style={[styles.insightTitle, { color: colors.ink }]}>{insight.title}</Text><Text style={[styles.insightDetail, { color: colors.slate }]}>{insight.detail}</Text><Text style={[styles.insightSource, { color: colors.info }]}>{insight.source}</Text></View>
            </Surface>
          ))}

          <SectionTitle title="Processing activity" />
          <Surface>
            {activity.map((item, index) => (
              <View key={item.id} style={[styles.activityRow, index < activity.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <View style={[styles.activityIcon, { backgroundColor: item.tone === 'green' ? colors.successSoft : item.tone === 'amber' ? colors.warningSoft : colors.infoSoft }]}>
                  <Feather name={item.icon as keyof typeof Feather.glyphMap} size={16} color={item.tone === 'green' ? colors.success : item.tone === 'amber' ? colors.warning : colors.info} />
                </View>
                <View style={styles.activityCopy}><Text style={[styles.activityTitle, { color: colors.ink }]}>{item.title}</Text><Text style={[styles.activityDetail, { color: colors.slate }]}>{item.detail}</Text></View>
                <Text style={[styles.activityTime, { color: colors.slate }]}>{item.time}</Text>
              </View>
            ))}
          </Surface>
        </View>
      </ScrollView>
    </View>
  );
}

function ActionTile({ icon, label, detail, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; detail: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.actionTile, { backgroundColor: colors.white, borderColor: colors.border }, pressed && { opacity: 0.78 }]}>
      <View style={[styles.actionIcon, { backgroundColor: colors.paleBlue }]}><Feather name={icon} size={18} color={colors.info} /></View>
      <Text style={[styles.actionLabel, { color: colors.ink }]}>{label}</Text>
      <Text style={[styles.actionDetail, { color: colors.slate }]}>{detail}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  demoBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 11, borderRadius: 10, borderWidth: 1, marginBottom: 22 },
  demoBannerText: { flex: 1, fontSize: 11, fontFamily: 'Inter_500Medium' },
  metricsRow: { gap: 10, paddingBottom: 24 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  actionTile: { width: '48%', borderWidth: 1, borderRadius: 14, padding: 13, minHeight: 112 },
  actionIcon: { width: 33, height: 33, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  actionLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  actionDetail: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 4 },
  insightCard: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  insightIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  insightCopy: { flex: 1 },
  insightTitle: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },
  insightDetail: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 4 },
  insightSource: { fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 7 },
  activityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 13 },
  activityIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  activityCopy: { flex: 1 },
  activityTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  activityDetail: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  activityTime: { fontSize: 9, fontFamily: 'Inter_400Regular' },
});
