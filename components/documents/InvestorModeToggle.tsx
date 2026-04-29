import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useDocuments } from '@/providers/DocumentsProvider';

export function InvestorModeToggle() {
  const theme = useTheme();
  const { investorMode, toggleInvestorMode } = useDocuments();

  const progress = useDerivedValue(() =>
    withTiming(investorMode ? 1 : 0, { duration: theme.motion.base }),
  );

  const knobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: 22 * progress.value }],
  }));

  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: investorMode ? theme.colors.accent : theme.colors.glassTint,
  }));

  return (
    <Pressable onPress={toggleInvestorMode} hitSlop={8} style={styles.wrap}>
      <View style={styles.labelRow}>
        <Ionicons
          name={investorMode ? 'eye' : 'eye-outline'}
          size={14}
          color={investorMode ? theme.colors.accent : theme.colors.textMuted}
        />
        <Text
          style={[
            theme.typography.bodySmall,
            { color: investorMode ? theme.colors.accent : theme.colors.textMuted, fontWeight: '600' },
          ]}
        >
          Investor view
        </Text>
      </View>
      <Animated.View style={[styles.track, { borderColor: theme.colors.glassBorder }, trackStyle]}>
        <Animated.View
          style={[styles.knob, { backgroundColor: theme.colors.text }, knobStyle]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  track: {
    width: 44,
    height: 24,
    borderRadius: 999,
    padding: 2,
    borderWidth: StyleSheet.hairlineWidth,
  },
  knob: {
    width: 18,
    height: 18,
    borderRadius: 999,
  },
});
