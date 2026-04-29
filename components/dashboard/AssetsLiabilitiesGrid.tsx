import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useNetWorth } from '@/providers/NetWorthProvider';
import { GlassCard } from '../glass/GlassCard';
import { InlineEditableRow } from './InlineEditableRow';
import { formatCurrency } from '@/lib/format';

export function AssetsLiabilitiesGrid() {
  const theme = useTheme();
  const { assets, liabilities, totalAssets, totalLiabilities, setAssetValue, setLiabilityValue } =
    useNetWorth();

  return (
    <View style={styles.row}>
      <GlassCard padding="lg" style={styles.col}>
        <Text style={[theme.typography.caption, styles.label, { color: theme.colors.textFaint }]}>
          ASSETS
        </Text>
        <Text style={[theme.typography.display, styles.total, { color: theme.colors.text }]}>
          {formatCurrency(totalAssets, 'USD', { compact: true })}
        </Text>
        <View style={[styles.divider, { backgroundColor: theme.colors.hairline }]} />
        {assets.slice(0, 4).map((a) => (
          <InlineEditableRow
            key={a.id}
            label={a.name}
            value={a.value}
            currency={a.currency}
            onCommit={(v) => setAssetValue(a.id, v)}
          />
        ))}
      </GlassCard>

      <GlassCard padding="lg" style={styles.col}>
        <Text style={[theme.typography.caption, styles.label, { color: theme.colors.textFaint }]}>
          LIABILITIES
        </Text>
        <Text style={[theme.typography.display, styles.total, { color: theme.colors.text }]}>
          {formatCurrency(totalLiabilities, 'USD', { compact: true })}
        </Text>
        <View style={[styles.divider, { backgroundColor: theme.colors.hairline }]} />
        {liabilities.slice(0, 4).map((l) => (
          <InlineEditableRow
            key={l.id}
            label={l.name}
            value={l.value}
            currency={l.currency}
            onCommit={(v) => setLiabilityValue(l.id, v)}
          />
        ))}
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  col: {
    flex: 1,
  },
  label: {
    textTransform: 'uppercase',
  },
  total: {
    marginTop: 4,
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
});
