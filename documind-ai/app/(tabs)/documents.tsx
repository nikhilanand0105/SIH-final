import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DocumentCard } from '@/components/DocumentCard';
import { AppHeader, EmptyState } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { documentService } from '@/services/documentService';
import { DocumentRecord } from '@/types';
import { useEffect } from 'react';

import { demoDocuments as mockDemoDocs } from '@/mockData';

export default function DocumentsScreen() {
  const [demoDocuments, setDemoDocuments] = useState<DocumentRecord[]>([]);
  useEffect(() => {
    documentService.list().then(setDemoDocuments).catch((e) => {
      console.warn('Backend unavailable, falling back to mock data:', e);
      setDemoDocuments(mockDemoDocs);
    });
  }, []);
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Needs Review', 'Processed', 'Processing'];
  const filtered = useMemo(() => demoDocuments.filter((document) => {
    const matchesQuery = document.filename.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All' || document.status === filter.toUpperCase();
    return matchesQuery && matchesFilter;
  }), [filter, query]);
  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <AppHeader title="Documents" subtitle={`${demoDocuments.length} sample records in this workspace`} />
          <View style={[styles.search, { backgroundColor: colors.white, borderColor: colors.border }]}>
            <Feather name="search" size={17} color={colors.slate} />
            <TextInput accessibilityLabel="Search documents" onChangeText={setQuery} placeholder="Search documents" placeholderTextColor={colors.slate} style={[styles.searchInput, { color: colors.ink }]} value={query} />
            <Feather name="sliders" size={17} color={colors.info} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
            {filters.map((item) => <Pressable key={item} accessibilityRole="button" accessibilityLabel={`Filter documents by ${item}`} onPress={() => setFilter(item)} style={({ pressed }) => [styles.filter, { backgroundColor: filter === item ? colors.primary : colors.white, borderColor: filter === item ? colors.primary : colors.border }, pressed && { opacity: 0.78 }]}><Text style={[styles.filterText, { color: filter === item ? colors.white : colors.slate }]}>{item}</Text></Pressable>)}
          </ScrollView>
          <View style={styles.listHeader}><Text style={[styles.count, { color: colors.slate }]}>{filtered.length} matching documents</Text><Pressable accessibilityRole="button" accessibilityLabel="Clear document filters" onPress={() => { setFilter('All'); setQuery(''); }} style={styles.clearButton}><Text style={[styles.clear, { color: colors.info }]}>Clear filters</Text></Pressable></View>
          {filtered.length ? filtered.map((document) => <DocumentCard key={document.id} document={document} />) : <EmptyState title="No documents found" detail="Try another search or clear the active filter." />}
          <View style={[styles.note, { backgroundColor: colors.infoSoft }]}><Feather name="info" size={15} color={colors.info} /><Text style={[styles.noteText, { color: colors.secondaryForeground }]}>Documents shown here are fictional sample records for the demo workspace.</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  search: { height: 48, borderRadius: 11, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9 },
  searchInput: { flex: 1, fontSize: 13, fontFamily: 'Inter_400Regular' },
  filters: { gap: 8, paddingVertical: 15 },
  filter: { minHeight: 44, borderRadius: 8, borderWidth: 1, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center' },
  filterText: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 },
  count: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  clear: { fontSize: 11, fontFamily: 'Inter_600SemiBold' },
  clearButton: { minHeight: 44, justifyContent: 'center' },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: 10, marginTop: 8 },
  noteText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
});
