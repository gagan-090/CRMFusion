import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/Auth/LoginScreen';
import SignupScreen from '../screens/Auth/SignupScreen';
import LeadListScreen from '../screens/LeadListScreen';
import VoiceMailActivityScreen from '../screens/VoiceMailActivityScreen';
import ActivityDetailScreen from '../screens/ActivityDetailScreen';
import LeadDetailScreen from '../screens/LeadDetailScreen';
import Notifications from '../screens/Notifications';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="MainApp" component={BottomTabs} />
        <Stack.Screen name="LeadListScreen" component={LeadListScreen} />
        <Stack.Screen name="LeadDetailScreen" component={LeadDetailScreen} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        
        <Stack.Screen name="ActivityDetailScreen" component={ActivityDetailScreen} />
        <Stack.Screen name="VoiceMailActivityScreen" component={VoiceMailActivityScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
