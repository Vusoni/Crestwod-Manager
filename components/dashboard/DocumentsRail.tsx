import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useDocuments } from '@/providers/DocumentsProvider';
import { useNetWorth } from '@/providers/NetWorthProvider';
import { GlassCard } from '../glass/GlassCard';
import { DocumentTypeIcon } from '../documents/DocumentTypeIcon';
import { formatDateRelative } from '@/lib/format';
import type { Document } from '@/types/business';

interface ChipProps {
  document: Document;
  businessName: string;
  onPress: () => void;
}

function RecentDocumentChip({ document, businessName, onPress }: ChipProps) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.chipWrap}>
      <GlassCard padding="md" style={styles.chipCard}>
        <DocumentTypeIcon type={document.type} size={32} />
        <Text
          style={[theme.typography.bodySmall, { color: theme.colors.text, marginTop: 8, fontWeight: '600' }]}
          numberOfLines={2}
        >
          {document.name}
        </Text>
        <Text
          style={[theme.typography.caption, { color: theme.colors.textFaint, marginTop: 4 }]}
          numberOfLines={1}
        >
          {businessName} · {formatDateRelative(document.createdAt)}
        </Text>
      </GlassCard>
    </Pressable>
  );
}

export function DocumentsRail() {
  const theme = useTheme();
  const router = useRouter();
  const { documents } = useDocuments();
  const { businesses } = useNetWorth();

  const recent = documents.slice(0, 5);
  const businessName = (id: string) => businesses.find((b) => b.id === id)?.name ?? '—';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[theme.typography.h3, { color: theme.colors.text }]}>Documents</Text>
        <Pressable onPress={() => router.push('/documents')} hitSlop={10}>
          <View style={styles.viewAll}>
            <Text
              style={[theme.typography.bodySmall, { color: theme.colors.accent, fontWeight: '600' }]}
            >
              View all
            </Text>
            <Ionicons name="chevron-forward" size={14} color={theme.colors.accent} />
          </View>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rail}
      >
        {recent.map((d) => (
          <RecentDocumentChip
            key={d.id}
            document={d}
            businessName={businessName(d.businessId)}
            onPress={() => router.push(`/documents/${d.id}`)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  rail: {
    paddingHorizontal: 20,
    gap: 10,
  },
  chipWrap: {
    width: 152,
  },
  chipCard: {
    width: 152,
    minHeight: 116,
  },
});
