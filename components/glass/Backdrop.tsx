import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

export function Backdrop() {
  const theme = useTheme();
  return (
    <View style={[StyleSheet.absoluteFill, styles.noTouch, { backgroundColor: theme.colors.bg }]}>
      <LinearGradient
        colors={[
          theme.colors.backdropGradientTop,
          theme.colors.backdropGradientMid,
          theme.colors.backdropGradientBottom,
        ]}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={[theme.colors.backdropGlowFrom, theme.colors.backdropGlowTo]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.4, y: 0.4 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  noTouch: {
    pointerEvents: 'none',
  },
});
