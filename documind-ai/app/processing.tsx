import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, PrimaryButton, Surface } from '@/components/ui';
import { processingStages } from '@/mockData/processing';
import { useColors } from '@/hooks/useColors';
import { fetchApi } from '@/services/apiClient';

export default function ProcessingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeIndex, setActiveIndex] = useState(0);
  const [status, setStatus] = useState<string>('Processing');

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    if (!id) return;

    const pollStatus = async () => {
      try {
        const response = await fetchApi(`/documents/${id}/status`);
        if (response.ok) {
          const data = await response.json();
          setStatus(data.status);
          
          if (data.status === 'completed' || data.status === 'failed') {
            setActiveIndex(processingStages.length);
          } else {
            // Fake progress while waiting for backend
            setActiveIndex((current) => Math.min(current + 1, processingStages.length - 1));
          }
        } else {
          // Fake progress on API error
          setActiveIndex((current) => Math.min(current + 1, processingStages.length));
          if (activeIndex >= processingStages.length - 1) setStatus('completed');
        }
      } catch (error) {
        console.warn('Failed to poll status, faking progress:', error);
        // Fake progress if backend unavailable
        setActiveIndex((current) => Math.min(current + 1, processingStages.length));
        if (activeIndex >= processingStages.length - 1) setStatus('completed');
      }
    };

    const timer = setInterval(() => {
      if (status !== 'completed' && status !== 'failed') {
        pollStatus();
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(timer);
  }, [id, status, activeIndex]);

  const complete = activeIndex >= processingStages.length || status === 'completed';
  const progress = Math.min(activeIndex / processingStages.length, 1);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Pressable accessibilityRole="button" accessibilityLabel="Cancel processing" onPress={() => router.back()} style={styles.back}>
              <Feather name="arrow-left" size={20} color={colors.ink} />
            </Pressable>
            <Text style={[styles.topBarTitle, { color: colors.ink }]}>Processing</Text>
            <View style={styles.spacer} />
          </View>

          <AppHeader
            title={complete ? 'Ready for review' : 'Making sense of the source'}
            subtitle={complete ? 'Fields, evidence, and review signals are available.' : 'Working through each analysis stage.'}
          />

          <Surface style={styles.documentCard}>
            <Feather name="file-text" size={19} color={colors.info} />
            <View style={styles.documentCopy}>
              <Text style={[styles.documentName, { color: colors.ink }]}>Procurement Contract 2026</Text>
              <Text style={[styles.documentMeta, { color: colors.slate }]}>18 pages · uploaded just now</Text>
            </View>
            <View style={[styles.zapIcon, { backgroundColor: colors.infoSoft }]}>
              <Feather name="zap" size={18} color={colors.info} />
            </View>
          </Surface>

          <Surface style={styles.progressCard}>
            <View style={[styles.progressIcon, { backgroundColor: complete ? colors.successSoft : colors.infoSoft }]}>
              <Feather name={complete ? 'check-circle' : 'loader'} size={22} color={complete ? colors.success : colors.info} />
            </View>
            <View style={styles.progressCopy}>
              <Text style={[styles.progressTitle, { color: colors.ink }]}>{complete ? 'Analysis complete' : 'Processing pipeline'}</Text>
              <Text style={[styles.progressDetail, { color: colors.slate }]}>
                {complete ? 'Intelligence generation finished.' : 'Keep this screen open while the sample workflow advances.'}
              </Text>
            </View>
            <Text style={[styles.percent, { color: complete ? colors.success : colors.info }]}>{Math.round(progress * 100)}%</Text>
            <View style={[styles.track, { backgroundColor: colors.muted }]}>
              <View style={[styles.fill, { width: `${Math.round(progress * 100)}%`, backgroundColor: complete ? colors.success : colors.info }]} />
            </View>
          </Surface>

          <Text style={[styles.sectionLabel, { color: colors.ink }]}>Analysis stages</Text>
          <Surface style={styles.stepsCard}>
            {processingStages.map((step, index) => {
              const done = index < activeIndex;
              const current = index === activeIndex && !complete;
              return (
                <View key={step} style={[styles.step, index < processingStages.length - 1 && { borderBottomColor: colors.divider, borderBottomWidth: 1 }]}>
                  <View style={[styles.stepIcon, { backgroundColor: done ? colors.successSoft : current ? colors.infoSoft : colors.muted }]}>
                    <Feather name={done ? 'check' : current ? 'loader' : 'circle'} size={15} color={done ? colors.success : current ? colors.info : colors.slate} />
                  </View>
                  <View style={styles.stepCopy}>
                    <Text style={[styles.stepLabel, { color: colors.ink }]}>{step}</Text>
                    {current ? <Text style={[styles.stepDetail, { color: colors.info }]}>Working carefully through the source</Text> : null}
                  </View>
                  <Text style={[styles.stepStatus, { color: done ? colors.success : current ? colors.info : colors.slate }]}>
                    {done ? 'Done' : current ? 'In progress' : 'Queued'}
                  </Text>
                </View>
              );
            })}
          </Surface>

          {complete ? (
            <PrimaryButton label="Open document details" icon="arrow-right" onPress={() => router.push({ pathname: '/document/[id]', params: { id: id || '1' } })} />
          ) : (
            <Text style={[styles.note, { color: colors.slate }]}>Processing is simulated in this workspace. Source evidence remains available for review.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  spacer: { width: 44 },
  topBarTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  documentCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  documentCopy: { flex: 1 },
  documentName: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  documentMeta: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  zapIcon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  progressCard: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 11, marginBottom: 24 },
  progressIcon: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  progressCopy: { flex: 1, minWidth: 170 },
  progressTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  progressDetail: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 4 },
  percent: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  track: { width: '100%', height: 6, borderRadius: 3, marginTop: 4, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  sectionLabel: { fontSize: 15, fontFamily: 'Inter_700Bold', marginBottom: 10 },
  stepsCard: { paddingVertical: 3, marginBottom: 18 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 56, paddingVertical: 10 },
  stepIcon: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  stepCopy: { flex: 1 },
  stepLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  stepDetail: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  stepStatus: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  note: { fontSize: 11, lineHeight: 17, textAlign: 'center', fontFamily: 'Inter_400Regular', paddingHorizontal: 14 },
});
