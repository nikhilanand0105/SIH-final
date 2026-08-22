import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { Surface } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import type { GraphEntity } from '@/types';

export type KnowledgeGraphRelationship = {
  id: string;
  from: string;
  to: string;
  label: string;
  detail: string;
};

type KnowledgeGraphProps = {
  entities: GraphEntity[];
  relationships: KnowledgeGraphRelationship[];
  selectedEntityId: string;
  expandedRelationshipIds: string[];
  onSelectEntity: (entityId: string) => void;
  onExpandRelationship: (relationship: KnowledgeGraphRelationship) => void;
};

function entityIcon(kind: GraphEntity['kind']): keyof typeof Feather.glyphMap {
  if (kind === 'Organization') return 'briefcase';
  if (kind === 'Amount') return 'credit-card';
  return 'file-text';
}

export function KnowledgeGraph({
  entities,
  relationships,
  selectedEntityId,
  expandedRelationshipIds,
  onSelectEntity,
  onExpandRelationship,
}: KnowledgeGraphProps) {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const graphWidth = Math.max(260, width - 36);
  const entityById = new Map(entities.map((entity) => [entity.id, entity]));

  return (
    <Surface style={styles.surface}>
      <View style={styles.graphHeader}>
        <View>
          <Text style={[styles.graphEyebrow, { color: colors.info }]}>RELATIONSHIP VIEW</Text>
          <Text style={[styles.graphTitle, { color: colors.ink }]}>Connected evidence</Text>
        </View>
        <View style={[styles.graphCount, { backgroundColor: colors.infoSoft }]}>
          <Text style={[styles.graphCountText, { color: colors.info }]}>{entities.length} entities</Text>
        </View>
      </View>

      <View style={[styles.graphCanvas, { width: graphWidth, backgroundColor: colors.paleBlue, borderColor: colors.border }]}>
        {entities.map((entity, index) => {
          const outgoing = relationships.find((relationship) => relationship.from === entity.id);
          const isSelected = entity.id === selectedEntityId;
          const nextEntity = outgoing ? entityById.get(outgoing.to) : undefined;
          const isExpanded = outgoing ? expandedRelationshipIds.includes(outgoing.id) : false;

          return (
            <React.Fragment key={entity.id}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`View entity ${entity.name}`}
                onPress={() => onSelectEntity(entity.id)}
                style={({ pressed }) => [
                  styles.entityNode,
                  { backgroundColor: colors.white, borderColor: isSelected ? colors.info : colors.border },
                  isSelected && { borderWidth: 2, shadowColor: colors.info, shadowOpacity: 0.12, shadowRadius: 8, elevation: 2 },
                  pressed && styles.pressed,
                ]}
              >
                <View style={[styles.entityIcon, { backgroundColor: isSelected ? colors.infoSoft : colors.secondary }]}>
                  <Feather name={entityIcon(entity.kind)} size={17} color={isSelected ? colors.info : colors.navy} />
                </View>
                <View style={styles.entityCopy}>
                  <Text style={[styles.entityKind, { color: colors.slate }]}>{entity.kind.toUpperCase()}</Text>
                  <Text numberOfLines={1} style={[styles.entityName, { color: colors.ink }]}>{entity.name}</Text>
                  <Text numberOfLines={1} style={[styles.entityDetail, { color: colors.slate }]}>{entity.detail}</Text>
                </View>
                <Feather name="chevron-right" size={16} color={isSelected ? colors.info : colors.slate} />
              </Pressable>

              {outgoing && nextEntity ? (
                <View style={styles.relationshipWrap}>
                  <View style={[styles.relationshipLine, { backgroundColor: colors.accent }]} />
                  <View style={styles.relationshipMeta}>
                    <Text style={[styles.relationshipLabel, { color: colors.info }]}>{outgoing.label}</Text>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Expand relationship ${outgoing.label}`}
                      onPress={() => onExpandRelationship(outgoing)}
                      style={({ pressed }) => [
                        styles.expandButton,
                        { backgroundColor: colors.white, borderColor: colors.border },
                        pressed && styles.pressed,
                      ]}
                    >
                      <Feather name={isExpanded ? 'minus' : 'plus'} size={13} color={colors.info} />
                      <Text style={[styles.expandText, { color: colors.slate }]}>{isExpanded ? 'Collapse' : 'Expand'}</Text>
                    </Pressable>
                  </View>
                  {isExpanded ? (
                    <View style={[styles.expandedDetail, { backgroundColor: colors.infoSoft }]}>
                      <Feather name="link" size={13} color={colors.info} />
                      <Text style={[styles.expandedDetailText, { color: colors.secondaryForeground }]}>{outgoing.detail}</Text>
                    </View>
                  ) : null}
                  <View style={[styles.arrow, { borderBottomColor: colors.accent, borderRightColor: colors.accent }]} />
                </View>
              ) : null}
            </React.Fragment>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: colors.info }]} /><Text style={[styles.legendText, { color: colors.slate }]}>Selected entity</Text></View>
        <View style={styles.legendItem}><Feather name="link" size={12} color={colors.slate} /><Text style={[styles.legendText, { color: colors.slate }]}>Relationship evidence</Text></View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  surface: { marginBottom: 20, padding: 14 },
  graphHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 },
  graphEyebrow: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, marginBottom: 4 },
  graphTitle: { fontSize: 17, fontFamily: 'Inter_700Bold' },
  graphCount: { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 6 },
  graphCountText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  graphCanvas: { borderRadius: 12, borderWidth: 1, padding: 12 },
  entityNode: { minHeight: 70, borderRadius: 11, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 11, paddingVertical: 10 },
  entityIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  entityCopy: { flex: 1 },
  entityKind: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, marginBottom: 2 },
  entityName: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  entityDetail: { fontSize: 9, fontFamily: 'Inter_400Regular', marginTop: 3 },
  relationshipWrap: { alignItems: 'center', minHeight: 49, paddingTop: 3, paddingBottom: 3 },
  relationshipLine: { width: 1, height: 17 },
  relationshipMeta: { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 24 },
  relationshipLabel: { fontSize: 9, fontFamily: 'Inter_600SemiBold', letterSpacing: 0.2 },
  expandButton: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 4 },
  expandText: { fontSize: 9, fontFamily: 'Inter_500Medium' },
  expandedDetail: { alignSelf: 'stretch', flexDirection: 'row', alignItems: 'flex-start', gap: 6, borderRadius: 7, paddingHorizontal: 8, paddingVertical: 7, marginTop: 2 },
  expandedDetailText: { flex: 1, fontSize: 9, lineHeight: 13, fontFamily: 'Inter_400Regular' },
  arrow: { width: 8, height: 8, borderBottomWidth: 1.5, borderRightWidth: 1.5, transform: [{ rotate: '45deg' }], marginTop: 1 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 4 },
  legendText: { fontSize: 9, fontFamily: 'Inter_400Regular' },
  pressed: { opacity: 0.76, transform: [{ scale: 0.99 }] },
});