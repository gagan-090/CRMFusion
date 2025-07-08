import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import DashboardScreen from '../screens/DashboardScreen';
import SmartDialerScreen from '../screens/SmartDialerScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => {
        const routeName = route.name;
        let iconName = '';
        switch (routeName) {
          case 'Dashboard':
            iconName = 'home';
            break;
          case 'SmartDialer':
            iconName = 'call';
            break;
          case 'Settings':
            iconName = 'settings';
            break;
          case 'Profile':
            iconName = 'person-circle';
            break;
          default:
            iconName = 'ellipse';
            break;
        }

        const iconColorDefault = '#9e9e9e';
        const iconColorFocused = '#43a047';
        const bgColorDefault = '#f9f9f9';
        const bgColorFocused = '#e6f4ea';

        return {
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused ? iconColorFocused : iconColorDefault;
            const bgColor = focused ? bgColorFocused : bgColorDefault;

            return (
              <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
                <Icon name={iconName} size={20} color={iconColor} />
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
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    height: 75,
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    position: 'absolute',
  },
  iconWrapper: {
    borderRadius: 40,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
