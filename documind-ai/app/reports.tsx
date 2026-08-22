import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, PrimaryButton, SectionTitle, Surface } from '@/components/ui';
import { mockReports, reportTypes } from '@/mockData/reports';
import type { MockReport, ReportStatus, ReportType } from '@/types';
import { useColors } from '@/hooks/useColors';

function reportIcon(type: ReportType): keyof typeof Feather.glyphMap {
  if (type === 'Executive Summary') return 'bar-chart-2';
  if (type === 'Document Extraction Report') return 'file-text';
  if (type === 'Comparison Report') return 'git-merge';
  if (type === 'Risk Assessment Report') return 'alert-triangle';
  return 'layers';
}

function ReportStatusBadge({ status }: { status: ReportStatus }) {
  const colors = useColors();
  const palette = {
    Ready: { background: colors.successSoft, foreground: colors.success, icon: 'check-circle' as const },
    Generating: { background: colors.warningSoft, foreground: colors.warning, icon: 'loader' as const },
    Failed: { background: colors.dangerSoft, foreground: colors.destructive, icon: 'x-circle' as const },
  }[status];

  return (
    <View style={[styles.statusBadge, { backgroundColor: palette.background }]}>
      <Feather name={palette.icon} size={11} color={palette.foreground} />
      <Text style={[styles.statusText, { color: palette.foreground }]}>{status}</Text>
    </View>
  );
}

