import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, Surface } from '@/components/ui';
import { useColors } from '@/hooks/useColors';

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [processingUpdates, setProcessingUpdates] = useState(true);
  const [insightAlerts, setInsightAlerts] = useState(true);
  const [showSources, setShowSources] = useState(true);
  const [notice, setNotice] = useState('');

  const toggle = (setter: (value: boolean) => void, value: boolean) => {
    void Haptics.selectionAsync();
    setter(value);
    setNotice('');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 34 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topBar}><Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><Feather name="arrow-left" size={19} color={colors.ink} /></Pressable><Text style={[styles.topBarTitle, { color: colors.ink }]}>Settings</Text><View style={styles.topBarSpacer} /></View>
          <AppHeader title="Settings" subtitle="Tune the DocuMind workspace to your review style." onNotification={() => router.push('/notifications')} />

          <SettingsSection title="Account">
            <SettingsRow icon="user" label="Profile" detail="Name, organization, and role" onPress={() => router.push('/(tabs)/profile')} />
            <SettingsRow icon="briefcase" label="Workspace" detail="Northstar Operations · Demo workspace" onPress={() => setNotice('Workspace management is available in the full product experience.')} last />
          </SettingsSection>

          <SettingsSection title="Appearance">
            <SettingsRow icon="sun" label="Interface theme" detail="Optimized for document readability" trailing={<Text style={[styles.staticValue, { color: colors.slate }]}>Light</Text>} last />
          </SettingsSection>

          <SettingsSection title="Notifications">
            <ToggleRow icon="bell" label="Processing updates" detail="Get notified when document processing changes" value={processingUpdates} onChange={(value) => toggle(setProcessingUpdates, value)} />
            <ToggleRow icon="eye" label="Insight alerts" detail="Highlight conflicts and important dates" value={insightAlerts} onChange={(value) => toggle(setInsightAlerts, value)} />
            <SettingsRow icon="inbox" label="Notification center" detail="Review all document, insight, report, and system alerts" onPress={() => router.push('/notifications')} last />
          </SettingsSection>

          <SettingsSection title="AI Preferences">
            <ToggleRow icon="file-text" label="Show source evidence" detail="Include document and page references with answers" value={showSources} onChange={(value) => toggle(setShowSources, value)} />
            <SettingsRow icon="message-square" label="Response style" detail="Clear, concise, and evidence-led" trailing={<Text style={[styles.staticValue, { color: colors.info }]}>Analyst</Text>} last />
          </SettingsSection>

          <SettingsSection title="Data & Privacy">
            <SettingsRow icon="database" label="Workspace data" detail="Sample records and local demo preferences" onPress={() => setNotice('Data and privacy controls are preview-only in this build.')} last />
          </SettingsSection>

          <SettingsSection title="Security">
            <SettingsRow icon="lock" label="Sign-in and sessions" detail="Authentication controls will be connected later" trailing={<Text style={[styles.staticValue, { color: colors.slate }]}>Preview</Text>} onPress={() => setNotice('Security controls are intentionally inactive in this sample build.')} last />
          </SettingsSection>

          <SettingsSection title="About">
            <SettingsRow icon="info" label="DocuMind AI" detail="AI document intelligence · Version 1.0" trailing={<Feather name="chevron-right" size={16} color={colors.slate} />} onPress={() => setNotice('DocuMind AI · AI-powered document intelligence')} last />
          </SettingsSection>

          <SettingsSection title="Support">
            <SettingsRow icon="help-circle" label="Help center" detail="Learn how to review documents and evidence" onPress={() => setNotice('Help center is available in the full product experience.')} last />
          </SettingsSection>

          {notice ? <View style={[styles.note, { backgroundColor: colors.infoSoft }]}><Feather name="info" size={15} color={colors.info} /><Text style={[styles.noteText, { color: colors.secondaryForeground }]}>{notice}</Text></View> : null}
          <View style={[styles.disclaimer, { borderColor: colors.border }]}><Feather name="shield" size={14} color={colors.slate} /><Text style={[styles.disclaimerText, { color: colors.slate }]}>Firebase, security, and privacy functionality are not active in this mock workspace.</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return <View style={styles.section}><Text style={[styles.sectionTitle, { color: colors.ink }]}>{title}</Text>{children}</View>;
}

function SettingsRow({ icon, label, detail, trailing, onPress, last = false }: { icon: keyof typeof Feather.glyphMap; label: string; detail: string; trailing?: React.ReactNode; onPress?: () => void; last?: boolean }) {
  const colors = useColors();
  const content = <><View style={[styles.rowIcon, { backgroundColor: colors.paleBlue }]}><Feather name={icon} size={17} color={colors.info} /></View><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: colors.ink }]}>{label}</Text><Text style={[styles.rowDetail, { color: colors.slate }]}>{detail}</Text></View>{trailing ?? <Feather name="chevron-right" size={16} color={colors.slate} />}</>;
  return onPress ? <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.divider }, pressed && styles.pressed]}>{content}</Pressable> : <View style={[styles.row, !last && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}>{content}</View>;
}

function ToggleRow({ icon, label, detail, value, onChange }: { icon: keyof typeof Feather.glyphMap; label: string; detail: string; value: boolean; onChange: (value: boolean) => void }) {
  const colors = useColors();
  return <View style={[styles.row, { borderBottomWidth: 1, borderBottomColor: colors.divider }]}><View style={[styles.rowIcon, { backgroundColor: colors.paleBlue }]}><Feather name={icon} size={17} color={colors.info} /></View><View style={styles.rowCopy}><Text style={[styles.rowTitle, { color: colors.ink }]}>{label}</Text><Text style={[styles.rowDetail, { color: colors.slate }]}>{detail}</Text></View><Switch accessibilityLabel={label} value={value} onValueChange={onChange} trackColor={{ false: colors.muted, true: colors.accent }} thumbColor={value ? colors.info : colors.slate} /></View>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  topBarSpacer: { width: 32 },
  section: { marginBottom: 19 },
  sectionTitle: { fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 9 },
  row: { minHeight: 59, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  rowIcon: { width: 35, height: 35, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  rowCopy: { flex: 1 },
  rowTitle: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  rowDetail: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginTop: 3 },
  staticValue: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  note: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 10, marginTop: 2, marginBottom: 12 },
  noteText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  disclaimer: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderWidth: 1, borderRadius: 10, padding: 11 },
  disclaimerText: { flex: 1, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});