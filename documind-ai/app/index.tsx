import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLockup, PrimaryButton } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';

export default function SignInScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, continueAsDemo } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const enterApp = async (demo: boolean) => {
    setLoading(true);
    if (demo) await continueAsDemo();
    else await signIn(email || 'analyst@northstar.example', password);
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <View style={[styles.brandPanel, { backgroundColor: colors.navy }]}>
          <BrandLockup light />
          <View style={styles.brandMessage}>
            <View style={[styles.signal, { backgroundColor: colors.info }]}><Feather name="activity" size={18} color={colors.white} /></View>
            <Text style={[styles.eyebrow, { color: colors.accent }]}>DOCUMENT INTELLIGENCE PLATFORM</Text>
            <Text style={[styles.hero, { color: colors.white }]}>Transform documents into verified, actionable intelligence.</Text>
            <Text style={[styles.heroDetail, { color: colors.accent }]}>A focused workspace for evidence-led review, extraction, and decisions.</Text>
          </View>
          <View style={styles.trustRow}>
            <Feather name="shield" size={14} color={colors.accent} />
            <Text style={[styles.trustText, { color: colors.accent }]}>Secure document intelligence workspace</Text>
          </View>
        </View>

        <View style={styles.formArea}>
          <Text style={[styles.formTitle, { color: colors.ink }]}>Welcome back</Text>
          <Text style={[styles.formSubtitle, { color: colors.slate }]}>Sign in to your workspace or explore the sample environment.</Text>
          <Text style={[styles.label, { color: colors.ink }]}>Email or username</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.white, borderColor: colors.border }]}>
            <Feather name="mail" size={16} color={colors.slate} />
            <TextInput
              accessibilityLabel="Email or username"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="you@organization.org"
              placeholderTextColor={colors.slate}
              style={[styles.input, { color: colors.ink }]}
              value={email}
            />
          </View>
          <Text style={[styles.label, { color: colors.ink }]}>Password</Text>
          <View style={[styles.inputWrap, { backgroundColor: colors.white, borderColor: colors.border }]}>
            <Feather name="lock" size={16} color={colors.slate} />
            <TextInput
              accessibilityLabel="Password"
              autoCapitalize="none"
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={colors.slate}
              secureTextEntry
              style={[styles.input, { color: colors.ink }]}
              value={password}
            />
          </View>
          <PrimaryButton label="Sign in" icon="arrow-right" loading={loading} onPress={() => enterApp(false)} />
          <Pressable accessibilityRole="button" accessibilityLabel="Forgot password" onPress={() => router.push('/forgot-password')} style={styles.touchLink}>
            <Text style={[styles.link, { color: colors.info }]}>Forgot password?</Text>
          </Pressable>
          <View style={styles.dividerRow}><View style={[styles.divider, { backgroundColor: colors.border }]} /><Text style={[styles.or, { color: colors.slate }]}>OR</Text><View style={[styles.divider, { backgroundColor: colors.border }]} /></View>
          <PrimaryButton label="Continue as demo" icon="play-circle" secondary loading={loading} onPress={() => enterApp(true)} />
          <Text style={[styles.demoNote, { color: colors.slate }]}>Demo mode uses fictional sample data. No account or backend connection is required.</Text>
          <View style={styles.footer}><Text style={[styles.footerText, { color: colors.slate }]}>Privacy</Text><Text style={[styles.footerDot, { color: colors.border }]}>·</Text><Text style={[styles.footerText, { color: colors.slate }]}>Terms</Text><Text style={[styles.footerDot, { color: colors.border }]}>·</Text><Text style={[styles.footerText, { color: colors.slate }]}>Help</Text></View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },
  brandPanel: { marginHorizontal: 18, padding: 22, borderRadius: 22, minHeight: 270, justifyContent: 'space-between' },
  brandMessage: { marginTop: 36 },
  signal: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  eyebrow: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, marginBottom: 9 },
  hero: { fontSize: 27, lineHeight: 34, fontFamily: 'Inter_700Bold', letterSpacing: -0.8 },
  heroDetail: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginTop: 12, maxWidth: 300 },
  trustRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24 },
  trustText: { fontSize: 11, fontFamily: 'Inter_500Medium' },
  formArea: { paddingHorizontal: 24, paddingTop: 28 },
  formTitle: { fontSize: 24, fontFamily: 'Inter_700Bold', letterSpacing: -0.5 },
  formSubtitle: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', marginTop: 6, marginBottom: 24 },
  label: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginBottom: 7, marginTop: 12 },
  inputWrap: { height: 49, borderRadius: 11, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9 },
  input: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  link: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textAlign: 'right', marginTop: 13 },
  touchLink: { minHeight: 44, justifyContent: 'center' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 19 },
  divider: { flex: 1, height: 1 },
  or: { fontSize: 10, fontFamily: 'Inter_600SemiBold' },
  demoNote: { fontSize: 11, lineHeight: 16, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 12 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 26 },
  footerText: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  footerDot: { fontSize: 11 },
});