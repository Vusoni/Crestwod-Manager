import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { DocumentTypeIcon } from './DocumentTypeIcon';
import { formatBytes, formatDateRelative } from '@/lib/format';
import type { Document } from '@/types/business';

interface Props {
  document: Document;
  businessName: string;
  showInvestorBadge?: boolean;
  onPress: () => void;
}

export function DocumentRow({
  document,
  businessName,
  showInvestorBadge = true,
  onPress,
}: Props) {
  const theme = useTheme();
  const meta: string[] = [businessName, formatDateRelative(document.createdAt)];
  if (document.size) meta.push(formatBytes(document.size));

  return (
    <Pressable onPress={onPress} style={styles.row}>
      <DocumentTypeIcon type={document.type} size={42} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text
            style={[
              theme.typography.body,
              { color: theme.colors.text, fontWeight: '600', flex: 1 },
            ]}
            numberOfLines={1}
          >
            {document.name}
          </Text>
          {showInvestorBadge && document.isInvestorReady ? (
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: theme.colors.accentSoft,
                  borderRadius: theme.radii.pill,
                },
              ]}
            >
              <Ionicons name="sparkles" size={9} color={theme.colors.accent} />
            </View>
          ) : null}
        </View>
        <Text
          style={[theme.typography.caption, { color: theme.colors.textFaint, marginTop: 4 }]}
          numberOfLines={1}
        >
          {meta.join(' · ')}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={theme.colors.textFaint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  body: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
