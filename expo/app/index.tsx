import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { Coins } from 'lucide-react-native';

export default function SplashScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/home');
        } else {
          router.replace('/(auth)/login');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, '#1A1A2E', Colors.dark.background]}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={[Colors.dark.primary, Colors.dark.primaryLight]}
              style={styles.iconGradient}
            >
              <Coins size={48} color={Colors.dark.background} strokeWidth={2} />
            </LinearGradient>
          </View>
          <Text style={styles.title}>CryptoGen</Text>
          <Text style={styles.subtitle}>Token Generator</Text>
        </View>
        
        <ActivityIndicator 
          size="large" 
          color={Colors.dark.primary} 
          style={styles.loader}
        />
        
        <Text style={styles.footer}>Powered by Blockchain</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 20,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
    marginTop: 8,
    letterSpacing: 2,
  },
  loader: {
    marginTop: 60,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    color: Colors.dark.textMuted,
    fontSize: 12,
    letterSpacing: 1,
  },
});
