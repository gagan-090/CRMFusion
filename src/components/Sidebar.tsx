import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useWindowDimensions, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { ThemeContext } from '../context/ThemeContext';
import { responsiveFontSize, responsiveIconSize, isTV } from '../utils/responsive';

const Sidebar: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { width: windowWidth } = useWindowDimensions();
  const { theme } = useContext(ThemeContext);

  const sidebarWidth = windowWidth * 0.25; // 25% of screen width, adaptive
  const avatarSize = sidebarWidth * 0.28; // scale avatar size relative to sidebar width

  const iconSize = responsiveIconSize(20);
  const smallIconSize = responsiveIconSize(16);
  const fontSizeLarge = responsiveFontSize(16);
  const fontSizeMedium = responsiveFontSize(14);
  const fontSizeSmall = responsiveFontSize(12);

  const touchTargetSize = isTV() ? 64 : 48; // larger touch targets for TV

  const menuItems = [
    { label: 'Voicemails', icon: 'headphones', screen: 'VoiceMailActivityScreen' },
    { label: 'Manage Leads', icon: 'account-group', screen: 'LeadListScreen' },
    { label: 'Notifications', icon: 'bell-outline', screen: 'Notifications' },
    { label: 'Settings', icon: 'cog-outline', screen: 'Settings' },
    { label: 'Profile', icon: 'account-circle-outline', screen: 'ProfileScreen' },
  ];

  return (
    <View style={[styles.sidebar, { width: sidebarWidth, backgroundColor: theme.colors.sectionBackground, paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing.md }]}>
      <View style={styles.profileSection}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=5' }}
          style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
        />
        <Text style={[styles.name, { fontSize: fontSizeLarge, color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">Nandani Saraswat</Text>
        <Text style={[styles.email, { fontSize: fontSizeSmall, color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">rachelfoster1286@gmail.com</Text>
        <TouchableOpacity
          style={[styles.composeBtn, { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, minHeight: touchTargetSize }]}
          onPress={() => navigation.navigate('QuickComposeScreen' as keyof typeof navigation)}
          activeOpacity={0.7}
        >
          <Icon name="plus" size={smallIconSize} color="#fff" />
          <Text style={[styles.composeText, { fontSize: fontSizeMedium }]}>Quick Compose</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { minHeight: touchTargetSize }]}
            onPress={() => {
              if (item.screen === 'Logout') {
                // Handle logout logic here
              } else {
                navigation.navigate(item.screen as keyof typeof navigation);
              }
            }}
            activeOpacity={0.7}
          >
            <Icon name={item.icon} size={iconSize} color={theme.colors.text} />
            <Text style={[styles.menuText, { fontSize: fontSizeMedium, color: theme.colors.text }]} numberOfLines={1} ellipsizeMode="tail">{item.label}</Text>
            <Icon name="chevron-right" size={smallIconSize} color={theme.colors.tabBarIconInactive} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  sidebar: {
    elevation: 4,
    flexShrink: 0,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    marginBottom: 10,
    aspectRatio: 1,
  },
  name: {
    fontWeight: '700',
  },
  email: {
    marginBottom: 10,
  },
  composeBtn: {
    backgroundColor: '#007bff',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
    gap: 6,
  },
  composeText: {
    color: '#fff',
    fontWeight: '600',
  },
  menu: {
    marginTop: 16,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  menuText: {
    flex: 1,
    marginLeft: 10,
  },
});
