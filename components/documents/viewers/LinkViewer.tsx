import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { GlassCard } from '../../glass/GlassCard';

interface Props {
  uri: string;
  title: string;
  autoOpen?: boolean;
}

export function LinkViewer({ uri, title, autoOpen = false }: Props) {
  const theme = useTheme();
  const [opening, setOpening] = useState(false);

  const open = async () => {
    setOpening(true);
    try {
      await WebBrowser.openBrowserAsync(uri);
    } finally {
      setOpening(false);
    }
  };

  useEffect(() => {
    if (autoOpen) {
      void open();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let host = uri;
  try {
    host = new URL(uri).host;
  } catch {
    host = uri;
  }

  return (
    <View style={styles.wrap}>
      <GlassCard padding="xl" style={styles.card}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: theme.colors.growingSoft, borderRadius: theme.radii.lg },
          ]}
        >
          <Ionicons name="link" size={28} color={theme.colors.growing} />
        </View>
        <Text
          style={[theme.typography.h2, { color: theme.colors.text, marginTop: 16, textAlign: 'center' }]}
        >
          {title}
        </Text>
        <Text
          style={[theme.typography.bodySmall, { color: theme.colors.textFaint, marginTop: 6 }]}
          numberOfLines={1}
        >
          {host}
        </Text>
        <Pressable
          onPress={open}
          disabled={opening}
          style={[
            styles.btn,
            {
              backgroundColor: theme.colors.accent,
              borderRadius: theme.radii.lg,
              opacity: opening ? 0.6 : 1,
            },
          ]}
        >
          <Ionicons name="open-outline" size={16} color={theme.colors.bg} />
          <Text style={[theme.typography.bodySmall, { color: theme.colors.bg, fontWeight: '700' }]}>
            {opening ? 'Opening…' : 'Open in browser'}
          </Text>
        </Pressable>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
  },
  iconWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 22,
    minWidth: 200,
  },
});
