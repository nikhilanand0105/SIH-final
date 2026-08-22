import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EvidenceCard } from '@/components/intelligence/EvidenceCard';
import { StatusBadge, Surface } from '@/components/ui';
import { documentInsightCategories, extractedFields } from '@/mockData/documentIntelligence';
import { demoDocuments } from '@/mockData';
import { documentService } from '@/services/documentService';
import { DocumentRecord } from '@/types';
import { useColors } from '@/hooks/useColors';
import { fetchApi } from '@/services/apiClient';

const tabs = ['Overview', 'Extracted data', 'Evidence', 'Insights'];
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function DocumentDetailsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [document, setDocument] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    if (!id) return;
    const fetchDoc = async () => {
      try {
        const res = await fetchApi(`/documents/${id}`);
        if (res.ok) {
          setDocument(await res.json());
          const insightsRes = await fetchApi(`/documents/${id}/insights`);
          if (insightsRes.ok) {
            setInsights(await insightsRes.json());
          }
        } else {
          // Fallback to mock data for demo documents
          const mockDoc = demoDocuments.find(d => d.id === id);
          if (mockDoc) {
            setDocument({
              id: mockDoc.id,
              filename: mockDoc.filename,
              pages: mockDoc.page_count,
              created_at: new Date(mockDoc.created_at).toISOString(),
              status: mockDoc.status,
              summary: mockDoc.summary,
              extracted_fields: extractedFields.reduce((acc, field) => {
                acc[field.label] = field.value;
                return acc;
              }, {} as any),
              entities: [1, 2, 3] // mock array length
            });
            setInsights({
              insights: documentInsightCategories.map(c => ({
                title: c.title,
                items: c.items
              }))
            });
          }
        }
      } catch (err) {
        console.error(err);
        // Network error fallback
        const mockDoc = demoDocuments.find(d => d.id === id);
        if (mockDoc) {
          setDocument({
            id: mockDoc.id,
            filename: mockDoc.filename,
            pages: mockDoc.page_count,
            created_at: new Date().toISOString(),
            status: 'completed',
            summary: mockDoc.summary,
            extracted_fields: extractedFields.reduce((acc, field) => {
              acc[field.label] = field.value;
              return acc;
            }, {} as any),
            entities: [1, 2, 3]
          });
          setInsights({
            insights: documentInsightCategories.map(c => ({
              title: c.title,
              items: c.items
            }))
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
         <ActivityIndicator size="large" color={colors.info} />
      </View>
    );
  }

  if (!document) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
         <Text style={{ color: colors.ink }}>Document not found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
              <Feather name="arrow-left" size={19} color={colors.ink} />
            </Pressable>
            <Text style={[styles.topBarTitle, { color: colors.ink }]}>Document details</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Compare this document" onPress={() => router.push('/compare')} style={styles.moreButton}>
              <Feather name="git-merge" size={18} color={colors.ink} />
            </Pressable>
          </View>

          <View style={styles.documentHeading}>
            <View style={[styles.bigFileIcon, { backgroundColor: colors.infoSoft }]}><Feather name="file-text" size={24} color={colors.info} /></View>
            <View style={styles.headingCopy}>
              <Text style={[styles.documentName, { color: colors.ink }]}>{document.filename || document.filename}</Text>
              <Text style={[styles.documentMeta, { color: colors.slate }]}>PDF · {(document.page_count || 1) || 1} pages · {new Date(document.created_at).toLocaleDateString()}</Text>
            </View>
          </View>

          <View style={styles.badges}>
            <StatusBadge status={document.status === 'completed' ? 'Processed' : 'Processing'} />
            <View style={[styles.confidenceBadge, { backgroundColor: colors.successSoft }]}>
              <Feather name="check" size={12} color={colors.success} />
              <Text style={[styles.confidenceText, { color: colors.success }]}>High confidence</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.tabRow, { borderBottomColor: colors.border }]}>
            {tabs.map((tab) => (
              <Pressable key={tab} onPress={() => setActiveTab(tab)} style={[styles.tab, activeTab === tab && { borderBottomColor: colors.info }]}>
                <Text style={[styles.tabText, { color: activeTab === tab ? colors.info : colors.slate }]}>{tab}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {activeTab === 'Overview' ? <Overview document={document} /> : null}
          {activeTab === 'Extracted data' ? <ExtractedData document={document} /> : null}
          {activeTab === 'Evidence' ? <Evidence document={document} /> : null}
          {activeTab === 'Insights' ? <Insights insights={insights} /> : null}
        </View>
      </ScrollView>
    </View>
  );
}

function Overview({ document }: { document: any }) {
  const colors = useColors();
  const fieldCount = document.extracted_fields ? Object.keys(document.extracted_fields).length : 0;
  const entityCount = document.entities ? document.entities.length : 0;
  
  return (
    <>
      <Surface style={styles.summary}>
        <View style={styles.sectionHead}>
          <Text style={[styles.sectionTitle, { color: colors.ink }]}>AI summary</Text>
          <View style={[styles.aiTag, { backgroundColor: colors.infoSoft }]}><Feather name="aperture" size={12} color={colors.info} /><Text style={[styles.aiTagText, { color: colors.info }]}>AI generated</Text></View>
        </View>
        <Text style={[styles.summaryText, { color: colors.slate }]}>{document.summary || 'No summary available.'}</Text>
      </Surface>
      <View style={styles.metricGrid}>
        {[[String((document.page_count || 1) || 1), 'Pages'], [String(fieldCount), 'Fields'], [String(entityCount), 'Entities']].map(([value, label]) => (
          <Surface key={label} style={styles.metricTile}><Text style={[styles.metricValue, { color: colors.ink }]}>{value}</Text><Text style={[styles.metricLabel, { color: colors.slate }]}>{label}</Text></Surface>
        ))}
      </View>
      <Surface style={[styles.reviewBanner, { backgroundColor: colors.warningSoft, borderColor: colors.warningBorder }]}>
        <Feather name="eye" size={17} color={colors.warning} />
        <View style={styles.reviewCopy}><Text style={[styles.reviewTitle, { color: colors.ink }]}>Human review recommended</Text><Text style={[styles.reviewDetail, { color: colors.slate }]}>Verify extracted information matches document text.</Text></View>
      </Surface>
    </>
  );
}

function ExtractedData({ document }: { document: any }) {
  const colors = useColors();
  
  if (!document.extracted_fields || Object.keys(document.extracted_fields).length === 0) {
    return <Text style={{ color: colors.slate, marginTop: 10 }}>No extracted fields available.</Text>;
  }
  
  return (
    <>
      <Text style={[styles.label, { color: colors.ink }]}>Extracted fields</Text>
      {Object.entries(document.extracted_fields).map(([key, value]) => (
        <Surface key={key} style={styles.extraction}>
          <View style={styles.extractionCopy}>
            <Text style={[styles.fieldLabel, { color: colors.slate }]}>{key}</Text>
            <Text style={[styles.fieldValue, { color: colors.ink }]}>{String(value)}</Text>
            <Text style={[styles.sourceLine, { color: colors.info }]}>Page 1</Text>
          </View>
          <Text style={[styles.extractionConfidence, { color: colors.success }]}>95%</Text>
        </Surface>
      ))}
    </>
  );
}

function Evidence({ document }: { document: any }) {
  const colors = useColors();
  return (
    <>
      <Text style={[styles.label, { color: colors.ink }]}>Source evidence</Text>
      <Text style={{ color: colors.slate, marginTop: 10, marginBottom: 16 }}>Evidence highlighting will map extracted values to the original document.</Text>
      {Object.entries(document.extracted_fields || {}).slice(0, 3).map(([key, value]) => (
          <EvidenceCard key={key} result={key} document={document.filename || "Document"} page="p. 1" evidence={String(value)} confidence="High confidence" />
      ))}
    </>
  );
}

function Insights({ insights }: { insights: any }) {
  const colors = useColors();
  const insightList = insights?.insights || [];
  
  if (insightList.length === 0) {
    return <Text style={{ color: colors.slate, marginTop: 10 }}>No AI insights generated yet.</Text>;
  }
  
  return (
    <>
      <Surface style={styles.briefCard}>
        <Feather name="aperture" size={17} color={colors.info} />
        <Text style={[styles.briefText, { color: colors.slate }]}>AI generated insights based on full document context.</Text>
      </Surface>
      {insightList.map((category: any, idx: number) => (
        <Surface key={idx} style={styles.categoryCard}>
          <View style={styles.categoryHeader}>
            <Feather name="zap" size={16} color={colors.info} />
            <Text style={[styles.categoryTitle, { color: colors.ink }]}>{category.title}</Text>
          </View>
          {category.items.map((item: string, itemIdx: number) => <Text key={itemIdx} style={[styles.categoryItem, { color: colors.ink }]}>• {item}</Text>)}
        </Surface>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 23 },
  back: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  moreButton: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  documentHeading: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  bigFileIcon: { width: 52, height: 52, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  headingCopy: { flex: 1 },
  documentName: { fontSize: 18, lineHeight: 23, fontFamily: 'Inter_700Bold' },
  documentMeta: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
  badges: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 15 },
  confidenceBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7 },
  confidenceText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  tabRow: { gap: 20, borderBottomWidth: 1, marginTop: 22, marginBottom: 20 },
  tab: { paddingBottom: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  summary: { marginBottom: 14 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  sectionTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  aiTag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 6 },
  aiTagText: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  summaryText: { fontSize: 12, lineHeight: 19, fontFamily: 'Inter_400Regular' },
  metricGrid: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  metricTile: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  metricValue: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  metricLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 4 },
  label: { fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  reviewBanner: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', borderWidth: 1, padding: 12, borderRadius: 10 },
  reviewCopy: { flex: 1 },
  reviewTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  reviewDetail: { fontSize: 11, lineHeight: 17, fontFamily: 'Inter_400Regular', marginTop: 4 },
  extraction: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  extractionCopy: { flex: 1 },
  extractionConfidence: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  fieldLabel: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  fieldValue: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginTop: 6 },
  sourceLine: { fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 8 },
  briefCard: { flexDirection: 'row', gap: 10, marginBottom: 12, padding: 12, borderRadius: 10, backgroundColor: 'transparent' },
  briefText: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  categoryCard: { marginBottom: 10 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  categoryTitle: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  categoryItem: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 4 },
});
