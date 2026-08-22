import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, PrimaryButton, Surface } from '@/components/ui';
import { IngestionService } from '@/services/ingestionService';
import { useColors } from '@/hooks/useColors';
import * as DocumentPicker from 'expo-document-picker';
import { DocumentInput, DocumentFile } from '@/types';

type UploadState = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export default function UploadScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [state, setState] = useState<UploadState>('idle');
  const [file, setFile] = useState<DocumentFile | null>(null);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets.length > 0) {
        const picked = result.assets[0];
        setFile({
          uri: picked.uri,
          name: picked.name,
          mimeType: picked.mimeType || 'application/octet-stream',
          size: picked.size
        });
      }
    } catch (e) {
      console.error('Error picking document', e);
    }
  };

  const startUpload = async () => {
    if (!file) return;
    setState('uploading');
    
    try {
      const input: DocumentInput = {
        source: 'file',
        file: file
      };
      
      const record = await IngestionService.uploadDocument(input);
      setState('success');
      setTimeout(() => {
        router.push({ pathname: '/processing', params: { id: record.id } });
      }, 800);
    } catch (e) {
      console.error(e);
      setState('error');
    }
  };

  const reset = () => {
    setState('idle');
    setFile(null);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 30 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}>
              <Feather name="arrow-left" size={20} color={colors.ink} />
            </Pressable>
            <Text style={[styles.topBarTitle, { color: colors.ink }]}>Upload document</Text>
            <View style={styles.spacer} />
          </View>

          <AppHeader title="Upload document" subtitle="Bring a file into the review workspace." />

          <Surface style={styles.uploadCard}>
            {state === 'idle' && (
              <>
                <Pressable accessibilityRole="button" accessibilityLabel="Choose a document file" onPress={pickDocument} style={[styles.dropZone, { borderColor: colors.accent, backgroundColor: colors.paleBlue }]}>
                  <View style={[styles.uploadIcon, { backgroundColor: colors.infoSoft }]}><Feather name="upload-cloud" size={24} color={colors.info} /></View>
                  <Text style={[styles.dropTitle, { color: colors.ink }]}>{file ? 'Change document' : 'Choose a document'}</Text>
                  <Text style={[styles.dropDetail, { color: colors.slate }]}>PDF, PNG, JPG up to 25 MB</Text>
                </Pressable>
                
                {file && (
                  <Surface style={styles.fileRow}>
                    <Feather name="file" size={19} color={colors.info} />
                    <View style={styles.fileCopy}>
                      <Text style={[styles.fileName, { color: colors.ink }]} numberOfLines={1}>{file.name}</Text>
                      <Text style={[styles.fileMeta, { color: colors.slate }]}>Ready to upload</Text>
                    </View>
                  </Surface>
                )}
                
                <PrimaryButton 
                  label="Upload and scan" 
                  icon="arrow-right" 
                  onPress={startUpload} 
                  disabled={!file}
                />
              </>
            )}

            {(state === 'uploading' || state === 'processing') && (
              <View style={styles.progressBlock}>
                <View style={[styles.stateIcon, { backgroundColor: colors.infoSoft }]}>
                  {state === 'uploading' ? <Feather name="upload-cloud" size={27} color={colors.info} /> : <Feather name="aperture" size={27} color={colors.info} />}
                </View>
                <Text style={[styles.stateTitle, { color: colors.ink }]}>{state === 'uploading' ? 'Uploading securely' : 'Preparing your review room'}</Text>
                <Text style={[styles.stateDetail, { color: colors.slate }]}>{state === 'uploading' ? 'Your original file stays intact.' : 'Checking pages and document structure.'}</Text>
                <View style={[styles.track, { backgroundColor: colors.muted }]}>
                  <View style={[styles.fill, { width: '100%', backgroundColor: colors.info }]} />
                </View>
              </View>
            )}

            {state === 'success' && (
              <View style={styles.progressBlock}>
                <View style={[styles.stateIcon, { backgroundColor: colors.successSoft }]}><Feather name="check-circle" size={30} color={colors.success} /></View>
                <Text style={[styles.stateTitle, { color: colors.ink }]}>Document is ready</Text>
                <Text style={[styles.stateDetail, { color: colors.slate }]}>Continuing to intelligence review...</Text>
              </View>
            )}

            {state === 'error' && (
              <View style={styles.progressBlock}>
                <View style={[styles.stateIcon, { backgroundColor: colors.dangerSoft }]}><Feather name="x-circle" size={29} color={colors.destructive} /></View>
                <Text style={[styles.stateTitle, { color: colors.ink }]}>Upload did not finish</Text>
                <Text style={[styles.stateDetail, { color: colors.slate }]}>The file may be too large or temporarily unavailable.</Text>
                <PrimaryButton label="Try again" icon="refresh-cw" secondary onPress={reset} />
              </View>
            )}
          </Surface>

          <Pressable onPress={() => router.push('/(tabs)/scan')} style={styles.scanLink}>
            <Text style={[styles.scanLinkText, { color: colors.info }]}>Scan a paper document instead</Text>
            <Feather name="camera" size={15} color={colors.info} />
          </Pressable>

          <Text style={[styles.note, { color: colors.slate }]}>Uploads are simulated and remain fictional sample data in this build.</Text>
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
  uploadCard: { marginBottom: 16 },
  dropZone: { minHeight: 170, borderWidth: 2, borderStyle: 'dashed', borderRadius: 16, alignItems: 'center', justifyContent: 'center', padding: 22, marginBottom: 12 },
  uploadIcon: { width: 54, height: 54, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  dropTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  dropDetail: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 6 },
  fileRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  fileCopy: { flex: 1 },
  fileName: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  fileMeta: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  progressBlock: { alignItems: 'center', paddingVertical: 20 },
  stateIcon: { width: 64, height: 64, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  stateTitle: { fontSize: 16, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  stateDetail: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 6, marginBottom: 16, paddingHorizontal: 12 },
  track: { width: '100%', height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  progressLabel: { fontSize: 11, fontFamily: 'Inter_700Bold', marginTop: 8 },
  scanLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8 },
  scanLinkText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  note: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 14 },
});
