import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Surface } from '@/components/ui';
import { useColors } from '@/hooks/useColors';

type EvidenceCardProps = {
  result: string;
  document: string;
  page: string;
  evidence: string;
  confidence?: string;
  onPress?: () => void;
};

export function EvidenceCard({
  result,
  document,
  page,
  evidence,
  confidence = '94% confidence',
  onPress,
}: EvidenceCardProps) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View evidence for ${result}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [pressed && onPress && styles.pressed]}
    >
      <Surface style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.result, { color: colors.info }]}>{result.toUpperCase()}</Text>
          <View style={[styles.confidenceBadge, { backgroundColor: colors.successSoft }]}>
            <Text style={[styles.confidenceText, { color: colors.success }]}>{confidence}</Text>
          </View>
        </View>
        <View style={styles.pipeline}>
          <PipelineStep label="Source document" value={document} colors={colors} />
          <Feather name="chevron-right" size={12} color={colors.slate} />
          <PipelineStep label="Page" value={page} colors={colors} />
          <Feather name="chevron-right" size={12} color={colors.slate} />
          <View style={styles.evidenceCopy}>
            <Text style={[styles.stepLabel, { color: colors.slate }]}>Evidence</Text>
            <Text style={[styles.evidenceText, { color: colors.ink }]}>{evidence}</Text>
          </View>
        </View>
      </Surface>
    </Pressable>
  );
}

function PipelineStep({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.step}>
      <Text style={[styles.stepLabel, { color: colors.slate }]}>{label}</Text>
      <Text style={[styles.stepValue, { color: colors.ink }]} numberOfLines={2}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 12 },
  result: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, flex: 1 },
  confidenceBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 4 },
  confidenceText: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  pipeline: { flexDirection: 'row', alignItems: 'flex-start', gap: 4 },
  step: { flex: 1, minWidth: 60 },
  stepLabel: { fontSize: 8, fontFamily: 'Inter_500Medium', marginBottom: 3 },
  stepValue: { fontSize: 10, fontFamily: 'Inter_600SemiBold', lineHeight: 14 },
  evidenceCopy: { flex: 1.4 },
  evidenceText: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular' },
  pressed: { opacity: 0.78 },
});
