import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTokens } from '@/contexts/TokenContext';
import Colors from '@/constants/colors';
import {
  Coins,
  Hash,
  Layers,
  CircleDot,
  Globe,
  Sparkles,
  CheckCircle,
  Copy,
} from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';

const NETWORKS = [
  { id: 'ethereum', name: 'Ethereum', color: '#627EEA' },
  { id: 'bsc', name: 'BSC', color: '#F3BA2F' },
  { id: 'polygon', name: 'Polygon', color: '#8247E5' },
  { id: 'avalanche', name: 'Avalanche', color: '#E84142' },
  { id: 'solana', name: 'Solana', color: '#00FFA3' },
];

export default function GeneratorScreen() {
  const { createToken, isCreating } = useTokens();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [decimals, setDecimals] = useState('18');
  const [network, setNetwork] = useState('ethereum');
  const [generatedToken, setGeneratedToken] = useState<{
    name: string;
    symbol: string;
    contractAddress: string;
    network: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a token name');
      return;
    }
    if (!symbol.trim() || symbol.length > 6) {
      Alert.alert('Error', 'Symbol must be 1-6 characters');
      return;
    }
    if (!totalSupply.trim() || parseInt(totalSupply) <= 0) {
      Alert.alert('Error', 'Please enter a valid total supply');
      return;
    }

    try {
      const token = await createToken({
        name: name.trim(),
        symbol: symbol.trim().toUpperCase(),
        totalSupply: totalSupply.trim(),
        decimals: parseInt(decimals) || 18,
        network,
      });
      
      setGeneratedToken({
        name: token.name,
        symbol: token.symbol,
        contractAddress: token.contractAddress,
        network: token.network,
      });
      
      setName('');
      setSymbol('');
      setTotalSupply('');
      setDecimals('18');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create token');
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied!', 'Contract address copied to clipboard');
  };

  

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, '#0F0F14']}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <View style={styles.headerIcon}>
                  <Sparkles size={28} color={Colors.dark.primary} />
                </View>
                <Text style={styles.headerTitle}>Token Generator</Text>
                <Text style={styles.headerSubtitle}>
                  Create your own cryptocurrency token
                </Text>
              </View>

              {generatedToken && (
                <View style={styles.successCard}>
                  <LinearGradient
                    colors={[Colors.dark.success + '20', Colors.dark.success + '05']}
                    style={styles.successGradient}
                  >
                    <CheckCircle size={32} color={Colors.dark.success} />
                    <Text style={styles.successTitle}>Token Created!</Text>
                    <Text style={styles.successName}>
                      {generatedToken.name} ({generatedToken.symbol})
                    </Text>
                    <View style={styles.contractContainer}>
                      <Text style={styles.contractLabel}>Contract Address</Text>
                      <TouchableOpacity
                        style={styles.contractRow}
                        onPress={() => copyToClipboard(generatedToken.contractAddress)}
                      >
                        <Text style={styles.contractAddress} numberOfLines={1}>
                          {generatedToken.contractAddress}
                        </Text>
                        <Copy size={16} color={Colors.dark.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                      style={styles.newTokenButton}
                      onPress={() => setGeneratedToken(null)}
                    >
                      <Text style={styles.newTokenButtonText}>Create Another</Text>
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              )}

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Coins size={16} color={Colors.dark.textSecondary} />
                    <Text style={styles.label}>Token Name</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. My Awesome Token"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Hash size={16} color={Colors.dark.textSecondary} />
                    <Text style={styles.label}>Symbol</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. MAT"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={symbol}
                    onChangeText={(text) => setSymbol(text.toUpperCase())}
                    maxLength={6}
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Layers size={16} color={Colors.dark.textSecondary} />
                    <Text style={styles.label}>Total Supply</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 1000000"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={totalSupply}
                    onChangeText={setTotalSupply}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <CircleDot size={16} color={Colors.dark.textSecondary} />
                    <Text style={styles.label}>Decimals</Text>
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="18"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={decimals}
                    onChangeText={setDecimals}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Globe size={16} color={Colors.dark.textSecondary} />
                    <Text style={styles.label}>Network</Text>
                  </View>
                  <View style={styles.networkContainer}>
                    {NETWORKS.map((net) => (
                      <TouchableOpacity
                        key={net.id}
                        style={[
                          styles.networkOption,
                          network === net.id && styles.networkSelected,
                          network === net.id && { borderColor: net.color },
                        ]}
                        onPress={() => setNetwork(net.id)}
                      >
                        <View
                          style={[
                            styles.networkDot,
                            { backgroundColor: net.color },
                          ]}
                        />
                        <Text
                          style={[
                            styles.networkName,
                            network === net.id && styles.networkNameSelected,
                          ]}
                        >
                          {net.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity
                  style={[styles.generateButton, isCreating && styles.buttonDisabled]}
                  onPress={handleGenerate}
                  disabled={isCreating}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[Colors.dark.primary, Colors.dark.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.generateGradient}
                  >
                    <Sparkles size={20} color={Colors.dark.background} />
                    <Text style={styles.generateText}>
                      {isCreating ? 'Generating...' : 'Generate Token'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>How it works</Text>
                <Text style={styles.infoText}>
                  1. Enter your token details above{'\n'}
                  2. Select your preferred blockchain network{'\n'}
                  3. Click generate to create your token{'\n'}
                  4. Your token will be deployed instantly
                </Text>
              </View>
              
              <View style={styles.bottomPadding} />
            </ScrollView>
          </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.dark.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 8,
  },
  successCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.success + '30',
  },
  successGradient: {
    padding: 24,
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.dark.success,
    marginTop: 12,
  },
  successName: {
    fontSize: 16,
    color: Colors.dark.text,
    marginTop: 8,
  },
  contractContainer: {
    width: '100%',
    marginTop: 16,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 12,
  },
  contractLabel: {
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginBottom: 8,
  },
  contractRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contractAddress: {
    flex: 1,
    fontSize: 13,
    color: Colors.dark.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  newTokenButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.success,
  },
  newTokenButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.dark.success,
  },
  form: {
    paddingHorizontal: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 10,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: Colors.dark.textSecondary,
  },
  input: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: Colors.dark.text,
  },
  networkContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  networkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    gap: 8,
  },
  networkSelected: {
    backgroundColor: Colors.dark.surfaceLight,
    borderWidth: 2,
  },
  networkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  networkName: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    fontWeight: '500' as const,
  },
  networkNameSelected: {
    color: Colors.dark.text,
  },
  generateButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  generateGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 10,
  },
  generateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.background,
  },
  infoCard: {
    marginHorizontal: 20,
    marginTop: 32,
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.dark.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    lineHeight: 22,
  },
  bottomPadding: {
    height: 32,
  },
});
