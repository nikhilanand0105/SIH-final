import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, BrandLockup, PrimaryButton, Surface } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { demoUser } from '@/mockData';
import { useColors } from '@/hooks/useColors';

type ProfileData = {
  name: string;
  organization: string;
  role: string;
  status: string;
  lastLogin: string;
};

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    name: user?.name ?? demoUser.name,
    organization: user?.organization ?? demoUser.organization ?? 'DocuMind',
    role: user?.role ?? demoUser.role,
    status: 'Active',
    lastLogin: user?.lastLogin ?? demoUser.lastLogin ?? 'Just now',
  });
  const [draft, setDraft] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [notice, setNotice] = useState('');

  const beginEdit = () => {
    void Haptics.selectionAsync();
    setDraft(profile);
    setEditing(true);
    setNotice('');
  };

  const saveProfile = () => {
    if (!draft.name.trim() || !draft.organization.trim() || !draft.role.trim()) {
      setNotice('Add a name, organization, and role before saving.');
      return;
    }
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setProfile({ ...profile, name: draft.name.trim(), organization: draft.organization.trim(), role: draft.role.trim() });
    setEditing(false);
    setNotice('Profile details updated for this demo session.');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: insets.bottom + 100 }} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <AppHeader title="Profile" subtitle="Your account and workspace identity" onNotification={() => router.push('/notifications')} />

          <Surface style={styles.profileHero}>
            <View style={[styles.avatar, { backgroundColor: colors.navy }]}><Text style={[styles.avatarText, { color: colors.white }]}>{profile.name?.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()}</Text></View>
            <View style={styles.profileHeading}><Text style={[styles.profileName, { color: colors.ink }]}>{profile.name}</Text><Text style={[styles.profileRole, { color: colors.slate }]}>{profile.role}</Text><Text style={[styles.profileOrg, { color: colors.info }]}>{profile.organization}</Text></View>
            <View style={[styles.activeBadge, { backgroundColor: colors.successSoft }]}><View style={[styles.activeDot, { backgroundColor: colors.success }]} /><Text style={[styles.activeText, { color: colors.success }]}>{profile.status}</Text></View>
          </Surface>

          {editing ? (
            <Surface style={styles.editCard}>
              <View style={styles.cardTitleRow}><Text style={[styles.cardTitle, { color: colors.ink }]}>Edit Profile</Text><Pressable accessibilityRole="button" accessibilityLabel="Cancel editing profile" onPress={() => setEditing(false)}><Feather name="x" size={18} color={colors.slate} /></Pressable></View>
              <ProfileInput label="Name" value={draft.name} onChangeText={(value) => setDraft({ ...draft, name: value })} />
              <ProfileInput label="Organization" value={draft.organization} onChangeText={(value) => setDraft({ ...draft, organization: value })} />
              <ProfileInput label="Role" value={draft.role} onChangeText={(value) => setDraft({ ...draft, role: value })} />
              <PrimaryButton label="Save changes" icon="check" compact onPress={saveProfile} />
              {notice ? <Text style={[styles.notice, { color: colors.destructive }]}>{notice}</Text> : null}
            </Surface>
          ) : (
            <Surface style={styles.detailsCard}>
              <View style={styles.cardTitleRow}><Text style={[styles.cardTitle, { color: colors.ink }]}>Account details</Text><Feather name="user-check" size={17} color={colors.info} /></View>
              <ProfileDetail label="Name" value={profile.name} />
              <ProfileDetail label="Organization" value={profile.organization} />
              <ProfileDetail label="Role" value={profile.role} />
              <ProfileDetail label="Account Status" value={`${profile.status} · Demo workspace`} valueColor={colors.success} />
              <ProfileDetail label="Last Login" value={profile.lastLogin} last />
              <PrimaryButton label="Edit Profile" icon="edit-3" compact onPress={beginEdit} />
            </Surface>
          )}
          {notice && !editing ? <Text style={[styles.notice, { color: colors.success }]}>{notice}</Text> : null}

          <Text style={[styles.sectionLabel, { color: colors.ink }]}>Account & workspace</Text>
          <SettingsRow icon="sliders" label="Settings" detail="Appearance, AI preferences, and account controls" onPress={() => router.push('/settings')} />
          <SettingsRow icon="bell" label="Notifications" detail="Document processing, insight, report, and system alerts" onPress={() => router.push('/notifications')} />

          <Text style={[styles.sectionLabel, { color: colors.ink }]}>Advanced tools</Text>
          <SettingsRow icon="share-2" label="Knowledge graph" detail="Trace entities and relationships" onPress={() => router.push('/knowledge-graph')} />
          <SettingsRow icon="bar-chart-2" label="Reports" detail="Executive and intelligence reports" onPress={() => router.push('/reports')} />
          <SettingsRow icon="git-merge" label="Compare documents" detail="Cross-document difference review" onPress={() => router.push('/compare')} />
          <SettingsRow icon="alert-triangle" label="Insights" detail="Conflicts, deadlines, and actions" onPress={() => router.push('/insights')} />

          <Text style={[styles.sectionLabel, { color: colors.ink }]}>Support</Text>
          <SettingsRow icon="help-circle" label="Help center" detail="Learn how document intelligence works" onPress={() => setNotice('Help center is available in the full product experience.')} />
          <SettingsRow icon="info" label="About DocuMind AI" detail="Version 1.0 · Sample build" onPress={() => setNotice('DocuMind AI · AI-powered document intelligence')} />

          <View style={[styles.sampleNote, { backgroundColor: colors.infoSoft }]}>
            <Feather name="info" size={15} color={colors.info} />
            <Text style={[styles.sampleText, { color: colors.secondaryForeground }]}>This is a mock account experience. Firebase, security, and privacy controls can be connected later without changing the profile surface.</Text>
          </View>
          <PrimaryButton label="Sign out" icon="log-out" secondary onPress={async () => { await signOut(); router.replace('/'); }} />
          <View style={styles.brandFooter}><BrandLockup /><Text style={[styles.footerText, { color: colors.slate }]}>AI-powered document intelligence</Text></View>
        </View>
      </ScrollView>
    </View>
  );
}

