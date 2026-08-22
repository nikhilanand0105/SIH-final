import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EvidenceCard } from '@/components/intelligence/EvidenceCard';
import { AppHeader, PrimaryButton, SectionTitle, Surface } from '@/components/ui';
import { comparisonService } from '@/services/comparisonService';
import type { ComparisonRow } from '@/types';
import { useColors } from '@/hooks/useColors';

import { fetchApi } from '@/services/apiClient';
import { demoDocuments } from '@/mockData';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function CompareScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [docAId, setDocAId] = useState('');
  const [docBId, setDocBId] = useState('');
  const [compared, setCompared] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchApi('/documents')
      .then(r => {
        if (!r.ok) throw new Error('API Error');
        return r.json();
      })
      .then(data => {
        if (!Array.isArray(data)) throw new Error('Expected array');
        setDocuments(data);
        if (data.length >= 2) {
          setDocAId(data[0].document_id || data[0].id);
          setDocBId(data[1].document_id || data[1].id);
        } else if (data.length === 1) {
          setDocAId(data[0].document_id || data[0].id);
        }
      })
      .catch((err) => {
        console.warn('Backend unavailable or failed, falling back to mock data:', err);
        setDocuments(demoDocuments);
        if (demoDocuments.length >= 2) {
          setDocAId(demoDocuments[0].id);
          setDocBId(demoDocuments[1].id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const runCompare = async () => {
    if (!docAId || !docBId) return;
    const data = await comparisonService.compare(docAId, docBId);
    setResult(data);
    setCompared(true);
  };

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
          <View style={styles.topBar}>
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.topBarButton}>
              <Feather name="arrow-left" size={20} color={colors.ink} />
            </Pressable>
            <Text style={[styles.topBarTitle, { color: colors.ink }]}>{compared ? 'Comparison results' : 'Compare documents'}</Text>
            <View style={styles.topBarSpacer} />
          </View>

          <AppHeader
            title={compared ? 'What changed, clearly' : 'Compare documents'}
            subtitle={compared ? 'Field-level review with source evidence.' : 'Put two sources side by side to surface differences.'}
          />

          {!compared ? (
            <>
              <Text style={[styles.label, { color: colors.ink }]}>Document pair</Text>
              <DocumentSelector label="Document A" selectedId={docAId} onSelect={setDocAId} documents={documents} />
              <DocumentSelector label="Document B" selectedId={docBId} onSelect={setDocBId} documents={documents} />
              <View style={[styles.hint, { backgroundColor: colors.infoSoft }]}>
                <Feather name="git-merge" size={17} color={colors.info} />
                <Text style={[styles.hintText, { color: colors.secondaryForeground }]}>Selected pair will be compared using indexed fields and page references.</Text>
              </View>
              <PrimaryButton label="Compare documents" icon="git-merge" onPress={runCompare} />
              {docAId === docBId ? <Text style={[styles.errorText, { color: colors.destructive }]}>Choose two different documents to compare.</Text> : null}
            </>
          ) : result ? (
            <View style={styles.results}>
              <View style={styles.pairRow}>
                <Surface style={styles.pairCard}><Text style={[styles.pairLabel, { color: colors.slate }]}>Document A</Text><Text style={[styles.pairName, { color: colors.ink }]}>{result.documentA}</Text></Surface>
                <Surface style={[styles.pairCard, { backgroundColor: colors.infoSoft, borderColor: colors.accent }]}><Text style={[styles.pairLabel, { color: colors.info }]}>Document B</Text><Text style={[styles.pairName, { color: colors.info }]}>{result.documentB}</Text></Surface>
              </View>
              <Surface style={styles.summaryCard}>
                <Text style={[styles.summaryTitle, { color: colors.ink }]}>Summary</Text>
                <Text style={[styles.summaryText, { color: colors.slate }]}>{result.summary}</Text>
                <View style={styles.summaryBadges}>
                  <Badge label={`${result.changed?.length || 0} changed`} tone="warning" />
                  <Badge label={`${result.added?.length || 0} added`} tone="success" />
                  <Badge label={`${result.removed?.length || 0} removed`} tone="danger" />
                </View>
              </Surface>
              <ComparisonSection title="Changed" rows={result.changed || []} kind="changed" colors={colors} />
              <ComparisonSection title="Added" rows={result.added || []} kind="added" colors={colors} />
              <ComparisonSection title="Removed" rows={result.removed || []} kind="removed" colors={colors} />
              <ComparisonSection title="Unchanged" rows={result.unchanged || []} kind="unchanged" colors={colors} />
              <Surface style={[styles.conflictCard, { backgroundColor: colors.warningSoft, borderColor: colors.warningBorder }]}>
                <Feather name="alert-triangle" size={17} color={colors.warning} />
                <View style={styles.conflictCopy}>
                  <Text style={[styles.conflictTitle, { color: colors.ink }]}>Comparison complete</Text>
                  <Text style={[styles.conflictDetail, { color: colors.slate }]}>Review the sections above for semantic differences.</Text>
                </View>
              </Surface>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

function DocumentSelector({ label, selectedId, onSelect, documents }: { label: string; selectedId: string; onSelect: (id: string) => void; documents: any[] }) {
  const colors = useColors();
  const selected = documents.find((d) => (d.document_id || d.id) === selectedId);
  return (
    <Surface style={styles.selector}>
      <View style={[styles.selectorIcon, { backgroundColor: colors.infoSoft }]}><Feather name="file-text" size={17} color={colors.info} /></View>
      <View style={styles.selectorCopy}>
        <Text style={[styles.selectorLabel, { color: colors.slate }]}>{label}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.docOptions}>
          {documents.map((doc) => {
            const uid = doc.document_id || doc.id;
            return (
              <Pressable key={uid} onPress={() => onSelect(uid)} style={[styles.docChip, { backgroundColor: selectedId === uid ? colors.primary : colors.background, borderColor: selectedId === uid ? colors.primary : colors.border }]}>
                <Text style={[styles.docChipText, { color: selectedId === uid ? colors.white : colors.slate }]} numberOfLines={1}>{doc.filename}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {selected ? <Text style={[styles.selectorMeta, { color: colors.slate }]}>{selected.document_type || 'PDF'} · {selected.pages || selected.page_count || 1} pages</Text> : null}
      </View>
    </Surface>
  );
}

function ComparisonSection({ title, rows, kind, colors }: { title: string; rows: ComparisonRow[]; kind: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={styles.section}>
      <SectionTitle title={title} />
      {rows.map((row) => (
        <Surface key={row.label} style={styles.diffCard}>
          <Text style={[styles.diffLabel, { color: colors.ink }]}>{row.label}</Text>
          <View style={styles.diffRow}>
            <View style={styles.diffCol}><Text style={[styles.docLabel, { color: colors.slate }]}>Document A</Text><Text style={[styles.diffValue, { color: colors.ink }]}>{row.a}</Text></View>
            <Feather name="arrow-right" size={16} color={colors.warning} />
            <View style={styles.diffCol}><Text style={[styles.docLabel, { color: colors.slate }]}>Document B</Text><Text style={[styles.diffValue, { color: colors.info }]}>{row.b}</Text></View>
          </View>
          {row.difference ? <Text style={[styles.difference, { color: colors.warning }]}>Difference: {row.difference}</Text> : null}
          <EvidenceCard result={kind} document="Source pages" page={row.page} evidence={row.evidence} />
        </Surface>
      ))}
    </View>
  );
}

function Badge({ label, tone }: { label: string; tone: 'warning' | 'success' | 'danger' }) {
  const colors = useColors();
  const bg = tone === 'warning' ? colors.warningSoft : tone === 'danger' ? colors.dangerSoft : colors.successSoft;
  const fg = tone === 'warning' ? colors.warning : tone === 'danger' ? colors.destructive : colors.success;
  return <View style={[styles.badge, { backgroundColor: bg }]}><Text style={[styles.badgeText, { color: fg }]}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  topBarButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  topBarSpacer: { width: 44 },
  label: { fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  selector: { flexDirection: 'row', gap: 10, marginBottom: 9 },
  selectorIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  selectorCopy: { flex: 1 },
  selectorLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', marginBottom: 6 },
  selectorMeta: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 6 },
  docOptions: { gap: 6 },
  docChip: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, maxWidth: 160 },
  docChipText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  hint: { flexDirection: 'row', gap: 9, padding: 12, borderRadius: 10, marginVertical: 14 },
  hintText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  errorText: { fontSize: 10, textAlign: 'center', marginTop: 8, fontFamily: 'Inter_500Medium' },
  results: { marginTop: 8 },
  pairRow: { flexDirection: 'row', gap: 9, marginBottom: 12 },
  pairCard: { flex: 1, padding: 12 },
  pairLabel: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  pairName: { fontSize: 12, fontFamily: 'Inter_700Bold', marginTop: 4 },
  summaryCard: { marginBottom: 16 },
  summaryTitle: { fontSize: 13, fontFamily: 'Inter_700Bold', marginBottom: 6 },
  summaryText: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  summaryBadges: { flexDirection: 'row', gap: 8, marginTop: 12 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 9, fontFamily: 'Inter_700Bold' },
  section: { marginBottom: 8 },
  diffCard: { marginBottom: 9, padding: 13 },
  diffLabel: { fontSize: 12, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  diffRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  diffCol: { flex: 1 },
  docLabel: { fontSize: 9, fontFamily: 'Inter_500Medium' },
  diffValue: { fontSize: 14, fontFamily: 'Inter_700Bold', marginTop: 4 },
  difference: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 10, marginBottom: 8 },
  conflictCard: { flexDirection: 'row', gap: 10, padding: 14, borderWidth: 1, borderRadius: 10, marginTop: 8 },
  conflictCopy: { flex: 1 },
  conflictTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  conflictDetail: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 4 },
});
