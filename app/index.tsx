import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  FadeInDown,
  FadeInRight,
} from 'react-native-reanimated';
import { Backdrop } from '@/components/glass/Backdrop';
import { HeroNetWorth } from '@/components/dashboard/HeroNetWorth';
import { BusinessRail } from '@/components/dashboard/BusinessRail';
import { AssetsLiabilitiesGrid } from '@/components/dashboard/AssetsLiabilitiesGrid';
import { NetWorthChart } from '@/components/dashboard/NetWorthChart';
import { DocumentsRail } from '@/components/dashboard/DocumentsRail';
import { ProfileBlock } from '@/components/dashboard/ProfileBlock';
import { useTheme } from '@/theme/ThemeProvider';

export default function NetWorthDashboard() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Backdrop />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 32 },
        ]}
      >
        <Animated.View
          entering={FadeInDown.duration(theme.motion.pageEnter).springify().damping(18)}
          style={styles.heroWrap}
        >
          <HeroNetWorth />
        </Animated.View>

        <Animated.View entering={FadeInRight.delay(80).duration(theme.motion.base)}>
          <BusinessRail />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(160).duration(theme.motion.base)}>
          <AssetsLiabilitiesGrid />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).duration(theme.motion.base)}>
          <NetWorthChart />
        </Animated.View>

        <Animated.View entering={FadeInRight.delay(320).duration(theme.motion.base)}>
          <DocumentsRail />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(theme.motion.base)}>
          <ProfileBlock />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scroll: {
    gap: 18,
  },
  heroWrap: {
    paddingHorizontal: 20,
  },
});
