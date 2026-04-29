import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useNetWorth } from '@/providers/NetWorthProvider';
import { GlassCard } from '../glass/GlassCard';
import { formatDateLong, getInitials } from '@/lib/format';

export function ProfileBlock() {
  const theme = useTheme();
  const { profile } = useNetWorth();

  return (
    <View style={styles.wrap}>
      <GlassCard padding="md">
        <View style={styles.row}>
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: theme.colors.accentSoft,
                borderRadius: theme.radii.pill,
                borderColor: theme.colors.glassBorder,
              },
            ]}
          >
            {profile?.avatarUrl ? (
              <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImg} />
            ) : (
              <Text
                style={[
                  theme.typography.h3,
                  { color: theme.colors.accent, fontWeight: '700' },
                ]}
              >
                {getInitials(profile?.name ?? 'You')}
              </Text>
            )}
          </View>
          <View style={styles.identity}>
            <View style={styles.nameRow}>
              <Text
                style={[theme.typography.body, { color: theme.colors.text, fontWeight: '700' }]}
                numberOfLines={1}
              >
                {profile?.name ?? '—'}
              </Text>
              {profile?.isPremium ? (
                <View
                  style={[
                    styles.premium,
                    { backgroundColor: theme.colors.accent, borderRadius: theme.radii.pill },
                  ]}
                >
                  <Ionicons name="sparkles" size={9} color={theme.colors.bg} />
                  <Text
                    style={[
                      theme.typography.caption,
                      { color: theme.colors.bg, fontWeight: '700' },
                    ]}
                  >
                    PRO
                  </Text>
                </View>
              ) : null}
            </View>
            <Text
              style={[theme.typography.caption, { color: theme.colors.textFaint, marginTop: 2 }]}
            >
              {profile?.title ?? 'Founder'}
              {profile?.memberSince ? ` · since ${formatDateLong(profile.memberSince)}` : ''}
            </Text>
          </View>
        </View>
      </GlassCard>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  avatarImg: {
    width: 44,
    height: 44,
  },
  identity: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  premium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});
