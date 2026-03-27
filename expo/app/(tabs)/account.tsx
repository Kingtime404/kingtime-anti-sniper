import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { useTokens } from '@/contexts/TokenContext';
import Colors from '@/constants/colors';
import {
  User,
  Mail,
  Calendar,
  Coins,
  Wallet,
  Copy,
  Shield,
  Star,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

export default function AccountScreen() {
  const { user } = useAuth();
  const { tokens } = useTokens();

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Address copied to clipboard');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const accountStats = [
    {
      label: 'Account Status',
      value: 'Verified',
      icon: Shield,
      color: Colors.dark.success,
    },
    {
      label: 'Member Tier',
      value: 'Gold',
      icon: Star,
      color: Colors.dark.primary,
    },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, '#0F0F14']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Account</Text>
            </View>

            <View style={styles.profileCard}>
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.primaryLight]}
                style={styles.avatarLarge}
              >
                <Text style={styles.avatarLargeText}>
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
              <Text style={styles.profileName}>{user?.fullName || 'User'}</Text>
              <Text style={styles.profileUsername}>@{user?.username || 'user'}</Text>
              
              <View style={styles.statsRow}>
                {accountStats.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <View style={[styles.statIconSmall, { backgroundColor: stat.color + '20' }]}>
                      <stat.icon size={16} color={stat.color} />
                    </View>
                    <View>
                      <Text style={styles.statItemValue}>{stat.value}</Text>
                      <Text style={styles.statItemLabel}>{stat.label}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Details</Text>
              
              <View style={styles.detailsCard}>
                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <User size={18} color={Colors.dark.textSecondary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Full Name</Text>
                    <Text style={styles.detailValue}>{user?.fullName || '-'}</Text>
                  </View>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Mail size={18} color={Colors.dark.textSecondary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Email</Text>
                    <Text style={styles.detailValue}>{user?.email || '-'}</Text>
                  </View>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Calendar size={18} color={Colors.dark.textSecondary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Member Since</Text>
                    <Text style={styles.detailValue}>
                      {user?.createdAt ? formatDate(user.createdAt) : '-'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Wallet size={18} color={Colors.dark.textSecondary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Balance</Text>
                    <Text style={styles.detailValue}>
                      ${(user?.balance || 0).toLocaleString()}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailDivider} />

                <View style={styles.detailRow}>
                  <View style={styles.detailIcon}>
                    <Coins size={18} color={Colors.dark.textSecondary} />
                  </View>
                  <View style={styles.detailContent}>
                    <Text style={styles.detailLabel}>Tokens Generated</Text>
                    <Text style={styles.detailValue}>{user?.tokensGenerated || 0}</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Tokens ({tokens.length})</Text>
              
              {tokens.length === 0 ? (
                <View style={styles.emptyTokens}>
                  <Coins size={40} color={Colors.dark.textMuted} />
                  <Text style={styles.emptyText}>No tokens created yet</Text>
                </View>
              ) : (
                <View style={styles.tokensList}>
                  {tokens.map((token) => (
                    <View key={token.id} style={styles.tokenCard}>
                      <View style={styles.tokenHeader}>
                        <View style={styles.tokenIconLarge}>
                          <Text style={styles.tokenIconText}>
                            {token.symbol.charAt(0)}
                          </Text>
                        </View>
                        <View style={styles.tokenMainInfo}>
                          <Text style={styles.tokenName}>{token.name}</Text>
                          <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                        </View>
                        <View style={[styles.networkBadge, { backgroundColor: getNetworkColor(token.network) + '20' }]}>
                          <Text style={[styles.networkBadgeText, { color: getNetworkColor(token.network) }]}>
                            {token.network.toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.tokenDetails}>
                        <View style={styles.tokenDetailRow}>
                          <Text style={styles.tokenDetailLabel}>Total Supply</Text>
                          <Text style={styles.tokenDetailValue}>
                            {parseInt(token.totalSupply).toLocaleString()}
                          </Text>
                        </View>
                        <View style={styles.tokenDetailRow}>
                          <Text style={styles.tokenDetailLabel}>Decimals</Text>
                          <Text style={styles.tokenDetailValue}>{token.decimals}</Text>
                        </View>
                        <View style={styles.tokenDetailRow}>
                          <Text style={styles.tokenDetailLabel}>Created</Text>
                          <Text style={styles.tokenDetailValue}>
                            {formatDate(token.createdAt)}
                          </Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity
                        style={styles.contractRow}
                        onPress={() => copyToClipboard(token.contractAddress)}
                      >
                        <Text style={styles.contractText} numberOfLines={1}>
                          {token.contractAddress}
                        </Text>
                        <Copy size={14} color={Colors.dark.textMuted} />
                      </TouchableOpacity>
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

const getNetworkColor = (network: string): string => {
  const colors: Record<string, string> = {
    ethereum: '#627EEA',
    bsc: '#F3BA2F',
    polygon: '#8247E5',
    avalanche: '#E84142',
    solana: '#00FFA3',
  };
  return colors[network] || Colors.dark.primary;
};

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
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.dark.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLargeText: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginTop: 16,
  },
  profileUsername: {
    fontSize: 15,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    paddingHorizontal: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statIconSmall: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statItemValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  statItemLabel: {
    fontSize: 11,
    color: Colors.dark.textMuted,
    marginTop: 2,
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 4,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.dark.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.dark.textMuted,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.dark.text,
    marginTop: 2,
  },
  detailDivider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginHorizontal: 16,
  },
  emptyTokens: {
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 40,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.dark.textMuted,
    marginTop: 12,
  },
  tokensList: {
    gap: 16,
  },
  tokenCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  tokenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIconLarge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.dark.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenIconText: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.primary,
  },
  tokenMainInfo: {
    flex: 1,
    marginLeft: 14,
  },
  tokenName: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  tokenSymbol: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  networkBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  networkBadgeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  tokenDetails: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    gap: 10,
  },
  tokenDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tokenDetailLabel: {
    fontSize: 13,
    color: Colors.dark.textMuted,
  },
  tokenDetailValue: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.dark.text,
  },
  contractRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
    gap: 8,
  },
  contractText: {
    flex: 1,
    fontSize: 12,
    color: Colors.dark.textSecondary,
    fontFamily: 'monospace',
  },
  bottomPadding: {
    height: 32,
  },
});