function ProfileDetail({ label, value, valueColor, last = false }: { label: string; value: string; valueColor?: string; last?: boolean }) {
  const colors = useColors();
  return <View style={[styles.detailRow, !last && { borderBottomWidth: 1, borderBottomColor: colors.divider }]}><Text style={[styles.detailLabel, { color: colors.slate }]}>{label}</Text><Text style={[styles.detailValue, { color: valueColor ?? colors.ink }]}>{value}</Text></View>;
}

function ProfileInput({ label, value, onChangeText }: { label: string; value: string; onChangeText: (value: string) => void }) {
  const colors = useColors();
  return <View style={styles.inputGroup}><Text style={[styles.inputLabel, { color: colors.ink }]}>{label}</Text><TextInput accessibilityLabel={label} value={value} onChangeText={onChangeText} placeholder={label} placeholderTextColor={colors.slate} style={[styles.input, { color: colors.ink, borderColor: colors.border, backgroundColor: colors.white }]} /></View>;
}

function SettingsRow({ icon, label, detail, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; detail: string; onPress: () => void }) {
  const colors = useColors();
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.settingRow, { backgroundColor: colors.white, borderColor: colors.border }, pressed && styles.pressed]}><View style={[styles.settingIcon, { backgroundColor: colors.paleBlue }]}><Feather name={icon} size={17} color={colors.info} /></View><View style={styles.settingCopy}><Text style={[styles.settingLabel, { color: colors.ink }]}>{label}</Text><Text style={[styles.settingDetail, { color: colors.slate }]}>{detail}</Text></View><Feather name="chevron-right" size={17} color={colors.slate} /></Pressable>;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 18 },
  profileHero: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, marginBottom: 12 },
  avatar: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  profileHeading: { flex: 1 },
  profileName: { fontSize: 16, fontFamily: 'Inter_700Bold' },
  profileRole: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3 },
  profileOrg: { fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 5 },
  activeBadge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderRadius: 7, paddingHorizontal: 7, paddingVertical: 5, alignSelf: 'flex-start' },
  activeDot: { width: 5, height: 5, borderRadius: 3 },
  activeText: { fontSize: 9, fontFamily: 'Inter_600SemiBold' },
  detailsCard: { marginBottom: 20 },
  editCard: { marginBottom: 20 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  detailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 11 },
  detailLabel: { fontSize: 10, fontFamily: 'Inter_500Medium' },
  detailValue: { flex: 1, fontSize: 11, fontFamily: 'Inter_600SemiBold', textAlign: 'right' },
  inputGroup: { marginBottom: 11 },
  inputLabel: { fontSize: 10, fontFamily: 'Inter_600SemiBold', marginBottom: 5 },
  input: { height: 42, borderWidth: 1, borderRadius: 10, paddingHorizontal: 11, fontSize: 12, fontFamily: 'Inter_400Regular' },
  notice: { fontSize: 10, lineHeight: 15, fontFamily: 'Inter_500Medium', marginTop: -11, marginBottom: 18 },
  sectionLabel: { fontSize: 14, fontFamily: 'Inter_700Bold', marginBottom: 10, marginTop: 4 },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: 11, borderWidth: 1, borderRadius: 13, padding: 12, marginBottom: 8 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingCopy: { flex: 1 },
  settingLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  settingDetail: { fontSize: 10, fontFamily: 'Inter_400Regular', marginTop: 3, lineHeight: 15 },
  sampleNote: { flexDirection: 'row', gap: 8, padding: 12, borderRadius: 10, marginTop: 14, marginBottom: 18 },
  sampleText: { flex: 1, fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular' },
  brandFooter: { alignItems: 'center', marginTop: 34, gap: 9 },
  footerText: { fontSize: 10, fontFamily: 'Inter_400Regular' },
  pressed: { opacity: 0.78, transform: [{ scale: 0.985 }] },
});