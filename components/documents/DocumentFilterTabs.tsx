import { ScrollView, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { GlassPill } from '../glass/GlassPill';
import { DOCUMENT_FILTERS } from '@/types/business';
import { useDocuments } from '@/providers/DocumentsProvider';

export function DocumentFilterTabs() {
  const theme = useTheme();
  const { filter, setFilter } = useDocuments();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      style={{ marginHorizontal: -theme.spacing.lg }}
    >
      <View style={[styles.spacer, { width: theme.spacing.lg }]} />
      {DOCUMENT_FILTERS.map((f) => (
        <GlassPill
          key={f.value}
          active={filter === f.value}
          onPress={() => setFilter(f.value)}
          style={styles.pill}
        >
          {f.label}
        </GlassPill>
      ))}
      <View style={[styles.spacer, { width: theme.spacing.lg }]} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    gap: 8,
  },
  pill: {
    marginRight: 0,
  },
  spacer: {
    height: 1,
  },
});
