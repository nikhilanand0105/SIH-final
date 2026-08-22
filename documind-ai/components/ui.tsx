import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

type IconName = keyof typeof Feather.glyphMap;

export function LogoMark({ compact = false }: { compact?: boolean }) {
  const colors = useColors();
  return (
    <View style={[styles.logoMark, { backgroundColor: colors.primary }, compact && styles.logoMarkCompact]}>
      <View style={[styles.logoSheet, { backgroundColor: colors.white }]}>
        <View style={[styles.logoLine, { backgroundColor: colors.primary }]} />
        <View style={[styles.logoLineShort, { backgroundColor: colors.info }]} />
        <View style={[styles.logoNode, { backgroundColor: colors.info }]} />
      </View>
    </View>
  );
}

export function BrandLockup({ light = false }: { light?: boolean }) {
  const colors = useColors();
  return (
    <View style={styles.brandLockup}>
      <LogoMark />
      <View>
        <Text style={[styles.brandName, { color: light ? colors.white : colors.navy }]}>DOCUMIND</Text>
        <Text style={[styles.brandSub, { color: light ? colors.accent : colors.slate }]}>AI-POWERED DOCUMENT INTELLIGENCE</Text>
      </View>
    </View>
  );
}

export function AppHeader({
  title,
  subtitle,
  onNotification,
  onProfile,
  light = false,
}: {
  title: string;
  subtitle?: string;
  onNotification?: () => void;
  onProfile?: () => void;
  light?: boolean;
}) {
  const colors = useColors();
  const notificationPress = onNotification ?? (() => router.push('/notifications'));
  const profilePress = onProfile ?? (() => router.push('/(tabs)/profile'));
  return (
    <View style={styles.header}>
      <View style={styles.headerTitle}>
        <Text style={[styles.overline, { color: light ? colors.accent : colors.info }]}>DOCUMIND AI</Text>
        <Text style={[styles.headerHeading, { color: light ? colors.white : colors.ink }]}>{title}</Text>
        {subtitle ? <Text style={[styles.headerSubtitle, { color: light ? colors.accent : colors.slate }]}>{subtitle}</Text> : null}
      </View>
      <View style={styles.headerActions}>
        <IconButton icon="bell" label="Notifications" onPress={notificationPress} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          onPress={profilePress}
          style={({ pressed }) => [styles.avatar, { backgroundColor: colors.navy }, pressed && styles.pressed]}
        >
          <Text style={[styles.avatarText, { color: colors.white }]}>AM</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function IconButton({
  icon,
  label,
  onPress,
  tint,
}: {
  icon: IconName;
  label: string;
  onPress?: () => void;
  tint?: string;
}) {
  const colors = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.white, borderColor: colors.border }, pressed && styles.pressed]}
    >
      <Feather name={icon} size={18} color={tint ?? colors.ink} />
    </Pressable>
  );
}

export function Surface({ children, style }: { children: React.ReactNode; style?: object }) {
  const colors = useColors();
  return <View style={[styles.surface, { backgroundColor: colors.card, borderColor: colors.border }, style]}>{children}</View>;
}

