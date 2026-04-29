import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Backdrop } from '@/components/glass/Backdrop';
import { PdfViewer } from '@/components/documents/viewers/PdfViewer';
import { ImageViewer } from '@/components/documents/viewers/ImageViewer';
import { NoteViewer } from '@/components/documents/viewers/NoteViewer';
import { LinkViewer } from '@/components/documents/viewers/LinkViewer';
import { useDocuments } from '@/providers/DocumentsProvider';
import { useNetWorth } from '@/providers/NetWorthProvider';
import { useTheme } from '@/theme/ThemeProvider';
import { formatBytes, formatDateRelative } from '@/lib/format';

export default function DocumentDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getDocumentById, investorMode, updateDocument, loaded } = useDocuments();
  const { businesses } = useNetWorth();

  const document = id ? getDocumentById(id) : undefined;

  if (!loaded) {
    return (
      <View style={[styles.center, { paddingTop: insets.top + 40 }]}>
        <Backdrop />
        <Text style={[theme.typography.bodySmall, { color: theme.colors.textFaint }]}>
          Loading…
        </Text>
      </View>
    );
  }

  if (!document) {
    return (
      <View style={[styles.center, { paddingTop: insets.top + 40 }]}>
        <Backdrop />
        <Text style={[theme.typography.h2, { color: theme.colors.text }]}>Document not found</Text>
        <Pressable onPress={() => router.back()} hitSlop={10} style={{ marginTop: 12 }}>
          <Text style={[theme.typography.bodySmall, { color: theme.colors.accent, fontWeight: '700' }]}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  const business = businesses.find((b) => b.id === document.businessId);
  const meta: string[] = [
    business?.name ?? '—',
    formatDateRelative(document.createdAt),
  ];
  if (document.size) meta.push(formatBytes(document.size));

  const renderViewer = () => {
    switch (document.type) {
      case 'pdf':
        return document.url ? <PdfViewer uri={document.url} /> : <NotAvailable />;
      case 'image':
        return document.url ? <ImageViewer uri={document.url} /> : <NotAvailable />;
      case 'note':
        return (
          <NoteViewer
            initial={document.content ?? ''}
            editable={!investorMode}
            onSave={async (content) => {
              await updateDocument(document.id, { content });
            }}
          />
        );
      case 'link':
        return document.url ? (
          <LinkViewer uri={document.url} title={document.name} autoOpen={false} />
        ) : (
          <NotAvailable />
        );
    }
  };

  return (
    <View style={styles.root}>
      <Backdrop />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.text} />
        </Pressable>
        <View style={styles.headerBody}>
          <Text
            style={[theme.typography.body, { color: theme.colors.text, fontWeight: '700' }]}
            numberOfLines={1}
          >
            {document.name}
          </Text>
          <Text
            style={[theme.typography.caption, { color: theme.colors.textFaint, marginTop: 2 }]}
            numberOfLines={1}
          >
            {meta.join(' · ')}
          </Text>
        </View>
        {document.isInvestorReady ? (
          <View
            style={[
              styles.badge,
              { backgroundColor: theme.colors.accentSoft, borderRadius: theme.radii.pill },
            ]}
          >
            <Ionicons name="sparkles" size={11} color={theme.colors.accent} />
            <Text style={[theme.typography.caption, { color: theme.colors.accent, fontWeight: '700' }]}>
              READY
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.viewerWrap}>{renderViewer()}</View>
    </View>
  );
}

function NotAvailable() {
  const theme = useTheme();
  return (
    <View style={styles.center}>
      <Text style={[theme.typography.body, { color: theme.colors.textMuted }]}>
        Source unavailable.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  back: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerBody: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewerWrap: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
