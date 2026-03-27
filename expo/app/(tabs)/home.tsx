import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTokens } from '@/contexts/TokenContext';
import Colors from '@/constants/colors';
import { 
  Wallet, 
  Coins, 
  TrendingUp, 
  ArrowUpRight,
  Clock,
  Zap,
  Shield,
  ChevronRight,
} from 'lucide-react-native';
import { useState, useCallback } from 'react';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { tokens } = useTokens();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const stats = [
    {
      label: 'Balance',
      value: `$${(user?.balance || 0).toLocaleString()}`,
      icon: Wallet,
      color: Colors.dark.accent,
    },
    {
      label: 'Tokens Created',
      value: tokens.length.toString(),
      icon: Coins,
      color: Colors.dark.primary,
    },
    {
      label: 'Total Supply',
      value: tokens.reduce((acc, t) => acc + parseInt(t.totalSupply || '0'), 0).toLocaleString(),
      icon: TrendingUp,
      color: Colors.dark.accentBlue,
    },
  ];

  const quickActions = [
    { label: 'Create Token', icon: Zap, route: '/generator' },
    { label: 'View Account', icon: Shield, route: '/account' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, '#0F0F14']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.dark.primary}
              />
            }
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Welcome back,</Text>
                <Text style={styles.username}>{user?.fullName || 'User'}</Text>
              </View>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={[Colors.dark.primary, Colors.dark.primaryLight]}
                  style={styles.avatar}
                >
                  <Text style={styles.avatarText}>
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </Text>
                </LinearGradient>
              </View>
            </View>

            <View style={styles.balanceCard}>
              <LinearGradient
                colors={['#1E1E28', '#16161E']}
                style={styles.balanceGradient}
              >
                <View style={styles.balanceHeader}>
                  <Text style={styles.balanceLabel}>Total Portfolio Value</Text>
                  <View style={styles.changeContainer}>
                    <ArrowUpRight size={14} color={Colors.dark.success} />
                    <Text style={styles.changeText}>+12.5%</Text>
                  </View>
                </View>
                <Text style={styles.balanceAmount}>
                  ${((user?.balance || 0) * 1.125).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </Text>
                <View style={styles.balanceDivider} />
                <View style={styles.balanceFooter}>
                  <View style={styles.balanceFooterItem}>
                    <Clock size={14} color={Colors.dark.textMuted} />
                    <Text style={styles.balanceFooterText}>Updated just now</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.statsContainer}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                    <stat.icon size={20} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.actionsContainer}>
                {quickActions.map((action, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.actionCard}
                    onPress={() => router.push(action.route as any)}
                    activeOpacity={0.7}
                  >
                    <LinearGradient
                      colors={[Colors.dark.primary + '15', Colors.dark.primary + '05']}
                      style={styles.actionGradient}
                    >
                      <View style={styles.actionIcon}>
                        <action.icon size={24} color={Colors.dark.primary} />
                      </View>
                      <Text style={styles.actionLabel}>{action.label}</Text>
                      <ChevronRight size={18} color={Colors.dark.textMuted} />
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Tokens</Text>
                {tokens.length > 0 && (
                  <TouchableOpacity onPress={() => router.push('/account')}>
                    <Text style={styles.seeAll}>See All</Text>
                  </TouchableOpacity>
                )}
              </View>
              
              {tokens.length === 0 ? (
                <View style={styles.emptyState}>
                  <Coins size={48} color={Colors.dark.textMuted} />
                  <Text style={styles.emptyTitle}>No tokens yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Create your first token to get started
                  </Text>
                  <TouchableOpacity
                    style={styles.emptyButton}
                    onPress={() => router.push('/generator')}
                  >
                    <Text style={styles.emptyButtonText}>Create Token</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.tokensList}>
                  {tokens.slice(0, 3).map((token) => (
                    <View key={token.id} style={styles.tokenCard}>
                      <View style={styles.tokenIcon}>
                        <Text style={styles.tokenSymbolIcon}>
                          {token.symbol.charAt(0)}
                        </Text>
                      </View>
                      <View style={styles.tokenInfo}>
                        <Text style={styles.tokenName}>{token.name}</Text>
                        <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                      </View>
                      <View style={styles.tokenSupply}>
                        <Text style={styles.tokenSupplyValue}>
                          {parseInt(token.totalSupply).toLocaleString()}
                        </Text>
                        <Text style={styles.tokenNetwork}>{token.network}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.bottomPadding} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  username: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginTop: 4,
  },
  avatarContainer: {
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  balanceGradient: {
    padding: 24,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.success + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    color: Colors.dark.success,
    fontWeight: '600' as const,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginTop: 8,
  },
  balanceDivider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginVertical: 16,
  },
  balanceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceFooterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  balanceFooterText: {
    fontSize: 12,
    color: Colors.dark.textMuted,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontWeight: '500' as const,
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 12,
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.dark.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: 20,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.background,
  },
  tokensList: {
    gap: 12,
  },
  tokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  tokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.dark.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenSymbolIcon: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
  },
  tokenInfo: {
    flex: 1,
    marginLeft: 12,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  tokenSymbol: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  tokenSupply: {
    alignItems: 'flex-end',
  },
  tokenSupplyValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  tokenNetwork: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  bottomPadding: {
    height: 24,
  },
});
