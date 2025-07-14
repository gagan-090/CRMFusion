import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  TextInput,
  Switch,
  Alert, // Import Alert for native dialogs
  Modal, // Import Modal for overlay
  TouchableWithoutFeedback, // For dismissing modal on outside tap
  Animated, // For animations
  Linking // For making calls
} from 'react-native';
import { PieChart } from 'react-native-chart-kit'; // Re-import PieChart from react-native-chart-kit
import Icon from 'react-native-vector-icons/Ionicons'; // Re-import Ionicons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // For the 9-dot icon and backspace

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// Determine if the device is a tablet for responsive styling
const isTablet = screenWidth > 600; // A common breakpoint for tablets

// Utility to generate a placeholder image URL (for demonstration, as local assets are preferred in RN)
const getPlaceholderImageUrl = (width, height, text = '') =>
  `https://placehold.co/${width}x${height}/a8b9c1/ffffff?text=${text}`;

// Main App Component to manage navigation and overall layout
const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard'); // State for active tab
  const [showManualDialerOverlay, setShowManualDialerOverlay] = useState(false); // State for manual dialer overlay

  return (
    <View style={styles.appContainer}>
      {/* Main content area */}
      <ScrollView contentContainerStyle={styles.mainContent}>
        {activeTab === 'dashboard' && <DashboardScreen />}
        {activeTab === 'dialer' && <SmartDialerScreen />}
        {activeTab === 'settings' && <SettingsScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </ScrollView>

      {/* Manual Dialer Overlay FAB */}
      <TouchableOpacity
        style={styles.manualDialerFab}
        onPress={() => setShowManualDialerOverlay(true)}
      >
        <MaterialCommunityIcons name="dots-grid" size={32} color="#ffffff" />
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <NavItem icon="grid-outline" label="Dashboard" isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
        <NavItem icon="keypad-outline" label="Dialer" isActive={activeTab === 'dialer'} onClick={() => setActiveTab('dialer')} />
        <NavItem icon="settings-outline" label="Settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        <NavItem icon="person-outline" label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
      </View>

      {/* Manual Dialer Overlay */}
      <ManualDialerOverlay
        isVisible={showManualDialerOverlay}
        onClose={() => setShowManualDialerOverlay(false)}
      />
    </View>
  );
};

// Navigation Item Component
const NavItem = ({ icon, label, isActive, onClick }) => (
  <TouchableOpacity
    style={[styles.navItem, isActive ? styles.navItemActive : null]}
    onPress={onClick}
  >
    <Icon name={icon} size={24} color={isActive ? '#2563eb' : '#6b7280'} />
    <Text style={[styles.navItemText, isActive ? styles.navItemTextActive : null]}>{label}</Text>
  </TouchableOpacity>
);

// Dashboard Screen Component
const DashboardScreen = () => {
  const callStats = [
    { name: 'Connected', count: 32, color: '#2ecc71', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Missed', count: 12, color: '#e74c3c', legendFontColor: '#333', legendFontSize: 12 },
    { name: 'Ongoing', count: 6, color: '#f1c40f', legendFontColor: '#333', legendFontSize: 12 },
  ];

  const totalCalls = callStats.reduce((sum, item) => sum + item.count, 0);
  const averageDuration = '03:45';

  return (
    <View style={styles.dashboardContainer}>
      <Text style={styles.heading}>Call Analytics</Text>

      {/* Pie Chart Section */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Call Distribution</Text>
        <PieChart
          data={callStats}
          width={screenWidth - 40} // Adjust width for padding
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute // Show absolute values in tooltip
        />
      </View>

      {/* Summary Cards */}
      <View style={styles.cardContainer}>
        <SummaryCard title="Total Calls" value={totalCalls} icon="call-outline" iconColor="#3b82f6" />
        <SummaryCard title="Connected" value={callStats[0].count} icon="call-made-outline" iconColor="#22c55e" />
        <SummaryCard title="Missed" value={callStats[1].count} icon="call-missed-outline" iconColor="#ef4444" />
        <SummaryCard title="Avg Duration" value={averageDuration} icon="time-outline" iconColor="#eab308" />
      </View>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: getPlaceholderImageUrl(60, 60, 'Agent') }} // Using placeholder image
          style={styles.avatar}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.agentName}>Alex Johnson</Text>
          <Text style={styles.agentRole}>CRM Agent</Text>
        </View>
      </View>

      {/* Floating Action Buttons */}
      <View style={styles.fabContainer}>
        <FabButton icon="call-outline" bgColor="#22c55e" />
        <FabButton icon="pause-outline" bgColor="#eab308" />
        <FabButton icon="close-outline" bgColor="#ef4444" />
      </View>
    </View>
  );
};

