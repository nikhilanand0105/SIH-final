import { Feather } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { CameraView, useCameraPermissions, FlashMode } from 'expo-camera';

export type DocumentScannerProps = {
  capturedPhoto: string | null;
  onCapture: (uri: string) => void;
  onRetake: () => void;
  onUseDocument: (uri: string) => void;
};

export function DocumentScanner({ capturedPhoto, onCapture, onRetake, onUseDocument }: DocumentScannerProps) {
  const colors = useColors();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<FlashMode>('off');
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return (
      <View style={[styles.placeholder, { backgroundColor: colors.navy }]}>
        <Text style={{ color: colors.white }}>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.placeholder, { backgroundColor: colors.navy, padding: 24 }]}>
        <Feather name="camera-off" size={44} color={colors.accent} />
        <Text style={[styles.placeholderText, { color: colors.white, textAlign: 'center', marginTop: 16 }]}>
          We need your permission to use the camera for scanning documents.
        </Text>
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.info, marginTop: 24 }]}
          onPress={requestPermission}
        >
          <Text style={[styles.primaryBtnText, { color: colors.white }]}>Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: false });
        if (photo && photo.uri) {
          onCapture(photo.uri);
        }
      } catch (e) {
        console.error("Failed to capture image", e);
      }
    }
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.frame, { borderColor: colors.info }]}>
        <View style={[styles.corner, styles.cornerTopLeft, { borderColor: colors.white }]} />
        <View style={[styles.corner, styles.cornerTopRight, { borderColor: colors.white }]} />
        <View style={[styles.corner, styles.cornerBottomLeft, { borderColor: colors.white }]} />
        <View style={[styles.corner, styles.cornerBottomRight, { borderColor: colors.white }]} />

        {capturedPhoto ? (
          <View style={styles.preview}>
            <Image source={{ uri: capturedPhoto }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
            <View style={[styles.previewOverlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <Text style={[styles.previewLabel, { color: colors.white }]}>Captured page preview</Text>
              <Text style={[styles.previewMeta, { color: colors.slate }]}>Ready for processing</Text>
            </View>
          </View>
        ) : (
          <CameraView 
            style={StyleSheet.absoluteFillObject} 
            facing={facing} 
            flash={flash}
            ref={cameraRef}
          >
            <View style={styles.gridOverlay} />
          </CameraView>
        )}
      </View>

      <View style={styles.controls}>
        <Pressable accessibilityLabel="Flash" style={styles.circleControl} onPress={toggleFlash} disabled={!!capturedPhoto}>
          <Feather name={flash === 'on' ? 'zap' : 'zap-off'} size={19} color={capturedPhoto ? colors.muted : (flash === 'on' ? colors.warning : colors.white)} />
        </Pressable>
        
        <Pressable
          accessibilityLabel={capturedPhoto ? 'Retake document' : 'Capture document'}
          onPress={capturedPhoto ? onRetake : handleCapture}
          style={[styles.capture, { backgroundColor: colors.white }]}
        >
          <View style={[styles.captureInner, { backgroundColor: colors.info }]}>
            <Feather name={capturedPhoto ? 'refresh-cw' : 'camera'} size={22} color={colors.white} />
          </View>
        </Pressable>
        
        <Pressable accessibilityLabel="Switch camera" style={styles.circleControl} onPress={toggleCameraFacing} disabled={!!capturedPhoto}>
          <Feather name="refresh-ccw" size={19} color={capturedPhoto ? colors.muted : colors.white} />
        </Pressable>
      </View>

      {capturedPhoto ? (
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Retake"
            onPress={onRetake}
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.white }]}>Retake</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Use document"
            onPress={() => onUseDocument(capturedPhoto)}
            style={[styles.primaryBtn, { backgroundColor: colors.successSoft }]}
          >
            <Text style={[styles.primaryBtnText, { color: colors.success }]}>Use document</Text>
            <Feather name="arrow-right" size={14} color={colors.success} />
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  frame: {
    flex: 1,
    minHeight: 380,
    borderWidth: 1,
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  corner: { width: 30, height: 30, position: 'absolute', zIndex: 10 },
  cornerTopLeft: { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTopRight: { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBottomLeft: { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBottomRight: { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3 },
  placeholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
    backgroundColor: 'transparent',
  },
  placeholderText: { fontSize: 14, fontFamily: 'Inter_600SemiBold', marginTop: 14 },
  preview: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  previewOverlay: {
    position: 'absolute',
    bottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  previewLabel: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  previewMeta: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 4 },
  controls: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 20 },
  circleControl: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  capture: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center' },
  captureInner: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  actions: { flexDirection: 'row', justifyContent: 'center', gap: 12, paddingBottom: 8 },
  secondaryBtn: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  secondaryBtnText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryBtnText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
});
