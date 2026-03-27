import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useState, useCallback } from 'react';
import Colors from '@/constants/colors';
import { useTokens } from '@/contexts/TokenContext';
import { 
  Layers, 
  TrendingUp, 
  Lock,
  Unlock,
  Gift,
  ChevronRight,
  Percent,
  Wallet,
  Sparkles,
} from 'lucide-react-native';

interface StakingPool {
  id: string;
  name: string;
  symbol: string;
  apy: number;
  lockPeriod: number;
  minStake: number;
  totalStaked: number;
  userStaked: number;
  rewards: number;
  status: 'active' | 'locked' | 'claimable';
}

const mockPools: StakingPool[] = [
  {
    id: '1',
    name: 'Bitcoin',
    symbol: 'BTC',
    apy: 8.5,
    lockPeriod: 30,
    minStake: 0.001,
    totalStaked: 1250.45,
    userStaked: 0.5,
    rewards: 0.0035,
    status: 'active',
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    apy: 12.3,
    lockPeriod: 60,
    minStake: 0.01,
    totalStaked: 8420.12,
    userStaked: 2.5,
    rewards: 0.025,
    status: 'claimable',
  },
  {
    id: '3',
    name: 'Solana',
    symbol: 'SOL',
    apy: 15.8,
    lockPeriod: 90,
    minStake: 1,
    totalStaked: 125000,
    userStaked: 0,
    rewards: 0,
    status: 'active',
  },
  {
    id: '4',
    name: 'Cardano',
    symbol: 'ADA',
    apy: 6.2,
    lockPeriod: 14,
    minStake: 100,
    totalStaked: 5800000,
    userStaked: 1500,
    rewards: 7.75,
    status: 'locked',
  },
];

