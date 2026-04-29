import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useNetWorth } from '@/providers/NetWorthProvider';
import { BusinessCard } from './BusinessCard';
import { AddBusinessCard } from './AddBusinessCard';
import { formatCurrency } from '@/lib/format';

export function BusinessRail() {
  const theme = useTheme();
  const { businesses } = useNetWorth();

  const totalMrr = businesses.reduce((sum, b) => sum + b.monthlyRevenue, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[theme.typography.h3, { color: theme.colors.text }]}>Businesses</Text>
        <Text style={[theme.typography.bodySmall, { color: theme.colors.textFaint }]}>
          {formatCurrency(totalMrr, 'USD', { compact: true })} combined MRR
        </Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        {businesses.map((b) => (
          <BusinessCard key={b.id} business={b} />
        ))}
        <AddBusinessCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  rail: {
    paddingHorizontal: 20,
  },
});
