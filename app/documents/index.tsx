import { useMemo, useRef } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Backdrop } from '@/components/glass/Backdrop';
import { GlassCard } from '@/components/glass/GlassCard';
import { DocumentFilterTabs } from '@/components/documents/DocumentFilterTabs';
import { DocumentRow } from '@/components/documents/DocumentRow';
import { InvestorModeToggle } from '@/components/documents/InvestorModeToggle';
import { InvestorHeader } from '@/components/documents/InvestorHeader';
import {
  DocumentUploadSheet,
  type DocumentUploadSheetRef,
} from '@/components/documents/DocumentUploadSheet';
import { useDocuments } from '@/providers/DocumentsProvider';
import { useNetWorth } from '@/providers/NetWorthProvider';
import { useTheme } from '@/theme/ThemeProvider';

export default function DocumentsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const sheetRef = useRef<DocumentUploadSheetRef>(null);

  const { documents, filter, investorMode } = useDocuments();
  const { businesses } = useNetWorth();

  const visible = useMemo(() => {
    let list = documents;
    if (investorMode) list = list.filter((d) => d.isInvestorReady);
    if (filter !== 'all') list = list.filter((d) => d.category === filter);
    return list;
  }, [documents, filter, investorMode]);

  const businessName = (id: string) => businesses.find((b) => b.id === id)?.name ?? '—';

  return (
    <View style={styles.root}>
      <Backdrop />

      <View style={[styles.headerWrap, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </Pressable>

        {investorMode ? (
          <InvestorHeader />
        ) : (
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={[theme.typography.caption, { color: theme.colors.textFaint, textTransform: 'uppercase' }]}>
                VAULT
              </Text>
              <Text style={[theme.typography.h1, { color: theme.colors.text, marginTop: 2 }]}>
                Documents
              </Text>
              <Text style={[theme.typography.caption, { color: theme.colors.textFaint, marginTop: 2 }]}>
                {visible.length} of {documents.length}
                {filter !== 'all' ? ` · ${filter}` : ''}
              </Text>
            </View>
            <InvestorModeToggle />
          </View>
        )}

        <View style={styles.tabs}>
          <DocumentFilterTabs />
        </View>
      </View>

      <FlatList
        data={visible}
        keyExtractor={(d) => d.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: theme.colors.hairline }]} />
        )}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 40).duration(theme.motion.base)}>
            <DocumentRow
              document={item}
              businessName={businessName(item.businessId)}
              showInvestorBadge={!investorMode}
              onPress={() => router.push(`/documents/${item.id}`)}
            />
          </Animated.View>
        )}
        ListEmptyComponent={
          <Animated.View entering={FadeInUp.duration(theme.motion.base)} style={styles.empty}>
            <GlassCard padding="xl" style={styles.emptyCard}>
              <Ionicons name="folder-open-outline" size={36} color={theme.colors.accent} />
              <Text style={[theme.typography.h3, { color: theme.colors.text, marginTop: 12 }]}>
                Nothing here yet
              </Text>
              <Text
                style={[theme.typography.bodySmall, { color: theme.colors.textFaint, textAlign: 'center', marginTop: 6 }]}
              >
                {investorMode
                  ? 'No investor-ready documents in this category. Toggle off Investor View or add new documents.'
                  : 'Add your first pitch deck, financial summary, or note.'}
              </Text>
            </GlassCard>
          </Animated.View>
        }
        ListHeaderComponent={<View style={{ height: 4 }} />}
      />

      {!investorMode ? (
        <Pressable
          onPress={() => sheetRef.current?.present()}
          style={[
            styles.fab,
            {
              bottom: insets.bottom + 24,
              backgroundColor: theme.colors.accent,
              borderRadius: theme.radii.pill,
              ...theme.shadow.hero,
            },
          ]}
        >
          <Ionicons name="add" size={28} color={theme.colors.bg} />
        </Pressable>
      ) : null}

      <DocumentUploadSheet ref={sheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  headerWrap: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
  },
  back: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerLeft: {
    flex: 1,
  },
  tabs: {
    marginTop: 6,
  },
  list: {
    paddingHorizontal: 20,
  },
  separator: {
    height: 1,
    marginLeft: 56,
  },
  empty: {
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyCard: {
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
