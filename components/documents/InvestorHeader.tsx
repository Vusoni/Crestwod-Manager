import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useNetWorth } from '@/providers/NetWorthProvider';
import { useDocuments } from '@/providers/DocumentsProvider';
import { InvestorModeToggle } from './InvestorModeToggle';

export function InvestorHeader() {
  const theme = useTheme();
  const { businesses } = useNetWorth();
  const { documents, filter } = useDocuments();

  const visible = documents.filter((d) => d.isInvestorReady);
  const businessId = visible[0]?.businessId;
  const business = businesses.find((b) => b.id === businessId);

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={[theme.typography.caption, { color: theme.colors.textFaint, textTransform: 'uppercase' }]}>
          INVESTOR PRESENTATION
        </Text>
        <Text
          style={[theme.typography.h1, { color: theme.colors.text, marginTop: 2 }]}
          numberOfLines={1}
        >
          {business?.name ?? 'Crestwod'}
        </Text>
        <Text
          style={[theme.typography.caption, { color: theme.colors.textFaint, marginTop: 2 }]}
        >
          {visible.length} document{visible.length === 1 ? '' : 's'}
          {filter !== 'all' ? ` · ${filter}` : ''}
        </Text>
      </View>
      <InvestorModeToggle />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flex: 1,
  },
});
