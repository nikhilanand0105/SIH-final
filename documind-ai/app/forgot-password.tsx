import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLockup, PrimaryButton, Surface } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { useColors } from '@/hooks/useColors';

export default function ForgotPasswordScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    await resetPassword(email.trim());
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 18, paddingBottom: insets.bottom + 24 }]} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <View style={styles.topBar}>
            <Pressable accessibilityRole="button" accessibilityLabel="Back to sign in" onPress={() => router.back()} style={styles.back}>
              <Feather name="arrow-left" size={20} color={colors.ink} />
            </Pressable>
            <BrandLockup />
            <View style={styles.spacer} />
          </View>
          <View style={styles.hero}>
            <View style={[styles.icon, { backgroundColor: colors.infoSoft }]}><Feather name={submitted ? 'check-circle' : 'key'} size={24} color={submitted ? colors.success : colors.info} /></View>
            <Text style={[styles.title, { color: colors.ink }]}>{submitted ? 'Check your inbox' : 'Reset your password'}</Text>
            <Text style={[styles.detail, { color: colors.slate }]}>{submitted ? `If ${email} is associated with a sample account, you’ll receive reset instructions here.` : 'Enter your email or username and we’ll prepare the next step for your account.'}</Text>
          </View>
          {submitted ? (
            <Surface style={styles.notice}><Feather name="info" size={16} color={colors.info} /><Text style={[styles.noticeText, { color: colors.secondaryForeground }]}>This is a mock reset flow. No email is sent in the demo workspace.</Text></Surface>
          ) : (
            <>
              <Text style={[styles.label, { color: colors.ink }]}>Email or username</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.white, borderColor: colors.border }]}><Feather name="mail" size={16} color={colors.slate} /><TextInput accessibilityLabel="Reset email or username" autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} placeholder="you@organization.org" placeholderTextColor={colors.slate} style={[styles.input, { color: colors.ink }]} value={email} /></View>
              <PrimaryButton label="Send reset instructions" icon="arrow-right" loading={loading} onPress={submit} />
            </>
          )}
          <Pressable accessibilityRole="button" accessibilityLabel="Return to sign in" onPress={() => router.replace('/')}><Text style={[styles.returnLink, { color: colors.info }]}>Return to sign in</Text></Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flexGrow: 1 },
  content: { paddingHorizontal: 24 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 68 },
  back: { width: 44, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  spacer: { width: 34 },
  hero: { alignItems: 'center', paddingHorizontal: 16, marginBottom: 32 },
  icon: { width: 54, height: 54, borderRadius: 17, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  title: { fontSize: 23, fontFamily: 'Inter_700Bold', textAlign: 'center' },
  detail: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 8 },
  label: { fontSize: 12, fontFamily: 'Inter_600SemiBold', marginBottom: 7 },
  inputWrap: { height: 49, borderRadius: 11, borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9, marginBottom: 16 },
  input: { flex: 1, fontSize: 14, fontFamily: 'Inter_400Regular' },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 9 },
  noticeText: { flex: 1, fontSize: 12, lineHeight: 18, fontFamily: 'Inter_400Regular' },
  returnLink: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textAlign: 'center', marginTop: 22 },
});