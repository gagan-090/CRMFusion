import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import DashboardScreen from '../screens/DashboardScreen';
import SmartDialerScreen from '../screens/SmartDialerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

import { ThemeContext } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => {
        const routeName = route.name;
        let iconName = '';
        let label = '';

        switch (routeName) {
          case 'Dashboard':
            iconName = 'view-dashboard-outline';
            label = 'Dashboard';
            break;
          case 'SmartDialer':
            iconName = 'phone-dial-outline';
            label = 'Dialer';
            break;
          case 'Settings':
            iconName = 'cog-outline';
            label = 'Settings';
            break;
          case 'Profile':
            iconName = 'account-circle-outline';
            label = 'Profile';
            break;
        }

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: [styles.tabBar, { backgroundColor: theme.colors.tabBarBackground }],
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? theme.colors.tabBarIconActive : theme.colors.tabBarIconInactive;
            const bgColor = focused ? theme.colors.tabBarIconBackgroundActive : theme.colors.tabBarIconBackgroundInactive;

            return (
              <View style={styles.tabItem}>
                <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
                  <MaterialCommunityIcons name={iconName} size={28} color={iconColor} />
                </View>
                <Text style={[styles.iconLabel, { color: iconColor }]} numberOfLines={1}>
                  {label}
                </Text>
              </View>
            );
          },
        };
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="SmartDialer" component={SmartDialerScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabs;

const styles = StyleSheet.create({
  tabBar: {
    height: 90,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 12,
    paddingBottom: 10,
    paddingTop: 6,
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  iconLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
