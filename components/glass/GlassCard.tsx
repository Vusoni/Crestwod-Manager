import { BlurView } from 'expo-blur';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { ThemeRadii, ThemeSpacing } from '@/theme/theme';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  padding?: ThemeSpacing;
  radius?: ThemeRadii;
  intensity?: number;
  strong?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function GlassCard({
  children,
  padding = 'lg',
  radius = 'xl',
  intensity,
  strong = false,
  style,
}: Props) {
  const theme = useTheme();
  const blurIntensity =
    intensity ?? (strong ? theme.glass.intensityStrong : theme.glass.intensity);

  return (
    <View
      style={[
        styles.shadow,
        theme.shadow.card,
        { borderRadius: theme.radii[radius] },
        style,
      ]}
    >
      <BlurView
        intensity={blurIntensity}
        tint={theme.glass.tint}
        style={[
          styles.blur,
          {
            borderRadius: theme.radii[radius],
            padding: theme.spacing[padding],
            backgroundColor: strong ? theme.colors.glassTintStrong : theme.colors.glassTint,
            borderColor: strong ? theme.colors.glassBorderStrong : theme.colors.glassBorder,
          },
        ]}
      >
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    overflow: 'visible',
  },
  blur: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
});
