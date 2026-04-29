import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import type { DocumentType } from '@/types/business';

interface Props {
  type: DocumentType;
  size?: number;
}

const ICON_BY_TYPE: Record<DocumentType, keyof typeof Ionicons.glyphMap> = {
  pdf: 'document-text-outline',
  image: 'image-outline',
  note: 'reader-outline',
  link: 'link-outline',
};

export function DocumentTypeIcon({ type, size = 38 }: Props) {
  const theme = useTheme();
  const tint = (() => {
    switch (type) {
      case 'pdf':
        return { bg: theme.colors.decliningSoft, fg: theme.colors.declining };
      case 'image':
        return { bg: theme.colors.accentSoft, fg: theme.colors.accent };
      case 'note':
        return { bg: theme.colors.stableSoft, fg: theme.colors.stable };
      case 'link':
        return { bg: theme.colors.growingSoft, fg: theme.colors.growing };
    }
  })();

  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          backgroundColor: tint.bg,
          borderRadius: theme.radii.md,
        },
      ]}
    >
      <Ionicons name={ICON_BY_TYPE[type]} size={size * 0.5} color={tint.fg} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