// Summary Card Component
const SummaryCard = ({ title, value, icon, iconColor }) => (
  <View style={styles.summaryCard}>
    <View style={[styles.iconCircle, { backgroundColor: iconColor + '1a' }]}>
      <Icon name={icon} size={20} color={iconColor} />
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

// Floating Action Button Component
const FabButton = ({ icon, bgColor }) => (
  <TouchableOpacity style={[styles.fab, { backgroundColor: bgColor }]}>
    <Icon name={icon} size={24} color="#ffffff" />
  </TouchableOpacity>
);

// Smart Dialer Screen Component
const SmartDialerScreen = () => {
  const [dialPadValue, setDialPadValue] = useState('');
  const [activeDialerTab, setActiveDialerTab] = useState('dialpad'); // 'dialpad', 'contacts', 'recents', 'ongoing'
  const [autoDialEnabled, setAutoDialEnabled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data
  const contacts = [
    { id: '1', name: 'Alice Smith', number: '123-456-7890' },
    { id: '2', name: 'Bob Johnson', number: '098-765-4321' },
    { id: '3', name: 'Charlie Brown', number: '111-222-3333' },
    { id: '4', name: 'Diana Prince', number: '444-555-6666' },
    { id: '5', name: 'Eve Adams', number: '777-888-9999' },
  ];

  const recentCalls = [
    { id: 'r1', name: 'Alice Smith', number: '123-456-7890', type: 'outgoing', time: '10:30 AM' },
    { id: 'r2', name: 'Unknown', number: '555-123-4567', type: 'missed', time: 'Yesterday' },
    { id: 'r3', name: 'Bob Johnson', number: '098-765-4321', type: 'incoming', time: 'July 10' },
  ];

  const ongoingCalls = [
    // { id: 'o1', name: 'Support Line', number: '999-888-7777', duration: '00:05:32' },
  ];

  const handleDialPadPress = (digit) => {
    setDialPadValue((prev) => prev + digit);
  };

  const handleDelete = () => {
    setDialPadValue((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setDialPadValue('');
  };

  const handleCall = () => {
    if (dialPadValue) {
      Alert.alert('Initiating Call', `Calling ${dialPadValue}...`, [
        { text: 'OK', onPress: () => setDialPadValue('') }
      ]);
    }
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.number.includes(searchTerm)
  );

  return (
    <View style={styles.dialerContainer}>
      <Text style={styles.heading}>Smart Dialer</Text>

      {/* Dialer Tabs */}
      <View style={styles.dialerTabs}>
        <DialerTab label="Dial Pad" isActive={activeDialerTab === 'dialpad'} onClick={() => setActiveDialerTab('dialpad')} />
        <DialerTab label="Contacts" isActive={activeDialerTab === 'contacts'} onClick={() => setActiveDialerTab('contacts')} />
        <DialerTab label="Recents" isActive={activeDialerTab === 'recents'} onClick={() => setActiveDialerTab('recents')} />
        <DialerTab label="Ongoing" isActive={activeDialerTab === 'ongoing'} onClick={() => setActiveDialerTab('ongoing')} />
      </View>

      {/* Conditional Rendering based on activeDialerTab */}
      {activeDialerTab === 'dialpad' && (
        <View style={styles.dialPadSection}>
          {/* Dial Pad Input */}
          <View style={styles.dialPadInputContainer}>
            <TextInput
              style={styles.dialPadInput}
              value={dialPadValue}
              editable={false}
              placeholder="Enter number"
              placeholderTextColor="#9ca3af"
            />
          </View>

          {/* Dial Pad Buttons */}
          <View style={styles.dialPadButtonsGrid}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
              <DialPadButton key={digit} digit={digit} onPress={() => handleDialPadPress(digit)} />
            ))}
          </View>

          {/* Call and Delete Buttons */}
          <View style={styles.dialPadActions}>
            <TouchableOpacity onPress={handleClear} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCall} style={styles.callButton}>
              <Icon name="call-outline" size={28} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDelete} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>

          {/* Auto Dial Option */}
          <View style={styles.autoDialOption}>
            <Text style={styles.autoDialText}>Auto Dial</Text>
            <Switch
              trackColor={{ false: '#e5e7eb', true: '#93c5fd' }}
              thumbColor={autoDialEnabled ? '#2563eb' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => setAutoDialEnabled(!autoDialEnabled)}
              value={autoDialEnabled}
            />
          </View>
        </View>
      )}

      {activeDialerTab === 'contacts' && (
        <View style={styles.contactsSection}>
          <View style={styles.searchBarContainer}>
            <Icon name="search-outline" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchBarInput}
              placeholder="Search contacts..."
              placeholderTextColor="#9ca3af"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
          </View>
          {filteredContacts.length > 0 ? (
            <ScrollView style={styles.listScrollContainer}>
              {filteredContacts.map((contact) => (
                <View key={contact.id} style={styles.contactItem}>
                  <View style={styles.contactInfo}>
                    <View style={styles.contactAvatar}>
                      <Text style={styles.contactAvatarText}>{contact.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactNumber}>{contact.number}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => setDialPadValue(contact.number)} style={styles.contactCallButton}>
                    <Icon name="call-outline" size={20} color="#22c55e" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noDataText}>No contacts found.</Text>
          )}
          <TouchableOpacity style={styles.addNewContactButton}>
            <Icon name="add-outline" size={20} color="#ffffff" style={styles.addNewContactIcon} />
            <Text style={styles.addNewContactText}>Add New Contact</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeDialerTab === 'recents' && (
        <View style={styles.recentsSection}>
          {recentCalls.length > 0 ? (
            <ScrollView style={styles.listScrollContainer}>
              {recentCalls.map((call) => (
                <View key={call.id} style={styles.recentCallItem}>
                  <View style={styles.recentCallInfo}>
                    {call.type === 'outgoing' && <Icon name="arrow-up-circle-outline" size={20} color="#3b82f6" style={styles.callTypeIcon} />}
                    {call.type === 'missed' && <Icon name="call-missed-outline" size={20} color="#ef4444" style={styles.callTypeIcon} />}
                    {call.type === 'incoming' && <Icon name="arrow-down-circle-outline" size={20} color="#22c55e" style={styles.callTypeIcon} />}
                    <View>
                      <Text style={styles.recentCallName}>{call.name}</Text>
                      <Text style={styles.recentCallNumber}>{call.number}</Text>
                    </View>
                  </View>
                  <View style={styles.recentCallActions}>
                    <Text style={styles.recentCallTime}>{call.time}</Text>
                    <TouchableOpacity onPress={() => setDialPadValue(call.number)} style={styles.recentCallButton}>
                      <Icon name="call-outline" size={20} color="#22c55e" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noDataText}>No recent calls.</Text>
          )}
        </View>
      )}

      {activeDialerTab === 'ongoing' && (
        <View style={styles.ongoingSection}>
          {ongoingCalls.length > 0 ? (
            <ScrollView style={styles.listScrollContainer}>
              {ongoingCalls.map((call) => (
                <View key={call.id} style={styles.ongoingCallItem}>
                  <View style={styles.ongoingCallInfo}>
                    <Icon name="call-outline" size={20} color="#3b82f6" style={styles.callTypeIcon} />
                    <View>
                      <Text style={styles.ongoingCallName}>{call.name}</Text>
                      <Text style={styles.ongoingCallNumber}>{call.number}</Text>
                    </View>
                  </View>
                  <Text style={styles.ongoingCallDuration}>{call.duration}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noDataText}>No ongoing calls.</Text>
          )}
        </View>
      )}
    </View>
  );
};

// Dialer Tab Component
const DialerTab = ({ label, isActive, onClick }) => (
  <TouchableOpacity
    style={[styles.dialerTab, isActive ? styles.dialerTabActive : null]}
    onPress={onClick}
  >
    <Text style={[styles.dialerTabText, isActive ? styles.dialerTabTextActive : null]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Dial Pad Button Component (for SmartDialerScreen's internal dial pad)
const DialPadButton = ({ digit, onPress }) => (
  <TouchableOpacity
    style={styles.dialPadButton}
    onPress={onPress}
  >
    <Text style={styles.dialPadButtonText}>{digit}</Text>
  </TouchableOpacity>
);

// Manual Dialer Overlay Component
const ManualDialerOverlay = ({ isVisible, onClose }) => {
  const [dialNumber, setDialNumber] = useState('');
  const slideAnim = useState(new Animated.Value(0))[0]; // Start from 0 (off-screen bottom)
  const fadeAnim = useState(new Animated.Value(0))[0]; // Start from 0 opacity

  useEffect(() => {
    if (isVisible) {
      // Animate slide up and fade in
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1, // Animate to 1 (full height)
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1, // Fade to full opacity
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Animate slide down and fade out
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0, // Animate back to 0 (off-screen bottom)
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0, // Fade to 0 opacity
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => setDialNumber('')); // Clear number after closing
    }
  }, [isVisible]);

  // Calculate animated translateY based on slideAnim value
  // This will move the modal from the bottom of the screen to its centered position.
  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, (screenHeight - (screenHeight * 0.65)) / 2], // Slide from bottom to centered height
  });

  const handleDialPadPress = (digit) => {
    setDialNumber(prev => prev + digit);
  };

  const handleDelete = () => {
    setDialNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (dialNumber) {
      Alert.alert(
        'Confirm Call',
        `Do you want to call ${dialNumber}?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Call',
            onPress: () => {
              Linking.openURL(`tel:${dialNumber}`);
              onClose(); // Close the dialer after initiating call
            },
          },
        ],
        { cancelable: true }
      );
    } else {
      Alert.alert('No Number', 'Please enter a number to dial.');
    }
  };

  return (
    <Modal
      animationType="none" // Controlled by Animated.View
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose} // For Android back button
    >
      <TouchableWithoutFeedback onPress={onClose}>
        {/* Dimmed background with fade animation */}
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
          <TouchableWithoutFeedback onPress={() => { /* Prevents dismissal when tapping on the dialer content */ }}>
            {/* Dialer content with slide animation */}
            <Animated.View style={[
              styles.dialerOverlayPanelNew,
              { transform: [{ translateY }] },
              { width: isTablet ? screenWidth * 0.6 : screenWidth * 0.9 } // Responsive width
            ]}>
              {/* Close Icon */}
              <TouchableOpacity onPress={onClose} style={styles.overlayCloseButton}>
                <Icon name="close-circle-outline" size={28} color="#6b7280" />
              </TouchableOpacity>

              {/* Input Area */}
              <View style={styles.overlayInputContainerNew}>
                <TextInput
                  style={styles.overlayInputDisplayNew}
                  value={dialNumber}
                  editable={false}
                  placeholder="Enter number"
                  placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity onPress={handleDelete} style={styles.overlayBackspaceButtonNew}>
                  <MaterialCommunityIcons name="backspace-outline" size={28} color="#6b7280" />
                </TouchableOpacity>
              </View>

              {/* Keypad */}
              <View style={styles.overlayKeypadGridNew}>
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                  <TouchableOpacity
                    key={digit}
                    style={styles.overlayDialKeyNew}
                    onPress={() => handleDialPadPress(digit)}
                    activeOpacity={0.7} // Subtle press animation
                  >
                    <Text style={styles.overlayDialKeyTextNew}>{digit}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Action Button */}
              <TouchableOpacity style={styles.overlayDialButtonNew} onPress={handleCall}>
                <MaterialCommunityIcons name="phone" size={32} color="#ffffff" />
              </TouchableOpacity>

            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};


// Placeholder for Settings Screen
const SettingsScreen = () => (
  <View style={styles.placeholderScreen}>
    <Text style={styles.heading}>Settings</Text>
    <Text style={styles.placeholderText}>Settings options will go here.</Text>
    <Icon name="settings-outline" size={64} color="#d1d5db" style={styles.placeholderIcon} />
  </View>
);

// Placeholder for Profile Screen
const ProfileScreen = () => (
  <View style={styles.placeholderScreen}>
    <Text style={styles.heading}>User Profile</Text>
    <Text style={styles.placeholderText}>User profile details will be displayed here.</Text>
    <Icon name="person-outline" size={64} color="#d1d5db" style={styles.placeholderIcon} />
  </View>
);

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: '#f6fafd',
  },
  mainContent: {
    paddingBottom: 100, // Space for bottom navigation bar
    paddingTop: 40,
  },
  dashboardContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 20,
  },
  chartCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    width: '48%', // Approx half width with spacing
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  iconCircle: {
    padding: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#bfdbfe',
  },
  profileInfo: {
    marginLeft: 12,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  agentRole: {
    fontSize: 14,
    color: '#6b7280',
  },
  fabContainer: {
    position: 'absolute',
    bottom: 120, // Adjusted for bottom nav bar
    right: 20,
    flexDirection: 'column',
    gap: 12, // Using gap for spacing
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  manualDialerFab: {
    position: 'absolute',
    bottom: 120, // Position above the bottom nav bar
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6', // Blue color for the new dialer FAB
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 99, // Ensure it's above other content but below modal
  },
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    zIndex: 100, // Ensure nav bar is above main content
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#eff6ff',
  },
  navItemText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: '500',
    color: '#6b7280',
  },
  navItemTextActive: {
    color: '#2563eb',
  },
  dialerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dialerTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dialerTab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  dialerTabActive: {
    backgroundColor: '#2563eb',
    elevation: 2,
  },
  dialerTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  dialerTabTextActive: {
    color: '#ffffff',
  },
  dialPadSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dialPadInputContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  dialPadInput: {
    width: '100%',
    fontSize: 36,
    fontWeight: '300',
    color: '#1f2937',
    backgroundColor: '#f3f4f6',
    paddingVertical: 10,
    borderRadius: 8,
    textAlign: 'center',
    letterSpacing: 2,
  },
  dialPadButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12, // Using gap for spacing
  },
  dialPadButton: {
    width: 70,
    height: 70,
    backgroundColor: '#e5e7eb',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  dialPadButtonText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dialPadActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 30,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  callButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  autoDialOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    padding: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
  },
  autoDialText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e40af',
    marginRight: 10,
  },
  contactsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBarInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#1f2937',
  },
  listScrollContainer: {
    maxHeight: Dimensions.get('window').height * 0.5, // Limit height to prevent overflow
    marginBottom: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#bfdbfe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactAvatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  contactNumber: {
    fontSize: 13,
    color: '#6b7280',
  },
  contactCallButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
  },
  noDataText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 20,
    fontSize: 16,
  },
  addNewContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    elevation: 3,
  },
  addNewContactIcon: {
    marginRight: 8,
  },
  addNewContactText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  recentCallItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  recentCallInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  callTypeIcon: {
    marginRight: 10,
  },
  recentCallName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  recentCallNumber: {
    fontSize: 13,
    color: '#6b7280',
  },
  recentCallActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentCallTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginRight: 10,
  },
  recentCallButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#dcfce7',
  },
  ongoingCallItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  ongoingCallInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ongoingCallName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  ongoingCallNumber: {
    fontSize: 13,
    color: '#60a5fa',
  },
  ongoingCallDuration: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e40af',
  },
  placeholderScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 10,
    fontSize: 16,
  },
  placeholderIcon: {
    marginTop: 40,
    opacity: 0.5,
  },
  // Styles for Manual Dialer Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
    justifyContent: 'center', // Center the modal panel vertically
    alignItems: 'center', // Center the modal panel horizontally
  },
  dialerOverlayPanelNew: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    elevation: 8, // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    maxHeight: screenHeight * 0.65, // Max height ~65% of screen
  },
  overlayCloseButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1, // Ensure it's tappable
    padding: 5,
  },
  overlayInputContainerNew: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Adjusted padding
    paddingHorizontal: 10,
  },
  overlayInputDisplayNew: {
    flex: 1,
    fontSize: 28, // Large font size
    fontWeight: '600', // Bold
    color: '#1f2937',
    textAlign: 'center',
    paddingVertical: 10,
  },
  overlayBackspaceButtonNew: {
    padding: 10,
    borderRadius: 20,
  },
  overlayKeypadGridNew: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  overlayDialKeyNew: {
    width: isTablet ? 80 : screenWidth / 4 - 20, // 80dp on tablets, responsive on phones
    height: isTablet ? 80 : screenWidth / 4 - 20,
    borderRadius: 100, // Make it circular
    backgroundColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8, // Spacing between keys
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  overlayDialKeyTextNew: {
    fontSize: 24, // Bold number
    fontWeight: 'bold',
    color: '#1f2937',
  },
  overlayDialButtonNew: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#28a745', // Green color
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center', // Center the button
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    marginTop: 10,
  },
});

export default App;
