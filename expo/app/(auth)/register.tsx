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
import { Mail, Lock, User, UserCircle, Eye, EyeOff, ArrowRight, ChevronLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isRegisterLoading } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      await register(email.trim(), password, username.trim(), fullName.trim());
      router.replace('/home');
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Could not create account');
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
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
              >
                <ChevronLeft size={24} color={Colors.dark.text} />
              </TouchableOpacity>

              <View style={styles.header}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Start generating tokens today</Text>
              </View>

              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <UserCircle size={20} color={Colors.dark.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={fullName}
                    onChangeText={setFullName}
                    autoCapitalize="words"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <User size={20} color={Colors.dark.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                </View>

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

                <View style={styles.inputContainer}>
                  <Lock size={20} color={Colors.dark.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    placeholderTextColor={Colors.dark.textMuted}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                  />
                </View>

                <TouchableOpacity
                  style={[styles.registerButton, isRegisterLoading && styles.buttonDisabled]}
                  onPress={handleRegister}
                  disabled={isRegisterLoading}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={[Colors.dark.primary, Colors.dark.primaryLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.registerButtonText}>
                      {isRegisterLoading ? 'Creating Account...' : 'Create Account'}
                    </Text>
                    {!isRegisterLoading && (
                      <ArrowRight size={20} color={Colors.dark.background} />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity>
                    <Text style={styles.signInLink}>Sign In</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.dark.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 32,
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
  registerButton: {
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
  registerButtonText: {
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
  signInLink: {
    color: Colors.dark.primary,
    fontSize: 15,
    fontWeight: '600' as const,
  },
});
