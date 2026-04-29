import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  onPress?: () => void;
}

export function AddBusinessCard({ onPress }: Props) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <View
        style={[
          styles.card,
          {
            borderColor: theme.colors.borderStrong,
            borderRadius: theme.radii.xl,
          },
        ]}
      >
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: theme.colors.accentSoft, borderRadius: theme.radii.pill },
          ]}
        >
          <Ionicons name="add" size={20} color={theme.colors.accent} />
        </View>
        <Text
          style={[
            theme.typography.bodySmall,
            { color: theme.colors.textMuted, marginTop: 10, fontWeight: '600' },
          ]}
        >
          Add business
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginRight: 4,
  },
  card: {
    width: 132,
    height: 132,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  iconWrap: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