export default function StakingScreen() {
  const { tokens } = useTokens();
  const [refreshing, setRefreshing] = useState(false);
  const [pools] = useState<StakingPool[]>(mockPools);
  const [selectedTab, setSelectedTab] = useState<'all' | 'staked'>('all');

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const totalStakedValue = pools.reduce((acc, pool) => acc + (pool.userStaked * 1000), 0);
  const totalRewards = pools.reduce((acc, pool) => acc + (pool.rewards * 100), 0);
  const activeStakes = pools.filter(p => p.userStaked > 0).length;

  const filteredPools = selectedTab === 'staked' 
    ? pools.filter(p => p.userStaked > 0)
    : pools;

  const getStatusColor = (status: StakingPool['status']) => {
    switch (status) {
      case 'active': return Colors.dark.success;
      case 'locked': return Colors.dark.warning;
      case 'claimable': return Colors.dark.primary;
      default: return Colors.dark.textMuted;
    }
  };

  const getStatusText = (status: StakingPool['status']) => {
    switch (status) {
      case 'active': return 'Active';
      case 'locked': return 'Locked';
      case 'claimable': return 'Claim';
      default: return '';
    }
  };

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
              <Text style={styles.title}>Staking</Text>
              <Text style={styles.subtitle}>Earn rewards by staking tokens</Text>
            </View>

            <View style={styles.overviewCard}>
              <LinearGradient
                colors={[Colors.dark.primary + '20', Colors.dark.primary + '05']}
                style={styles.overviewGradient}
              >
                <View style={styles.overviewRow}>
                  <View style={styles.overviewItem}>
                    <View style={[styles.overviewIcon, { backgroundColor: Colors.dark.primary + '30' }]}>
                      <Wallet size={20} color={Colors.dark.primary} />
                    </View>
                    <Text style={styles.overviewValue}>${totalStakedValue.toLocaleString()}</Text>
                    <Text style={styles.overviewLabel}>Total Staked</Text>
                  </View>
                  <View style={styles.overviewDivider} />
                  <View style={styles.overviewItem}>
                    <View style={[styles.overviewIcon, { backgroundColor: Colors.dark.success + '30' }]}>
                      <Gift size={20} color={Colors.dark.success} />
                    </View>
                    <Text style={styles.overviewValue}>${totalRewards.toFixed(2)}</Text>
                    <Text style={styles.overviewLabel}>Rewards</Text>
                  </View>
                  <View style={styles.overviewDivider} />
                  <View style={styles.overviewItem}>
                    <View style={[styles.overviewIcon, { backgroundColor: Colors.dark.accentBlue + '30' }]}>
                      <Layers size={20} color={Colors.dark.accentBlue} />
                    </View>
                    <Text style={styles.overviewValue}>{activeStakes}</Text>
                    <Text style={styles.overviewLabel}>Active Stakes</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View style={styles.tabsContainer}>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'all' && styles.tabActive]}
                onPress={() => setSelectedTab('all')}
              >
                <Text style={[styles.tabText, selectedTab === 'all' && styles.tabTextActive]}>
                  All Pools
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, selectedTab === 'staked' && styles.tabActive]}
                onPress={() => setSelectedTab('staked')}
              >
                <Text style={[styles.tabText, selectedTab === 'staked' && styles.tabTextActive]}>
                  My Stakes
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.poolsSection}>
              <Text style={styles.sectionTitle}>
                {selectedTab === 'all' ? 'Available Pools' : 'Your Staked Tokens'}
              </Text>

              {filteredPools.length === 0 ? (
                <View style={styles.emptyState}>
                  <Layers size={48} color={Colors.dark.textMuted} />
                  <Text style={styles.emptyTitle}>No stakes yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Start staking to earn rewards
                  </Text>
                </View>
              ) : (
                <View style={styles.poolsList}>
                  {filteredPools.map((pool) => (
                    <TouchableOpacity key={pool.id} style={styles.poolCard} activeOpacity={0.7}>
                      <View style={styles.poolHeader}>
                        <View style={styles.poolInfo}>
                          <View style={styles.poolIcon}>
                            <Text style={styles.poolIconText}>{pool.symbol.charAt(0)}</Text>
                          </View>
                          <View>
                            <Text style={styles.poolName}>{pool.name}</Text>
                            <Text style={styles.poolSymbol}>{pool.symbol}</Text>
                          </View>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pool.status) + '20' }]}>
                          <View style={[styles.statusDot, { backgroundColor: getStatusColor(pool.status) }]} />
                          <Text style={[styles.statusText, { color: getStatusColor(pool.status) }]}>
                            {getStatusText(pool.status)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.poolStats}>
                        <View style={styles.poolStat}>
                          <View style={styles.poolStatRow}>
                            <Percent size={14} color={Colors.dark.success} />
                            <Text style={styles.poolStatLabel}>APY</Text>
                          </View>
                          <Text style={styles.poolStatValue}>{pool.apy}%</Text>
                        </View>
                        <View style={styles.poolStat}>
                          <View style={styles.poolStatRow}>
                            <Lock size={14} color={Colors.dark.warning} />
                            <Text style={styles.poolStatLabel}>Lock</Text>
                          </View>
                          <Text style={styles.poolStatValue}>{pool.lockPeriod}d</Text>
                        </View>
                        <View style={styles.poolStat}>
                          <View style={styles.poolStatRow}>
                            <TrendingUp size={14} color={Colors.dark.accentBlue} />
                            <Text style={styles.poolStatLabel}>TVL</Text>
                          </View>
                          <Text style={styles.poolStatValue}>
                            {pool.totalStaked > 1000 
                              ? `${(pool.totalStaked / 1000).toFixed(1)}K` 
                              : pool.totalStaked.toFixed(2)}
                          </Text>
                        </View>
                      </View>

                      {pool.userStaked > 0 && (
                        <View style={styles.userStakeSection}>
                          <View style={styles.userStakeRow}>
                            <Text style={styles.userStakeLabel}>Your Stake</Text>
                            <Text style={styles.userStakeValue}>
                              {pool.userStaked} {pool.symbol}
                            </Text>
                          </View>
                          <View style={styles.userStakeRow}>
                            <Text style={styles.userStakeLabel}>Earned Rewards</Text>
                            <Text style={[styles.userStakeValue, { color: Colors.dark.success }]}>
                              +{pool.rewards} {pool.symbol}
                            </Text>
                          </View>
                        </View>
                      )}

                      <View style={styles.poolActions}>
                        {pool.userStaked > 0 ? (
                          <>
                            <TouchableOpacity style={styles.actionButtonSecondary}>
                              <Unlock size={16} color={Colors.dark.text} />
                              <Text style={styles.actionButtonSecondaryText}>Unstake</Text>
                            </TouchableOpacity>
                            {pool.status === 'claimable' && (
                              <TouchableOpacity style={styles.actionButtonPrimary}>
                                <Sparkles size={16} color={Colors.dark.background} />
                                <Text style={styles.actionButtonPrimaryText}>Claim</Text>
                              </TouchableOpacity>
                            )}
                          </>
                        ) : (
                          <TouchableOpacity style={styles.actionButtonPrimary}>
                            <Lock size={16} color={Colors.dark.background} />
                            <Text style={styles.actionButtonPrimaryText}>Stake Now</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {tokens.length > 0 && (
              <View style={styles.customTokensSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Stake Your Tokens</Text>
                </View>
                <Text style={styles.customTokensHint}>
                  Create staking pools for your generated tokens
                </Text>
                <View style={styles.customTokensList}>
                  {tokens.slice(0, 2).map((token) => (
                    <TouchableOpacity key={token.id} style={styles.customTokenCard} activeOpacity={0.7}>
                      <View style={styles.customTokenIcon}>
                        <Text style={styles.customTokenIconText}>{token.symbol.charAt(0)}</Text>
                      </View>
                      <View style={styles.customTokenInfo}>
                        <Text style={styles.customTokenName}>{token.name}</Text>
                        <Text style={styles.customTokenSymbol}>{token.symbol}</Text>
                      </View>
                      <ChevronRight size={20} color={Colors.dark.textMuted} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

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
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  overviewCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  overviewGradient: {
    padding: 20,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewItem: {
    flex: 1,
    alignItems: 'center',
  },
  overviewIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  overviewLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  overviewDivider: {
    width: 1,
    height: 50,
    backgroundColor: Colors.dark.border,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: Colors.dark.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.textSecondary,
  },
  tabTextActive: {
    color: Colors.dark.background,
  },
  poolsSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 16,
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
  poolsList: {
    gap: 16,
  },
  poolCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  poolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  poolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  poolIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.dark.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  poolIconText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
  },
  poolName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  poolSymbol: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  poolStats: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  poolStat: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    borderRadius: 12,
    padding: 12,
  },
  poolStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  poolStatLabel: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
  },
  poolStatValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  userStakeSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    gap: 8,
  },
  userStakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userStakeLabel: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
  },
  userStakeValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  poolActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  actionButtonPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.primary,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonPrimaryText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.background,
  },
  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dark.surfaceLight,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  actionButtonSecondaryText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  customTokensSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  customTokensHint: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginBottom: 16,
    marginTop: -8,
  },
  customTokensList: {
    gap: 12,
  },
  customTokenCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  customTokenIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.dark.accent + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  customTokenIconText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.dark.accent,
  },
  customTokenInfo: {
    flex: 1,
    marginLeft: 12,
  },
  customTokenName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  customTokenSymbol: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  bottomPadding: {
    height: 24,
  },
});
