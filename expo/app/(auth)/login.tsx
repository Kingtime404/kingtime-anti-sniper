import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { Mail, Lock, Coins, Eye, EyeOff, ArrowRight } from 'lucide-react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoginLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    try {
      await login(email.trim(), password);
      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.dark.background, '#12121A', Colors.dark.background]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView 
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.header}>
                <View style={styles.logoWrapper}>
                  <LinearGradient
                    colors={[Colors.dark.primary, Colors.dark.primaryLight]}
                    style={styles.logoGradient}
                  >
                    <Coins size={32} color={Colors.dark.background} strokeWidth={2} />
                  </LinearGradient>
                </View>
                <Text style={styles.title}>Welcome Back</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Mail size={20} color={Colors.dark.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.dark.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={Colors.dark.textMuted} />
                    ) : (
                      <Eye size={20} color={Colors.dark.textMuted} />
                    )}
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.loginButton, isLoginLoading && styles.buttonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoginLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[Colors.dark.primary, Colors.dark.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.loginButtonText}>
                      {isLoginLoading ? 'Signing in...' : 'Sign In'}
                    </Text>
                    {!isLoginLoading && (
                      <ArrowRight size={20} color={Colors.dark.background} />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Do not have an account? </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signUpLink}>Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoWrapper: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.dark.textSecondary,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: -8,
  },
  forgotText: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '500' as const,
  },
  loginButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    gap: 8,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.dark.background,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
  footerText: {
    color: Colors.dark.textSecondary,
    fontSize: 15,
  },
  signUpLink: {
    color: Colors.dark.primary,
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
