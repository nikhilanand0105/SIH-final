import { Link, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export default function NotFoundScreen() {
  const colors = useColors();

  return (
    <>
      <Stack.Screen options={{ title: 'Page not found' }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.icon, { backgroundColor: colors.infoSoft }]}><Feather name="compass" size={24} color={colors.info} /></View>
        <Text style={[styles.eyebrow, { color: colors.info }]}>DOCUMIND AI</Text>
        <Text style={[styles.title, { color: colors.foreground }]}>Page not found</Text>
        <Text style={[styles.detail, { color: colors.mutedForeground }]}>The review workspace could not find that destination.</Text>
        <Link href="/" style={[styles.link, { backgroundColor: colors.primary }]}>
          <Feather name="arrow-left" size={16} color={colors.primaryForeground} />
          <Text style={[styles.linkText, { color: colors.primaryForeground }]}>
            Return to workspace
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  icon: { width: 56, height: 56, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  eyebrow: { fontSize: 10, fontFamily: 'Inter_700Bold', letterSpacing: 1.2, marginBottom: 8 },
  title: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  detail: { fontSize: 13, lineHeight: 19, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 8, maxWidth: 280 },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    minHeight: 48,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  linkText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
});
