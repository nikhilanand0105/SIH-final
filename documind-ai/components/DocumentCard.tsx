import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { StatusBadge, Surface } from '@/components/ui';
import type { DocumentRecord } from '@/types';

export function DocumentCard({ document }: { document: DocumentRecord }) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ${document.filename}`}
      onPress={() => router.push({ pathname: '/document/[id]', params: { id: document.id } })}
      style={({ pressed }) => [pressed && { opacity: 0.78 }]}
    >
      <Surface style={styles.card}>
        <View style={styles.row}>
          <View style={[styles.fileIcon, { backgroundColor: colors.paleBlue }]}>
            <Feather name={(document.category || 'PDF') === 'Image' ? 'image' : 'file-text'} size={18} color={colors.info} />
          </View>
          <View style={styles.copy}>
            <Text numberOfLines={1} style={[styles.name, { color: colors.ink }]}>{document.filename}</Text>
            <Text style={[styles.meta, { color: colors.slate }]}>{(document.category || 'PDF')} · {(document.page_count || 1)} pages · {document.created_at}</Text>
          </View>
          <Feather name="chevron-right" size={17} color={colors.slate} />
        </View>
        <View style={[styles.bottom, { borderTopColor: colors.divider }]}>
          <StatusBadge status={document.status} />
          <View style={styles.confidence}>
            <Text style={[styles.confidenceValue, { color: colors.ink }]}>{document.confidence}%</Text>
            <Text style={[styles.confidenceLabel, { color: colors.slate }]}>confidence</Text>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10, padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center' },
  fileIcon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, marginHorizontal: 11 },
  name: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  meta: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
  bottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 13, paddingTop: 12, borderTopWidth: 1 },
  confidence: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  confidenceValue: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  confidenceLabel: { fontSize: 10, fontFamily: 'Inter_400Regular' },
});
