import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const SettingsScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {
        // Add logout logic here, e.g., clearing auth tokens, navigating to login screen
        Alert.alert('Logged out', 'You have been logged out.');
      }},
    ]);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Settings</Text>
      <View style={[styles.section, { backgroundColor: theme.colors.sectionBackground, padding: 10, borderRadius: 8 }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Notifications</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>Enabled</Text>
      </View>
      <View style={[styles.section, { backgroundColor: theme.colors.sectionBackground, padding: 10, borderRadius: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={[styles.label, { color: theme.colors.text }]}>Dark Mode</Text>
        <Switch
          value={theme.dark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#767577', true: '#81C784' }}
          thumbColor={theme.dark ? '#4CAF50' : '#f4f3f4'}
        />
      </View>
      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.colors.logoutButtonBackground }]} onPress={handleLogout}>
        <Text style={[styles.logoutButtonText, { color: theme.colors.logoutButtonText }]}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
