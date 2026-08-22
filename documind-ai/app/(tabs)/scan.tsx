import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DocumentScanner } from '@/components/scanner/DocumentScanner';
import { AppHeader, Surface } from '@/components/ui';
import { useColors } from '@/hooks/useColors';

import { IngestionService } from '@/services/ingestionService';
import { DocumentInput } from '@/types';

export default function ScanScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUseDocument = async (uri: string) => {
    setIsProcessing(true);
    const input: DocumentInput = {
      source: 'camera',
      file: { uri, name: 'scanned_document.jpg', mimeType: 'image/jpeg' }
    };
    try {
      const result = await IngestionService.uploadDocument(input);
      router.push({ pathname: '/processing', params: { id: result.id } });
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.navy, paddingTop: insets.top + 18, paddingBottom: insets.bottom + 80 }]}>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <AppHeader title="Scan document" subtitle="Position the document inside the frame." light />
          <Pressable accessibilityRole="button" accessibilityLabel="Close scanner" onPress={() => router.back()} style={styles.closeButton}>
            <Feather name="x" size={21} color={colors.white} />
          </Pressable>
        </View>

        <DocumentScanner
          capturedPhoto={capturedPhoto}
          onCapture={(uri) => setCapturedPhoto(uri)}
          onRetake={() => setCapturedPhoto(null)}
          onUseDocument={handleUseDocument}
        />

        {!capturedPhoto ? (
          <Surface style={[styles.tipCard, { backgroundColor: colors.white }]}>
            <Feather name="info" size={15} color={colors.info} />
            <Text style={[styles.tipText, { color: colors.slate }]}>Keep the page flat and well lit for clearer extraction.</Text>
          </Surface>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 18 },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  closeButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  tipCard: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, marginTop: 8 },
  tipText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
});
