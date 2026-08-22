import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, EmptyState, SectionTitle, Surface } from '@/components/ui';
import { useColors } from '@/hooks/useColors';
import { notifications as mockNotifications } from '@/mockData';
import type { NotificationItem } from '@/types';

type NotificationCategory = 'Document Processing' | 'Insights' | 'Reports' | 'System';

const categories: NotificationCategory[] = ['Document Processing', 'Insights', 'Reports', 'System'];

const categoryIcons: Record<NotificationCategory, keyof typeof Feather.glyphMap> = {
  'Document Processing': 'file-text',
  Insights: 'alert-triangle',
  Reports: 'bar-chart-2',
  System: 'settings',
};

const systemNotification: NotificationItem = {
  id: '4',
  category: 'System',
  title: 'Workspace is ready',
  detail: 'Your sample DocuMind workspace is ready to explore.',
  time: 'Yesterday',
  read: true,
  tone: 'blue',
};

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const allNotifications = useMemo(() => [...mockNotifications, systemNotification], []);
  const [filter, setFilter] = useState<NotificationCategory | 'All'>('All');
  const [readIds, setReadIds] = useState<string[]>(allNotifications.filter((item) => item.read).map((item) => item.id));
  const unreadCount = allNotifications.filter((item) => !readIds.includes(item.id)).length;
  const visibleNotifications = filter === 'All' ? allNotifications : allNotifications.filter((item) => item.category === filter);

  const markRead = (notification: NotificationItem) => {
    void Haptics.selectionAsync();
    setReadIds((current) => current.includes(notification.id) ? current : [...current, notification.id]);
  };

  const markAllRead = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setReadIds(allNotifications.map((item) => item.id));
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 34 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.topBar}><Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}><Feather name="arrow-left" size={19} color={colors.ink} /></Pressable><Text style={[styles.topBarTitle, { color: colors.ink }]}>Notifications</Text><View style={styles.topBarSpacer} /></View>
          <AppHeader title="Notifications" subtitle="Stay current on the signals that need your attention." />

          <Surface style={styles.summaryCard}>
            <View style={[styles.summaryIcon, { backgroundColor: colors.navy }]}><Feather name="bell" size={19} color={colors.white} /></View>
            <View style={styles.summaryCopy}><Text style={[styles.summaryTitle, { color: colors.ink }]}>{unreadCount ? `${unreadCount} unread updates` : 'You are all caught up'}</Text><Text style={[styles.summaryDetail, { color: colors.slate }]}>Document activity, insights, reports, and system updates.</Text></View>
            {unreadCount ? <Pressable accessibilityRole="button" accessibilityLabel="Mark all notifications read" onPress={markAllRead}><Text style={[styles.markAll, { color: colors.info }]}>Mark all read</Text></Pressable> : null}
          </Surface>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
            <FilterChip label="All" selected={filter === 'All'} onPress={() => setFilter('All')} />
            {categories.map((category) => <FilterChip key={category} label={category} selected={filter === category} onPress={() => setFilter(category)} />)}
          </ScrollView>

          <SectionTitle title={filter === 'All' ? 'Recent activity' : filter} action={`${visibleNotifications.length} updates`} />
          {visibleNotifications.length ? (
            <View style={styles.notificationList}>
              {visibleNotifications.map((notification) => <NotificationRow key={notification.id} notification={notification} read={readIds.includes(notification.id)} onPress={() => markRead(notification)} />)}
            </View>
          ) : <Surface><EmptyState title="No updates in this category" detail="New activity will appear here when the workspace has something to review." icon={categoryIcons[filter as NotificationCategory]} /></Surface>}

          {filter === 'All' ? (
            <View style={styles.categoryOverview}>
              <SectionTitle title="Notification categories" />
              {categories.map((category) => {
                const categoryCount = allNotifications.filter((item) => item.category === category).length;
                const categoryUnread = allNotifications.filter((item) => item.category === category && !readIds.includes(item.id)).length;
                return <Pressable key={category} accessibilityRole="button" accessibilityLabel={`Open ${category} notifications`} onPress={() => setFilter(category)} style={({ pressed }) => [styles.categoryRow, { backgroundColor: colors.white, borderColor: colors.border }, pressed && styles.pressed]}><View style={[styles.categoryIcon, { backgroundColor: colors.paleBlue }]}><Feather name={categoryIcons[category]} size={16} color={colors.info} /></View><View style={styles.categoryCopy}><Text style={[styles.categoryName, { color: colors.ink }]}>{category}</Text><Text style={[styles.categoryDetail, { color: colors.slate }]}>{categoryCount} {categoryCount === 1 ? 'update' : 'updates'}</Text></View>{categoryUnread ? <View style={[styles.unreadPill, { backgroundColor: colors.infoSoft }]}><Text style={[styles.unreadPillText, { color: colors.info }]}>{categoryUnread} new</Text></View> : <Feather name="chevron-right" size={16} color={colors.slate} />}</Pressable>;
              })}
            </View>
          ) : null}

          <View style={[styles.note, { backgroundColor: colors.infoSoft }]}><Feather name="info" size={14} color={colors.info} /><Text style={[styles.noteText, { color: colors.secondaryForeground }]}>Notifications shown here are fictional sample updates. Notification delivery is not connected in this build.</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

function FilterChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const colors = useColors();
  return <Pressable accessibilityRole="button" accessibilityLabel={`Filter notifications by ${label}`} onPress={onPress} style={({ pressed }) => [styles.filterChip, { backgroundColor: selected ? colors.primary : colors.white, borderColor: selected ? colors.primary : colors.border }, pressed && styles.pressed]}><Text style={[styles.filterText, { color: selected ? colors.white : colors.slate }]}>{label}</Text></Pressable>;
}

function NotificationRow({ notification, read, onPress }: { notification: NotificationItem; read: boolean; onPress: () => void }) {
  const colors = useColors();
  const category = notification.category as NotificationCategory;
  const toneColor = notification.tone === 'green' ? colors.success : notification.tone === 'amber' ? colors.warning : colors.info;
  return <Pressable accessibilityRole="button" accessibilityLabel={`Open notification ${notification.title}`} onPress={onPress} style={({ pressed }) => [styles.notificationRow, { backgroundColor: colors.white, borderColor: read ? colors.border : colors.accent }, !read && { borderLeftColor: colors.info, borderLeftWidth: 3 }, pressed && styles.pressed]}><View style={[styles.notificationIcon, { backgroundColor: notification.tone === 'green' ? colors.successSoft : notification.tone === 'amber' ? colors.warningSoft : colors.infoSoft }]}><Feather name={categoryIcons[category]} size={16} color={toneColor} /></View><View style={styles.notificationCopy}><View style={styles.notificationTitleRow}><Text style={[styles.notificationTitle, { color: colors.ink }]} numberOfLines={1}>{notification.title}</Text>{!read ? <View style={[styles.unreadDot, { backgroundColor: colors.info }]} /> : null}</View><Text style={[styles.notificationDetail, { color: colors.slate }]}>{notification.detail}</Text><View style={styles.notificationMeta}><Text style={[styles.notificationCategory, { color: toneColor }]}>{category}</Text><Text style={[styles.notificationTime, { color: colors.slate }]}>{notification.time}</Text></View></View><Feather name="chevron-right" size={16} color={colors.slate} /></Pressable>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backButton: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  topBarSpacer: { width: 32 },
  summaryCard: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, marginBottom: 14 },
  summaryIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  summaryCopy: { flex: 1 },
  summaryTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  summaryDetail: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginTop: 3 },
  markAll: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  filterRow: { gap: 8, paddingBottom: 20 },
  filterChip: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 11, paddingVertical: 8 },
  filterText: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  notificationList: { gap: 8, marginBottom: 22 },
  notificationRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 13, padding: 12 },
  notificationIcon: { width: 35, height: 35, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  notificationCopy: { flex: 1 },
  notificationTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  notificationTitle: { flex: 1, fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  unreadDot: { width: 6, height: 6, borderRadius: 3 },
  notificationDetail: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular', marginTop: 4 },
  notificationMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 7 },
  notificationCategory: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  notificationTime: { fontSize: 9, fontFamily: 'Inter_400Regular' },
  categoryOverview: { marginBottom: 18 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderRadius: 12, padding: 11, marginBottom: 8 },
  categoryIcon: { width: 33, height: 33, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  categoryCopy: { flex: 1 },
  categoryName: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  categoryDetail: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  unreadPill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 5 },
  unreadPillText: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  note: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: 10 },
  noteText: { flex: 1, fontSize: 10, lineHeight: 15, fontFamily: 'Inter_400Regular' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});