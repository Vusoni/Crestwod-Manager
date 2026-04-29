import { useEffect } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useNetWorth } from '@/providers/NetWorthProvider';
import { formatCurrency, formatPercent } from '@/lib/format';
import { GlassPill } from '../glass/GlassPill';
import type { Currency } from '@/types/netWorth';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const CURRENCY_SYMBOL: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  PLN: 'zł',
};

interface Props {
  currency?: Currency;
}

export function HeroNetWorth({ currency = 'USD' }: Props) {
  const theme = useTheme();
  const { netWorth, netWorthDelta, netWorthDeltaPct, loaded } = useNetWorth();

  const display = useSharedValue(0);

  useEffect(() => {
    if (!loaded) return;
    display.value = withTiming(netWorth, {
      duration: theme.motion.slow,
      easing: Easing.out(Easing.cubic),
    });
  }, [loaded, netWorth, display, theme.motion.slow]);

  const symbol = CURRENCY_SYMBOL[currency];

  const animatedProps = useAnimatedProps(() => {
    'worklet';
    const animated = Math.round(display.value);
    const abs = Math.abs(animated);
    const sign = animated < 0 ? '-' : '';
    const digits = String(abs);
    let withCommas = '';
    for (let i = 0; i < digits.length; i += 1) {
      if (i > 0 && (digits.length - i) % 3 === 0) withCommas += ',';
      withCommas += digits[i];
    }
    return {
      text: `${sign}${symbol}${withCommas}`,
      defaultValue: `${symbol}0`,
    } as { text: string; defaultValue: string };
  });

  const isUp = netWorthDelta >= 0;
  const tone = isUp ? 'growing' : 'declining';
  const arrow = isUp ? 'arrow-up' : 'arrow-down';

  return (
    <View style={styles.container}>
      <Text style={[theme.typography.caption, styles.label, { color: theme.colors.textFaint }]}>
        TOTAL NET WORTH
      </Text>

      <MaskedView
        style={styles.maskWrap}
        maskElement={
          <View style={styles.maskInner} pointerEvents="none">
            <AnimatedTextInput
              animatedProps={animatedProps}
              editable={false}
              allowFontScaling={false}
              underlineColorAndroid="transparent"
              pointerEvents="none"
              style={[theme.typography.hero, styles.heroText, { color: theme.colors.text }]}
            />
          </View>
        }
      >
        <LinearGradient
          colors={[
            theme.colors.heroGradientStart,
            theme.colors.heroGradientMid,
            theme.colors.heroGradientEnd,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0.6 }}
          style={styles.gradientFill}
        />
      </MaskedView>

      <View style={styles.deltaRow}>
        <GlassPill tone={tone}>
          <Ionicons
            name={arrow}
            size={12}
            color={isUp ? theme.colors.growing : theme.colors.declining}
          />
          <Text
            style={[
              theme.typography.bodySmall,
              { color: isUp ? theme.colors.growing : theme.colors.declining, fontWeight: '700' },
            ]}
          >
            {formatPercent(netWorthDeltaPct)}
          </Text>
        </GlassPill>
        <Text style={[theme.typography.bodySmall, { color: theme.colors.textFaint }]}>
          {formatCurrency(netWorthDelta, currency, { showSign: true, compact: true })} this month
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    gap: 8,
  },
  label: {
    textTransform: 'uppercase',
  },
  maskWrap: {
    height: 64,
    width: '100%',
    flexDirection: 'row',
  },
  maskInner: {
    flex: 1,
  },
  heroText: {
    paddingVertical: 0,
    margin: 0,
    height: 64,
    lineHeight: 64,
  },
  gradientFill: {
    flex: 1,
    height: 64,
  },
  deltaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
});
