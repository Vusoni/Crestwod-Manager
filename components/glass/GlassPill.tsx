import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  active?: boolean;
  tone?: 'neutral' | 'accent' | 'growing' | 'stable' | 'declining';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function GlassPill({
  children,
  active = false,
  tone = 'neutral',
  onPress,
  style,
}: Props) {
  const theme = useTheme();

  const toneBg = (() => {
    if (active) return theme.colors.accent;
    switch (tone) {
      case 'accent':
        return theme.colors.accentSoft;
      case 'growing':
        return theme.colors.growingSoft;
      case 'stable':
        return theme.colors.stableSoft;
      case 'declining':
        return theme.colors.decliningSoft;
      case 'neutral':
        return theme.colors.glassTint;
    }
  })();

  const toneText = (() => {
    if (active) return theme.colors.bg;
    switch (tone) {
      case 'accent':
        return theme.colors.accent;
      case 'growing':
        return theme.colors.growing;
      case 'stable':
        return theme.colors.stable;
      case 'declining':
        return theme.colors.declining;
      case 'neutral':
        return theme.colors.textMuted;
    }
  })();

  const content = typeof children === 'string' ? (
    <Text
      style={[
        theme.typography.bodySmall,
        styles.text,
        { color: toneText, fontWeight: active ? '700' : '600' },
      ]}
    >
      {children}
    </Text>
  ) : (
    <View style={styles.row}>{children}</View>
  );

  const inner = (
    <View
      style={[
        styles.pill,
        {
          backgroundColor: toneBg,
          borderRadius: theme.radii.pill,
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.xs + 2,
          borderColor: active ? 'transparent' : theme.colors.glassBorder,
        },
        style,
      ]}
    >
      {content}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} hitSlop={8}>
        {inner}
      </Pressable>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  pill: {
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    lineHeight: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
