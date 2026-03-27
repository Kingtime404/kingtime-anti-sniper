import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/colors';
import { useState } from 'react';
import {
  Bell,
  Shield,
  HelpCircle,
  FileText,
  LogOut,
  ChevronRight,
  Globe,
  Lock,
  Fingerprint,
  Info,
} from 'lucide-react-native';


interface SettingItem {
  icon: any;
  label: string;
  value?: string;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const settingsSections: { title: string; items: SettingItem[] }[] = [
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          label: 'Push Notifications',
          hasToggle: true,
          toggleValue: notifications,
          onToggle: setNotifications,
        },
        {
          icon: Fingerprint,
          label: 'Biometric Login',
          hasToggle: true,
          toggleValue: biometrics,
          onToggle: setBiometrics,
        },
        {
          icon: Globe,
          label: 'Language',
          value: 'English',
          onPress: () => Alert.alert('Language', 'Language settings coming soon'),
        },
      ],
    },
    {
      title: 'Security',
      items: [
        {
          icon: Lock,
          label: 'Change Password',
          onPress: () => Alert.alert('Security', 'Password change coming soon'),
        },
        {
          icon: Shield,
          label: 'Two-Factor Authentication',
          value: 'Enabled',
          onPress: () => Alert.alert('2FA', '2FA settings coming soon'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          onPress: () => Alert.alert('Help', 'Help center coming soon'),
        },
        {
          icon: FileText,
          label: 'Terms of Service',
          onPress: () => Alert.alert('Terms', 'Terms of service'),
        },
        {
          icon: Info,
          label: 'About',
          value: 'v1.0.0',
          onPress: () => Alert.alert('About', 'CryptoGen Token Generator v1.0.0'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: LogOut,
          label: 'Logout',
          onPress: handleLogout,
          danger: true,
        },
      ],
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
              <Text style={styles.headerTitle}>Settings</Text>
            </View>

            <TouchableOpacity style={styles.profileCard} activeOpacity={0.7}>
              <LinearGradient
                colors={[Colors.dark.primary, Colors.dark.primaryLight]}
                style={styles.profileAvatar}
              >
                <Text style={styles.profileAvatarText}>
                  {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </LinearGradient>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.fullName || 'User'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'user@email.com'}</Text>
              </View>
              <ChevronRight size={20} color={Colors.dark.textMuted} />
            </TouchableOpacity>

            {settingsSections.map((section, sectionIndex) => (
              <View key={sectionIndex} style={styles.section}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <View style={styles.sectionCard}>
                  {section.items.map((item, itemIndex) => (
                    <View key={itemIndex}>
                      {itemIndex > 0 && <View style={styles.divider} />}
                      <TouchableOpacity
                        style={styles.settingRow}
                        onPress={item.onPress}
                        disabled={item.hasToggle}
                        activeOpacity={0.7}
                      >
                        <View style={[
                          styles.settingIcon,
                          item.danger && styles.settingIconDanger
                        ]}>
                          <item.icon 
                            size={18} 
                            color={item.danger ? Colors.dark.error : Colors.dark.textSecondary} 
                          />
                        </View>
                        <Text style={[
                          styles.settingLabel,
                          item.danger && styles.settingLabelDanger
                        ]}>
                          {item.label}
                        </Text>
                        {item.hasToggle ? (
                          <Switch
                            value={item.toggleValue}
                            onValueChange={item.onToggle}
                            trackColor={{ 
                              false: Colors.dark.border, 
                              true: Colors.dark.primary + '60' 
                            }}
                            thumbColor={item.toggleValue ? Colors.dark.primary : Colors.dark.textMuted}
                          />
                        ) : item.value ? (
                          <View style={styles.settingValue}>
                            <Text style={styles.settingValueText}>{item.value}</Text>
                            <ChevronRight size={16} color={Colors.dark.textMuted} />
                          </View>
                        ) : !item.danger && (
                          <ChevronRight size={18} color={Colors.dark.textMuted} />
                        )}
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            ))}

            <Text style={styles.footer}>
              CryptoGen Token Generator{'\n'}
              Made with ❤️ for crypto enthusiasts
            </Text>
            
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
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.dark.text,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    backgroundColor: Colors.dark.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  profileAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.dark.background,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  profileName: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.dark.text,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.dark.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.dark.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingIconDanger: {
    backgroundColor: Colors.dark.error + '15',
  },
  settingLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark.text,
  },
  settingLabelDanger: {
    color: Colors.dark.error,
  },
  settingValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  settingValueText: {
    fontSize: 14,
    color: Colors.dark.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.dark.border,
    marginLeft: 66,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.dark.textMuted,
    marginTop: 40,
    lineHeight: 20,
  },
  bottomPadding: {
    height: 32,
  },
});
