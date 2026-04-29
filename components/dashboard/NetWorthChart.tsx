import { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop, Circle } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/theme/ThemeProvider';
import { useNetWorth } from '@/providers/NetWorthProvider';
import { GlassCard } from '../glass/GlassCard';
import { formatCurrency } from '@/lib/format';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Geometry {
  width: number;
  height: number;
  pad: number;
  line: string;
  fill: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  pathLength: number;
}

function buildGeometry(values: number[], width: number, height: number, pad: number): Geometry {
  if (values.length === 0) {
    return {
      width,
      height,
      pad,
      line: '',
      fill: '',
      startX: pad,
      startY: height - pad,
      endX: width - pad,
      endY: height - pad,
      pathLength: 0,
    };
  }
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const inner = width - pad * 2;
  const innerH = height - pad * 2;
  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * inner;
    const y = pad + (1 - (v - min) / range) * innerH;
    return { x, y };
  });

  const line = points
    .map((p, i) => {
      if (i === 0) return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      const prev = points[i - 1];
      if (!prev) return '';
      const cx = (prev.x + p.x) / 2;
      return `Q ${cx.toFixed(2)} ${prev.y.toFixed(2)} ${cx.toFixed(2)} ${((prev.y + p.y) / 2).toFixed(2)} T ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    })
    .join(' ');

  const last = points[points.length - 1];
  const first = points[0];
  if (!first || !last) {
    return {
      width,
      height,
      pad,
      line: '',
      fill: '',
      startX: pad,
      startY: height - pad,
      endX: width - pad,
      endY: height - pad,
      pathLength: 0,
    };
  }
  const fill = `${line} L ${last.x.toFixed(2)} ${(height - pad).toFixed(2)} L ${first.x.toFixed(2)} ${(height - pad).toFixed(2)} Z`;

  let pathLength = 0;
  for (let i = 1; i < points.length; i += 1) {
    const a = points[i - 1];
    const b = points[i];
    if (!a || !b) continue;
    pathLength += Math.hypot(b.x - a.x, b.y - a.y);
  }

  return {
    width,
    height,
    pad,
    line,
    fill,
    startX: first.x,
    startY: first.y,
    endX: last.x,
    endY: last.y,
    pathLength,
  };
}

const CHART_W = 320;
const CHART_H = 110;

export function NetWorthChart() {
  const theme = useTheme();
  const { snapshots, loaded } = useNetWorth();
  const progress = useSharedValue(0);

  const values = snapshots.map((s) => s.netWorth);
  const geom = useMemo(() => buildGeometry(values, CHART_W, CHART_H, 14), [values]);

  useEffect(() => {
    if (loaded) {
      progress.value = 0;
      progress.value = withTiming(1, {
        duration: theme.motion.pageEnter,
        easing: Easing.out(Easing.cubic),
      });
    }
  }, [loaded, progress, theme.motion.pageEnter]);

  const animatedLineProps = useAnimatedProps(() => {
    'worklet';
    return {
      strokeDashoffset: geom.pathLength * (1 - progress.value),
    };
  });

  const animatedFillProps = useAnimatedProps(() => {
    'worklet';
    return { opacity: progress.value };
  });

  const last = snapshots[snapshots.length - 1];
  const first = snapshots[0];
  const range =
    first && last
      ? `${formatCurrency(first.netWorth, 'USD', { compact: true })} → ${formatCurrency(last.netWorth, 'USD', { compact: true })}`
      : '';

  return (
    <View style={styles.wrap}>
      <GlassCard padding="lg">
        <View style={styles.header}>
          <View>
            <Text style={[theme.typography.caption, styles.label, { color: theme.colors.textFaint }]}>
              6 MONTH TREND
            </Text>
            <Text style={[theme.typography.h3, { color: theme.colors.text, marginTop: 2 }]}>
              {range}
            </Text>
          </View>
        </View>
        <Svg width="100%" height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
          <Defs>
            <LinearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={theme.colors.heroGradientMid} stopOpacity={1} />
              <Stop offset="1" stopColor={theme.colors.heroGradientEnd} stopOpacity={1} />
            </LinearGradient>
            <LinearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={theme.colors.accent} stopOpacity={0.32} />
              <Stop offset="1" stopColor={theme.colors.accent} stopOpacity={0} />
            </LinearGradient>
          </Defs>
          <AnimatedPath
            d={geom.fill}
            fill="url(#trendFill)"
            animatedProps={animatedFillProps}
          />
          <AnimatedPath
            d={geom.line}
            fill="none"
            stroke="url(#trendStroke)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={[geom.pathLength, geom.pathLength]}
            animatedProps={animatedLineProps}
          />
          <Circle
            cx={geom.startX}
            cy={geom.startY}
            r={3}
            fill={theme.colors.heroGradientMid}
            opacity={0.9}
          />
          <Circle
            cx={geom.endX}
            cy={geom.endY}
            r={4.5}
            fill={theme.colors.heroGradientEnd}
          />
          <Circle
            cx={geom.endX}
            cy={geom.endY}
            r={9}
            fill={theme.colors.heroGradientEnd}
            opacity={0.18}
          />
        </Svg>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  label: {
    textTransform: 'uppercase',
  },
});