export function PrimaryButton({
  label,
  icon,
  onPress,
  loading = false,
  secondary = false,
  compact = false,
  disabled = false,
}: {
  label: string;
  icon?: IconName;
  onPress?: () => void;
  loading?: boolean;
  secondary?: boolean;
  compact?: boolean;
  disabled?: boolean;
}) {
  const colors = useColors();
  const backgroundColor = secondary ? colors.secondary : colors.primary;
  const foreground = secondary ? colors.secondaryForeground : colors.primaryForeground;
  const isDisabled = loading || disabled;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.primaryButton,
        compact && styles.primaryButtonCompact,
        { backgroundColor },
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? <ActivityIndicator size="small" color={foreground} /> : icon ? <Feather name={icon} size={16} color={foreground} /> : null}
      <Text style={[styles.primaryButtonText, { color: foreground }]}>{label}</Text>
    </Pressable>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const colors = useColors();
  const isSuccess = status === 'Processed';
  const isWarning = status === 'Needs Review' || status === 'Processing';
  const backgroundColor = isSuccess ? colors.successSoft : isWarning ? colors.warningSoft : colors.muted;
  const foreground = isSuccess ? colors.success : isWarning ? colors.warning : colors.slate;
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <View style={[styles.badgeDot, { backgroundColor: foreground }]} />
      <Text style={[styles.badgeText, { color: foreground }]}>{status}</Text>
    </View>
  );
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  icon: IconName;
  tone: 'navy' | 'green' | 'amber' | 'red';
}) {
  const colors = useColors();
  const toneMap = {
    navy: { background: colors.navy, foreground: colors.white, icon: colors.accent },
    green: { background: colors.successSoft, foreground: colors.success, icon: colors.success },
    amber: { background: colors.warningSoft, foreground: colors.warning, icon: colors.warning },
    red: { background: colors.dangerSoft, foreground: colors.destructive, icon: colors.destructive },
  } as const;
  const selected = toneMap[tone];
  return (
    <Surface style={[styles.metricCard, { backgroundColor: selected.background, borderColor: selected.background }]}>
      <View style={styles.metricTop}>
        <Text style={[styles.metricLabel, { color: tone === 'navy' ? colors.accent : colors.slate }]}>{label}</Text>
        <Feather name={icon} size={17} color={selected.icon} />
      </View>
      <Text style={[styles.metricValue, { color: selected.foreground }]}>{value}</Text>
      <Text style={[styles.metricDetail, { color: tone === 'navy' ? colors.accent : colors.slate }]}>{detail}</Text>
    </Surface>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.sectionTitle}>
      <Text style={[styles.sectionTitleText, { color: colors.ink }]}>{title}</Text>
      {action ? (
           <Pressable accessibilityRole="button" accessibilityLabel={action} onPress={onAction} style={styles.sectionActionButton}>
          <Text style={[styles.sectionAction, { color: colors.info }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function EmptyState({ title, detail, icon = 'file-text' }: { title: string; detail: string; icon?: IconName }) {
  const colors = useColors();
  return (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: colors.paleBlue }]}>
        <Feather name={icon} size={22} color={colors.info} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.ink }]}>{title}</Text>
      <Text style={[styles.emptyDetail, { color: colors.slate }]}>{detail}</Text>
    </View>
  );
}

export const styles = StyleSheet.create({
  logoMark: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  logoMarkCompact: { width: 32, height: 32, borderRadius: 9 },
  logoSheet: { width: 20, height: 24, borderRadius: 3, paddingTop: 7, paddingLeft: 4, position: 'relative' },
  logoLine: { height: 2, width: 11, borderRadius: 2, marginBottom: 3 },
  logoLineShort: { height: 2, width: 7, borderRadius: 2 },
  logoNode: { width: 5, height: 5, borderRadius: 3, position: 'absolute', right: -3, top: 5 },
  brandLockup: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  brandName: { fontSize: 16, fontFamily: 'Inter_700Bold', letterSpacing: 1.5 },
  brandSub: { fontSize: 7, fontFamily: 'Inter_600SemiBold', letterSpacing: 1.1, marginTop: 2 },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', paddingBottom: 18 },
  headerTitle: { flex: 1 },
  overline: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.3, marginBottom: 6 },
  headerHeading: { fontSize: 27, fontFamily: 'Inter_700Bold', letterSpacing: -0.7 },
  headerSubtitle: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 5, lineHeight: 19 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 3 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontFamily: 'Inter_700Bold' },
  iconButton: { width: 44, height: 44, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  surface: { borderRadius: 10, borderWidth: 1, padding: 15, shadowColor: '#0B2945', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  primaryButton: { minHeight: 52, borderRadius: 10, paddingHorizontal: 17, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonCompact: { minHeight: 44, borderRadius: 10, paddingHorizontal: 13 },
  primaryButtonText: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
  disabled: { opacity: 0.6 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 5, borderRadius: 7 },
  badgeDot: { width: 5, height: 5, borderRadius: 3 },
  badgeText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  metricCard: { width: 156, minHeight: 124, padding: 14 },
  metricTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  metricLabel: { fontSize: 11, fontFamily: 'Inter_500Medium', flex: 1, lineHeight: 15 },
  metricValue: { fontSize: 27, fontFamily: 'Inter_700Bold', letterSpacing: -0.8 },
  metricDetail: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 5 },
  sectionTitle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 },
  sectionTitleText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  sectionAction: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  sectionActionButton: { minHeight: 44, justifyContent: 'center' },
  emptyState: { alignItems: 'center', paddingVertical: 28, paddingHorizontal: 22 },
  emptyIcon: { width: 48, height: 48, borderRadius: 15, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emptyTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  emptyDetail: { fontSize: 13, fontFamily: 'Inter_400Regular', lineHeight: 19, textAlign: 'center', marginTop: 5 },
});