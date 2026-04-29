import { StyleSheet, Text, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { GlassCard } from '../../glass/GlassCard';

interface Props {
  uri: string;
}

let Pdf: React.ComponentType<{ source: { uri: string }; style: object; trustAllCerts?: boolean }> | null = null;
try {
  // Avoid hard-failing in Expo Go where the native module isn't linked.
  // Loaded dynamically so the bundler can still resolve it in a dev client build.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Pdf = require('react-native-pdf').default;
} catch {
  Pdf = null;
}

export function PdfViewer({ uri }: Props) {
  const theme = useTheme();

  if (!Pdf || Platform.OS === 'web') {
    return (
      <View style={[styles.fallback, { backgroundColor: theme.colors.bg }]}>
        <GlassCard padding="xl" style={styles.fallbackCard}>
          <Ionicons name="document-text-outline" size={36} color={theme.colors.accent} />
          <Text style={[theme.typography.h3, { color: theme.colors.text, marginTop: 12 }]}>
            PDF preview unavailable
          </Text>
          <Text
            style={[theme.typography.bodySmall, { color: theme.colors.textFaint, marginTop: 6, textAlign: 'center' }]}
          >
            Run `npx expo prebuild --platform ios` and a dev client build to render this document natively.
          </Text>
        </GlassCard>
      </View>
    );
  }

  return (
    <Pdf
      source={{ uri }}
      style={[styles.pdf, { backgroundColor: theme.colors.bg }]}
      trustAllCerts={false}
    />
  );
}

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: '100%',
  },
  fallback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  fallbackCard: {
    alignItems: 'center',
    maxWidth: 320,
  },
});