export default function ReportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<ReportType | 'All'>('All');
  const [selectedReportId, setSelectedReportId] = useState('full-intelligence');
  const [actionNotice, setActionNotice] = useState('');

  const filteredReports = useMemo(
    () => selectedType === 'All' ? mockReports : mockReports.filter((report) => report.type === selectedType),
    [selectedType],
  );
  const selectedReport = mockReports.find((report) => report.id === selectedReportId) ?? mockReports[0];

  const selectType = (type: ReportType | 'All') => {
    void Haptics.selectionAsync();
    setSelectedType(type);
    setActionNotice('');
  };

  const viewReport = (report: MockReport) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedReportId(report.id);
    setActionNotice(`Previewing ${report.name}.`);
  };

  const runPreviewAction = (action: 'Download' | 'Share', report: MockReport) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedReportId(report.id);
    setActionNotice(`${action} preview opened for ${report.name}. Actual export and sharing will connect later.`);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}>
              <Feather name="arrow-left" size={19} color={colors.ink} />
            </Pressable>
            <Text style={[styles.topBarTitle, { color: colors.ink }]}>Reports</Text>
            <View style={styles.topBarSpacer} />
          </View>

          <AppHeader title="Reports" subtitle="Review, share, and export intelligence from your documents." />

          <Surface style={styles.libraryCard}>
            <View style={styles.libraryHeader}>
              <View style={styles.libraryCopy}>
                <Text style={[styles.libraryEyebrow, { color: colors.info }]}>REPORT LIBRARY</Text>
                <Text style={[styles.libraryTitle, { color: colors.ink }]}>Your intelligence reports</Text>
              </View>
              <View style={[styles.reportCount, { backgroundColor: colors.infoSoft }]}>
                <Text style={[styles.reportCountText, { color: colors.info }]}>{mockReports.length} reports</Text>
              </View>
            </View>
            <Text style={[styles.libraryDetail, { color: colors.slate }]}>Choose a report type to narrow the workspace view.</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeRow}>
              <FilterChip label="All reports" selected={selectedType === 'All'} onPress={() => selectType('All')} />
              {reportTypes.map((type) => (
                <FilterChip key={type} label={type} selected={selectedType === type} onPress={() => selectType(type)} />
              ))}
            </ScrollView>
          </Surface>

          <SectionTitle title={`${filteredReports.length} ${filteredReports.length === 1 ? 'report' : 'reports'}`} action={selectedType === 'All' ? undefined : 'Clear filter'} onAction={() => selectType('All')} />
          <View style={styles.reportList}>
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} selected={report.id === selectedReportId} onView={viewReport} onDownload={(item) => runPreviewAction('Download', item)} onShare={(item) => runPreviewAction('Share', item)} />
            ))}
          </View>

          <SectionTitle title="Report preview" />
          <Surface style={styles.previewCard}>
            <View style={styles.previewTop}>
              <View style={[styles.previewIcon, { backgroundColor: colors.navy }]}><Feather name={reportIcon(selectedReport.type)} size={19} color={colors.white} /></View>
              <View style={styles.previewHeading}>
                <Text style={[styles.previewType, { color: colors.info }]}>{selectedReport.type.toUpperCase()}</Text>
                <Text style={[styles.previewName, { color: colors.ink }]}>{selectedReport.name}</Text>
              </View>
              <ReportStatusBadge status={selectedReport.status} />
            </View>

            <View style={[styles.previewMeta, { borderTopColor: colors.divider, borderBottomColor: colors.divider }]}>
              <MetaItem label="Created" value={selectedReport.created} />
              <MetaItem label="Pages" value={selectedReport.pages ? `${selectedReport.pages}` : '—'} />
              <MetaItem label="Status" value={selectedReport.status} />
            </View>

            <Text style={[styles.previewSectionLabel, { color: colors.ink }]}>Executive readout</Text>
            <Text style={[styles.previewSummary, { color: colors.slate }]}>{selectedReport.summary}</Text>

            <Text style={[styles.previewSectionLabel, { color: colors.ink }]}>Key findings</Text>
            <View style={styles.findings}>
              {selectedReport.highlights.map((highlight) => (
                <View key={highlight} style={styles.findingRow}>
                  <View style={[styles.findingDot, { backgroundColor: colors.info }]} />
                  <Text style={[styles.findingText, { color: colors.ink }]}>{highlight}</Text>
                </View>
              ))}
            </View>

            <View style={styles.previewActions}>
              <PrimaryButton label="View" icon="eye" compact onPress={() => viewReport(selectedReport)} />
              <PreviewAction icon="download" label="Download" onPress={() => runPreviewAction('Download', selectedReport)} />
              <PreviewAction icon="share-2" label="Share" onPress={() => runPreviewAction('Share', selectedReport)} />
            </View>
            {actionNotice ? <Text style={[styles.actionNotice, { color: colors.info }]}>{actionNotice}</Text> : null}
          </Surface>

          <View style={[styles.note, { backgroundColor: colors.infoSoft }]}>
            <Feather name="info" size={14} color={colors.info} />
            <Text style={[styles.noteText, { color: colors.secondaryForeground }]}>Reports shown here are fictional mock records. Generation, export, and sharing will be connected to a future service layer.</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function FilterChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Filter reports by ${label}`} onPress={onPress} style={({ pressed }) => [styles.typeChip, { backgroundColor: selected ? colors.primary : colors.background, borderColor: selected ? colors.primary : colors.border }, pressed && styles.pressed]}>
      <Text style={[styles.typeText, { color: selected ? colors.white : colors.slate }]}>{label}</Text>
    </Pressable>
  );
}

function ReportCard({ report, selected, onView, onDownload, onShare }: { report: MockReport; selected: boolean; onView: (report: MockReport) => void; onDownload: (report: MockReport) => void; onShare: (report: MockReport) => void }) {
  const colors = useColors();
  return (
    <Surface style={[styles.reportCard, selected && { borderColor: colors.info, borderWidth: 2 }]}>
      <View style={styles.reportHeader}>
        <View style={[styles.reportIcon, { backgroundColor: colors.paleBlue }]}><Feather name={reportIcon(report.type)} size={17} color={colors.info} /></View>
        <View style={styles.reportHeading}>
          <Text style={[styles.reportName, { color: colors.ink }]} numberOfLines={1}>{report.name}</Text>
          <Text style={[styles.reportType, { color: colors.info }]}>{report.type}</Text>
        </View>
        <ReportStatusBadge status={report.status} />
      </View>
      <View style={[styles.reportMetadata, { borderTopColor: colors.divider, borderBottomColor: colors.divider }]}>
        <MetaItem label="Name" value={report.name} compact />
        <MetaItem label="Type" value={report.type} compact />
        <MetaItem label="Created" value={report.created} compact />
        <MetaItem label="Status" value={report.status} compact />
      </View>
      <View style={styles.cardActions}>
        <SmallAction icon="eye" label="View" onPress={() => onView(report)} primary={selected} />
        <SmallAction icon="download" label="Download" onPress={() => onDownload(report)} />
        <SmallAction icon="share-2" label="Share" onPress={() => onShare(report)} />
      </View>
    </Surface>
  );
}

function MetaItem({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.metaItem, compact && styles.metaItemCompact]}>
      <Text style={[styles.metaLabel, { color: colors.slate }]}>{label}</Text>
      <Text style={[styles.metaValue, { color: colors.ink }]} numberOfLines={compact ? 1 : 2}>{value}</Text>
    </View>
  );
}

function SmallAction({ icon, label, onPress, primary = false }: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void; primary?: boolean }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.smallAction, { backgroundColor: primary ? colors.infoSoft : colors.background, borderColor: primary ? colors.accent : colors.border }, pressed && styles.pressed]}>
      <Feather name={icon} size={13} color={colors.info} />
      <Text style={[styles.smallActionText, { color: colors.info }]}>{label}</Text>
    </Pressable>
  );
}

function PreviewAction({ icon, label, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.previewAction, { backgroundColor: colors.background, borderColor: colors.border }, pressed && styles.pressed]}>
      <Feather name={icon} size={14} color={colors.info} />
      <Text style={[styles.previewActionText, { color: colors.info }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  topBarSpacer: { width: 32 },
  libraryCard: { marginBottom: 24 },
  libraryHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  libraryCopy: { flex: 1 },
  libraryEyebrow: { fontSize: 9, fontFamily: 'Inter_700Bold', letterSpacing: 1.1, marginBottom: 4 },
  libraryTitle: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  reportCount: { borderRadius: 7, paddingHorizontal: 8, paddingVertical: 6 },
  reportCountText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  libraryDetail: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', marginTop: 6 },
  typeRow: { gap: 8, paddingTop: 15 },
  typeChip: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  typeText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  reportList: { gap: 9, marginBottom: 24 },
  reportCard: { padding: 13 },
  reportHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  reportIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  reportHeading: { flex: 1 },
  reportName: { fontSize: 12, fontFamily: 'Inter_700Bold' },
  reportType: { fontSize: 10, fontFamily: 'Inter_500Medium', marginTop: 4 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 7, paddingHorizontal: 7, paddingVertical: 5 },
  statusText: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  reportMetadata: { flexDirection: 'row', flexWrap: 'wrap', rowGap: 10, borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 11, marginTop: 12 },
  metaItem: { flex: 1, minWidth: 80 },
  metaItemCompact: { flexBasis: '50%', flexGrow: 0 },
  metaLabel: { fontSize: 9, fontFamily: 'Inter_500Medium', marginBottom: 3 },
  metaValue: { fontSize: 10, lineHeight: 14, fontFamily: 'Inter_600SemiBold' },
  cardActions: { flexDirection: 'row', gap: 7, marginTop: 11 },
  smallAction: { flex: 1, minHeight: 34, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 8, borderWidth: 1 },
  smallActionText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  previewCard: { marginBottom: 14 },
  previewTop: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewIcon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  previewHeading: { flex: 1 },
  previewType: { fontSize: 8, fontFamily: 'Inter_700Bold', letterSpacing: 0.8, marginBottom: 4 },
  previewName: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  previewMeta: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 11, marginTop: 15, gap: 12 },
  previewSectionLabel: { fontSize: 12, fontFamily: 'Inter_700Bold', marginTop: 16, marginBottom: 6 },
  previewSummary: { fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  findings: { gap: 8 },
  findingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  findingDot: { width: 6, height: 6, borderRadius: 3 },
  findingText: { flex: 1, fontSize: 11, fontFamily: 'Inter_500Medium' },
  previewActions: { flexDirection: 'row', gap: 7, marginTop: 18 },
  previewAction: { flex: 1, minHeight: 40, borderRadius: 10, borderWidth: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  previewActionText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  actionNotice: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_500Medium', marginTop: 10 },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: 10 },
  noteText: { flex: 1, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular' },
  pressed: { opacity: 0.76, transform: [{ scale: 0.985 }] },
});