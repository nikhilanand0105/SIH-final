import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KnowledgeGraph, type KnowledgeGraphRelationship } from '@/components/KnowledgeGraph';
import { AppHeader, PrimaryButton, SectionTitle, Surface } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import type { GraphEntity } from '@/types';

import { fetchApi } from '@/services/apiClient';
import { graphEntities } from '@/mockData';
import { graphRelationships as mockGraphRelationships } from '@/mockData/graph';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function KnowledgeGraphScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  
  const [graphData, setGraphData] = useState<any[]>([]);
  const [graphRelationships, setGraphRelationships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [query, setQuery] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState('');
  const [expandedRelationshipIds, setExpandedRelationshipIds] = useState<string[]>([]);
  const [showEvidence, setShowEvidence] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchApi('/knowledge-graph')
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        setGraphData(data.nodes || []);
        setGraphRelationships(data.relationships || []);
        if (data.nodes && data.nodes.length > 0) {
          setSelectedEntityId(data.nodes[0].id);
        }
      })
      .catch((err) => {
        console.warn('Backend unavailable or failed, falling back to mock data:', err);
        setGraphData(graphEntities);
        setGraphRelationships(mockGraphRelationships);
        if (graphEntities.length > 0) setSelectedEntityId(graphEntities[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedEntity = graphData.find((entity) => entity.id === selectedEntityId) ?? graphData[0];
  const searchResults = useMemo(
    () => query.trim().length > 0
      ? graphData.filter((entity) => `${entity.name} ${entity.kind}`.toLowerCase().includes(query.toLowerCase()))
      : [],
    [query, graphData],
  );
  const selectedRelationships = graphRelationships.filter(
    (relationship) => relationship.from === selectedEntity?.id || relationship.to === selectedEntity?.id,
  );
  
  // Real related docs from links instead of mock string array
  const connectedEntityIds = selectedRelationships.map(r => r.from === selectedEntity?.id ? r.to : r.from);
  const connectedEntities = connectedEntityIds
    .map(id => graphData.find(e => e.id === id))
    .filter(Boolean);
    
  const relatedDocuments = connectedEntities.filter(e => e.kind === 'Document');

  const selectEntity = (entityId: string) => {
    void Haptics.selectionAsync();
    setSelectedEntityId(entityId);
    setShowEvidence(false);
    setActionMessage('');
    setQuery('');
  };

  const expandRelationship = (relationship: KnowledgeGraphRelationship) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedRelationshipIds((current) => current.includes(relationship.id)
      ? current.filter((id) => id !== relationship.id)
      : [...current, relationship.id]);
  };

  const viewEntity = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedEntity) {
      setActionMessage(`${selectedEntity.name} is selected in the explorer.`);
    }
  };

  const viewEvidence = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowEvidence((current) => !current);
    setActionMessage('');
  };

  if (loading) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.info} />
      </View>
    );
  }

  if (!selectedEntity) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.ink }}>No graph data available</Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 34 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <AppHeader
            title="Knowledge Graph"
            subtitle="Trace entities, documents, and evidence across your workspace."
            onProfile={() => router.push('/(tabs)/profile')}
          />

          <View style={[styles.search, { backgroundColor: colors.white, borderColor: colors.border }]}>
            <Feather name="search" size={17} color={colors.slate} />
            <TextInput
              accessibilityLabel="Search entity"
              onChangeText={setQuery}
              placeholder="Search entity"
              placeholderTextColor={colors.slate}
              style={[styles.searchInput, { color: colors.ink }]}
              value={query}
            />
            {query ? (
              <Pressable accessibilityRole="button" accessibilityLabel="Clear entity search" onPress={() => setQuery('')}>
                <Feather name="x" size={16} color={colors.slate} />
              </Pressable>
            ) : (
              <Feather name="command" size={16} color={colors.info} />
            )}
          </View>

          {searchResults.length > 0 ? (
            <Surface style={styles.searchResults}>
              <Text style={[styles.searchResultsTitle, { color: colors.slate }]}>MATCHING ENTITIES</Text>
              {searchResults.map((entity) => (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${entity.name}`}
                  key={entity.id}
                  onPress={() => selectEntity(entity.id)}
                  style={({ pressed }) => [styles.searchResultRow, { borderBottomColor: colors.divider }, pressed && styles.pressed]}
                >
                  <View style={[styles.resultIcon, { backgroundColor: colors.infoSoft }]}><Feather name={entity.kind === 'Organization' ? 'briefcase' : entity.kind === 'Amount' ? 'credit-card' : 'file-text'} size={14} color={colors.info} /></View>
                  <View style={styles.resultCopy}><Text style={[styles.resultName, { color: colors.ink }]}>{entity.name}</Text><Text style={[styles.resultKind, { color: colors.slate }]}>{entity.kind}</Text></View>
                  <Feather name="arrow-up-right" size={15} color={colors.info} />
                </Pressable>
              ))}
            </Surface>
          ) : null}

          <View style={[styles.demoNote, { backgroundColor: colors.infoSoft, borderColor: colors.accent }]}>
            <Feather name="info" size={14} color={colors.info} />
            <Text style={[styles.demoNoteText, { color: colors.secondaryForeground }]}>Sample graph view · Relationships are ready to connect to live entity data later.</Text>
          </View>

          <KnowledgeGraph
            entities={graphData}
            relationships={graphRelationships}
            selectedEntityId={selectedEntity.id}
            expandedRelationshipIds={expandedRelationshipIds}
            onSelectEntity={selectEntity}
            onExpandRelationship={expandRelationship}
          />

          <SectionTitle title="Entity details" />
          <Surface style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View style={[styles.detailIcon, { backgroundColor: colors.navy }]}><Feather name={selectedEntity.kind === 'Organization' ? 'briefcase' : selectedEntity.kind === 'Amount' ? 'credit-card' : 'file-text'} size={19} color={colors.white} /></View>
              <View style={styles.detailCopy}>
                <Text style={[styles.detailKind, { color: colors.info }]}>{selectedEntity.kind.toUpperCase()}</Text>
                <Text style={[styles.detailName, { color: colors.ink }]}>{selectedEntity.name}</Text>
              </View>
            </View>
            <Text style={[styles.detailText, { color: colors.slate }]}>{selectedEntity.detail}</Text>
            <View style={styles.actionRow}>
              <PrimaryButton label="View Entity" icon="crosshair" compact onPress={viewEntity} />
              <Pressable accessibilityRole="button" accessibilityLabel="View evidence" onPress={viewEvidence} style={({ pressed }) => [styles.secondaryAction, { borderColor: colors.border, backgroundColor: colors.white }, pressed && styles.pressed]}>
                <Feather name="bookmark" size={14} color={colors.info} />
                <Text style={[styles.secondaryActionText, { color: colors.info }]}>{showEvidence ? 'Hide evidence' : 'View evidence'}</Text>
              </Pressable>
            </View>
            {actionMessage ? <Text style={[styles.actionMessage, { color: colors.success }]}>{actionMessage}</Text> : null}
            {showEvidence ? (
              <View style={[styles.evidence, { backgroundColor: colors.infoSoft }]}>
                <View style={[styles.evidenceIcon, { backgroundColor: colors.white }]}><Feather name="file-text" size={14} color={colors.info} /></View>
                <View style={styles.evidenceCopy}><Text style={[styles.evidenceLabel, { color: colors.info }]}>SOURCE EVIDENCE</Text><Text style={[styles.evidenceText, { color: colors.secondaryForeground }]}>Evidence mapping to {selectedEntity.name} is available in source documents.</Text></View>
              </View>
            ) : null}
          </Surface>

          <SectionTitle title="Related documents" action={`${relatedDocuments.length} found`} />
          <View style={styles.documentList}>
            {relatedDocuments.map((document) => (
              <Surface key={document.id} style={styles.documentRow}>
                <View style={[styles.documentIcon, { backgroundColor: colors.paleBlue }]}><Feather name="file-text" size={17} color={colors.info} /></View>
                <View style={styles.documentCopy}><Text style={[styles.documentName, { color: colors.ink }]} numberOfLines={1}>{document.name}</Text><Text style={[styles.documentMeta, { color: colors.slate }]}>{document.kind} · PDF</Text></View>
                <Pressable accessibilityRole="button" accessibilityLabel={`View related document ${document.name}`} onPress={() => router.push({ pathname: '/document/[id]', params: { id: document.id } })} style={({ pressed }) => [styles.documentAction, { backgroundColor: colors.infoSoft }, pressed && styles.pressed]}>
                  <Feather name="arrow-up-right" size={15} color={colors.info} />
                </Pressable>
              </Surface>
            ))}
          </View>

          <SectionTitle title="Relationships" />
          <Surface style={styles.relationshipList}>
            {selectedRelationships.map((relationship, index) => {
              const otherId = relationship.from === selectedEntity.id ? relationship.to : relationship.from;
              const other = graphData.find((entity) => entity.id === otherId);
              const expanded = expandedRelationshipIds.includes(relationship.id);
              return (
                <View key={relationship.id} style={[styles.relationshipRow, index < selectedRelationships.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>
                  <View style={[styles.relationshipDot, { backgroundColor: colors.infoSoft }]}><Feather name="link" size={14} color={colors.info} /></View>
                  <View style={styles.relationshipCopy}><Text style={[styles.relationshipName, { color: colors.ink }]}>{relationship.label} · {other?.name}</Text><Text style={[styles.relationshipDetail, { color: colors.slate }]}>{expanded ? relationship.detail : 'Tap expand to inspect the source relationship.'}</Text></View>
                  <Pressable accessibilityRole="button" accessibilityLabel={`${expanded ? 'Collapse' : 'Expand'} relationship`} onPress={() => expandRelationship(relationship)} style={({ pressed }) => [styles.relationshipAction, { borderColor: colors.border }, pressed && styles.pressed]}>
                    <Feather name={expanded ? 'minus' : 'plus'} size={14} color={colors.info} />
                  </Pressable>
                </View>
              );
            })}
          </Surface>

          <SectionTitle title="Connected entities" />
          <View style={styles.connectedList}>
            {connectedEntities.length ? connectedEntities.map((entity) => (
              <Pressable key={entity.id} accessibilityRole="button" accessibilityLabel={`View connected entity ${entity.name}`} onPress={() => selectEntity(entity.id)} style={({ pressed }) => [styles.connectedRow, { backgroundColor: colors.white, borderColor: colors.border }, pressed && styles.pressed]}>
                <View style={[styles.connectedIcon, { backgroundColor: colors.secondary }]}><Feather name={entity.kind === 'Organization' ? 'briefcase' : entity.kind === 'Amount' ? 'credit-card' : 'file-text'} size={15} color={colors.navy} /></View>
                <View style={styles.connectedCopy}><Text style={[styles.connectedName, { color: colors.ink }]}>{entity.name}</Text><Text style={[styles.connectedKind, { color: colors.slate }]}>{entity.kind}</Text></View>
                <Feather name="chevron-right" size={16} color={colors.slate} />
              </Pressable>
            )) : <Text style={[styles.noConnections, { color: colors.slate }]}>No connected entities in this sample path.</Text>}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  search: { height: 48, borderRadius: 11, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular' },
  searchResults: { padding: 10, marginBottom: 10, borderRadius: 12 },
  searchResultsTitle: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginHorizontal: 4, marginBottom: 4 },
  searchResultRow: { minHeight: 46, flexDirection: 'row', alignItems: 'center', gap: 9, borderBottomWidth: 1, paddingHorizontal: 4 },
  resultIcon: { width: 29, height: 29, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  resultCopy: { flex: 1 },
  resultName: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  resultKind: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 2 },
  demoNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 11, borderRadius: 10, borderWidth: 1, marginBottom: 17 },
  demoNoteText: { flex: 1, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular' },
  detailCard: { marginBottom: 20 },
  detailHeader: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  detailIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  detailCopy: { flex: 1 },
  detailKind: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1, marginBottom: 3 },
  detailName: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  detailText: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular', marginTop: 13 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15 },
  secondaryAction: { minHeight: 40, flex: 1, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingHorizontal: 9 },
  secondaryActionText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  actionMessage: { fontSize: 10, fontFamily: 'Inter_500Medium', marginTop: 10 },
  evidence: { flexDirection: 'row', gap: 8, borderRadius: 10, padding: 10, marginTop: 12 },
  evidenceIcon: { width: 27, height: 27, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  evidenceCopy: { flex: 1 },
  evidenceLabel: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 0.8 },
  evidenceText: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginTop: 3 },
  documentList: { gap: 8, marginBottom: 20 },
  documentRow: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12 },
  documentIcon: { width: 35, height: 35, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  documentCopy: { flex: 1 },
  documentName: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  documentMeta: { fontSize: 9, fontFamily: 'Inter_400Regular', marginTop: 4 },
  documentAction: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  relationshipList: { paddingVertical: 4, marginBottom: 20 },
  relationshipRow: { flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 11 },
  relationshipDot: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  relationshipCopy: { flex: 1 },
  relationshipName: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  relationshipDetail: { fontSize: 9, lineHeight: 14, fontFamily: 'Inter_400Regular', marginTop: 3 },
  relationshipAction: { width: 28, height: 28, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  connectedList: { gap: 8, paddingBottom: 5 },
  connectedRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, padding: 11 },
  connectedIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  connectedCopy: { flex: 1 },
  connectedName: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  connectedKind: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  noConnections: { fontSize: 12, fontFamily: 'Inter_400Regular', paddingVertical: 12 },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});