import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { GlassCard } from '../glass/GlassCard';
import { formatCurrency } from '@/lib/format';
import type { Business, BusinessStatus } from '@/types/netWorth';

interface Props {
  business: Business;
  onPress?: () => void;
}

const STATUS_TONE: Record<BusinessStatus, 'growing' | 'stable' | 'declining'> = {
  growing: 'growing',
  stable: 'stable',
  declining: 'declining',
};

export function BusinessCard({ business, onPress }: Props) {
  const theme = useTheme();
  const tone = STATUS_TONE[business.status];
  const dotColor =
    tone === 'growing'
      ? theme.colors.growing
      : tone === 'stable'
      ? theme.colors.stable
      : theme.colors.declining;

  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.97, { duration: theme.motion.fast });
      }}
      onPressOut={() => {
        scale.value = withTiming(1, { duration: theme.motion.fast });
      }}
      style={styles.pressable}
    >
      <Animated.View style={animatedStyle}>
        <GlassCard padding="lg" radius="xl" style={styles.card}>
          <View style={styles.header}>
            <View style={[styles.dot, { backgroundColor: dotColor }]} />
            <View style={[styles.dotPulse, { backgroundColor: dotColor }]} />
          </View>
          <Text
            style={[theme.typography.bodySmall, { color: theme.colors.textFaint }]}
            numberOfLines={1}
          >
            {business.name}
          </Text>
          <Text
            style={[theme.typography.h2, { color: theme.colors.text, marginTop: 4 }]}
            numberOfLines={1}
          >
            {formatCurrency(business.monthlyRevenue, business.currency, { compact: true })}
          </Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textFaint, marginTop: 2 }]}>
            MRR
          </Text>
        </GlassCard>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginRight: 12,
  },
  card: {
    width: 168,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    height: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  dotPulse: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginLeft: -8,
    opacity: 0.35,
    transform: [{ scale: 2 }],
  },
});
