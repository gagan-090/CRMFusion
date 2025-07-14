import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
  Animated,
  Easing,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { PieChart, LineChart } from 'react-native-chart-kit';

// Assuming RootStackParamList and ThemeContext are defined in your project
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types'; // Adjust path if necessary
import { ThemeContext } from '../context/ThemeContext'; // Adjust path if necessary

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DashboardScreen'>;

const screenWidth = Dimensions.get('window').width;

// --- Mock Data ---
const activityCardsData = [
  { id: '1', title: 'SMS Broadcast – Activity', completed: 342, total: 457, color: '#FF69B4', icon: 'chart-bar' }, // Pink
  { id: '2', title: 'Voice Mail – Activity', completed: 342, total: 457, color: '#1E90FF', icon: 'voicemail' }, // Blue
  { id: '3', title: 'Inbound SMS – Activity', completed: 342, total: 457, color: '#FFA500', icon: 'message-text-outline' }, // Orange
  { id: '4', title: 'Call Center – Activity', completed: 342, total: 457, color: '#800080', icon: 'phone-dial' }, // Purple
];

const activeUsersData = {
  percentageChange: '+43% Than Last Week',
  currentMonthCalls: '3748563 Calls',
  currentMonthSMS: '3748563 SMS',
};

const activeUsersStats = [
  { id: '1', label: 'Users', value: '374,8563', icon: 'account-group-outline', iconBg: '#800080', iconColor: '#FFF' },
  { id: '2', label: 'Clicks', value: '23.76 M', icon: 'gesture-tap', iconBg: '#E0E0E0', iconColor: '#800080' },
  { id: '3', label: 'Send', value: '374,85', icon: 'send', iconBg: '#E0E0E0', iconColor: '#800080' },
  { id: '4', label: 'Receive', value: '374,8563', icon: 'message-text-outline', iconBg: '#E0E0E0', iconColor: '#800080' },
];

const activityGraphData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      data: [600, 850, 700, 1300, 1200, 1400], // Call Center
      color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Purple
      strokeWidth: 2,
    },
    {
      data: [700, 950, 800, 1400, 1300, 1500], // Message
      color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, // Pink
      strokeWidth: 2,
    },
  ],
  legend: ['Call center', 'Message'],
};

const expenseStatisticsData = [
  { name: 'Entertainment', population: 215000, color: '#FF00FF', legendFontColor: '#7F7F7F', legendFontSize: 12 }, // Magenta
  { name: 'Bill Expense', population: 280000, color: '#FFA500', legendFontColor: '#7F7F7F', legendFontSize: 12 }, // Orange
  { name: 'Investment', population: 527612, color: '#00BFFF', legendFontColor: '#7F7F7F', legendFontSize: 12 }, // Cyan
  { name: 'Others', population: 853800, color: '#8A2BE2', legendFontColor: '#7F7F7F', legendFontSize: 12 }, // Purple
];

const recentExpenseTransactions = [
  { id: '1', label: 'Taxes', date: '2 days ago', amount: '$1,200', icon: 'file-document-outline' },
  { id: '2', label: 'Mobile Bills', date: '5 days ago', amount: '$80', icon: 'cellphone' },
];

const recentCallsData = [
  { id: '1', agent: 'Agent Name', number: '+1 234 567 890', direction: 'Outbound', date: '2023-06-01', avatar: 'https://placehold.co/40x40/FF69B4/FFFFFF?text=A' },
  { id: '2', agent: 'Agent Name', number: '+1 987 654 321', direction: 'Inbound', date: '2023-06-02', avatar: 'https://placehold.co/40x40/1E90FF/FFFFFF?text=B' },
  { id: '3', agent: 'Agent Name', number: '+1 555 666 777', direction: 'Outbound', date: '2023-06-03', avatar: 'https://placehold.co/40x40/FFA500/FFFFFF?text=C' },
];

const usageHistoryData = [
  { id: '1', label: 'SMS Option Count', value: '3465' },
  { id: '2', label: 'Call Center Count', value: '3465' },
  { id: '3', label: 'Inbound Call Count', value: '3465' },
];

const reasonForCallData = [
  { id: '1', reason: 'Product/Service Problems', percentage: 87, color: '#FF69B4' },
  { id: '2', reason: 'Technical Issues', percentage: 67, color: '#FFA500' },
  { id: '3', reason: 'Payment Issues', percentage: 45, color: '#1E90FF' },
  { id: '4', reason: 'New Customer', percentage: 30, color: '#800080' },
];

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useContext(ThemeContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Animated value for the line chart data update progress
  const chartAnimationProgress = useState(new Animated.Value(0))[0];
  const [displayChartData, setDisplayChartData] = useState(activityGraphData.datasets.map(d => ({ ...d, data: d.data.map(() => 0) })));

  // Animated value for sidebar translation
  const sidebarAnim = useState(new Animated.Value(-250))[0]; // Start off-screen to the left (sidebar width is 250)

  useEffect(() => {
    // Animate chart data on component mount or data change
    Animated.timing(chartAnimationProgress, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Listener to update displayChartData based on animation progress
    const listener = chartAnimationProgress.addListener(({ value }) => {
      const newDisplayData = activityGraphData.datasets.map(dataset => ({
        ...dataset,
        data: dataset.data.map(originalValue => originalValue * value),
      }));
      setDisplayChartData(newDisplayData);
    });

    return () => {
      chartAnimationProgress.removeListener(listener);
    };
  }, [chartAnimationProgress]);

  // Effect for sidebar animation
  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: isSidebarOpen ? 0 : -250, // 0 for open, -250 for closed
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true, // Use native driver for transform animations
    }).start();
  }, [isSidebarOpen]); // Re-run animation when isSidebarOpen changes

  const handleCardPress = (id: string) => {
    const card = activityCardsData.find((c) => c.id === id);
    if (!card) return;

    // Example navigation based on activity type
    if (id === '1') {
      navigation.navigate('ActivityDetailScreen', { activityId: card.id, activityTitle: card.title });
    } else if (id === '2') {
      navigation.navigate('VoiceMailActivityScreen');
    } else {
      navigation.navigate('LeadDetailScreen', { id });
    }
  };

  const handleCallPress = (id: string) => {
    navigation.navigate('LeadDetailScreen', { id });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <View style={[styles.fullContainer, { backgroundColor: theme.colors.background }]}>
      {/* Main Content (ScrollView) */}
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.hamburgerButton}>
            <MaterialCommunityIcons name="menu" size={28} color={theme.colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.text }]}>Good Morning, Team</Text>
            <Text style={[styles.subtext, { color: theme.colors.text }]}>Track team progress here. You almost reach a goal.</Text>
          </View>
          <View style={styles.icons}>
            <View style={styles.searchBar}>
              <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.text} style={styles.searchIcon} />
              <TextInput
                placeholder="Search for something"
                placeholderTextColor={theme.colors.textSecondary}
                style={[styles.searchInput, { color: theme.colors.text }]}
              />
            </View>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notifications')}>
              <MaterialCommunityIcons name="bell-outline" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('ProfileScreen')}>
              <MaterialCommunityIcons name="account-circle-outline" size={28} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Activity Cards Row */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activityCardsContainer}>
          {activityCardsData.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.activityCard, { backgroundColor: card.color }]}
              onPress={() => handleCardPress(card.id)}
            >
              <MaterialCommunityIcons name={card.icon as any} size={28} color="#FFF" style={styles.activityCardIcon} />
              <Text style={styles.activityCardTitle}>{card.title}</Text>
              <View style={styles.activityCardProgressBarBg}>
                <View style={[styles.activityCardProgressBarFill, { width: `${(card.completed / card.total) * 100}%` }]} />
              </View>
              <Text style={styles.activityCardCount}>{card.completed} Completed of {card.total}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Main Content Grid */}
        <View style={styles.mainContentGrid}>
          {/* Active Users Section */}
          <View style={[styles.card, styles.activeUsersSection, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Active Users</Text>
            <Text style={styles.activeUsersGrowth}>{activeUsersData.percentageChange}</Text>
            <Text style={[styles.activeUsersCallSMS, { color: theme.colors.text }]}>{activeUsersData.currentMonthCalls}</Text>
            <Text style={[styles.activeUsersCallSMS, { color: theme.colors.text }]}>{activeUsersData.currentMonthSMS}</Text>

            <View style={styles.activeUsersStatsGrid}>
              {activeUsersStats.map(stat => (
                <View key={stat.id} style={styles.activeUserStatItem}>
                  <View style={[styles.activeUserStatIconBg, { backgroundColor: stat.iconBg }]}>
                    <MaterialCommunityIcons name={stat.icon as any} size={20} color={stat.iconColor} />
                  </View>
                  <Text style={[styles.activeUserStatLabel, { color: theme.colors.textSecondary }]}>{stat.label}</Text>
                  <Text style={[styles.activeUserStatValue, { color: theme.colors.text }]}>{stat.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Activity Graph Section */}
          <View style={[styles.card, styles.activityGraphSection, { backgroundColor: '#333' }]}>
            <View style={styles.chartControls}>
              {['Daily', 'Weekly', 'Monthly', 'Yearly'].map(period => (
                <TouchableOpacity key={period} style={styles.chartPeriodButton}>
                  <Text style={styles.chartPeriodButtonText}>{period}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <LineChart
              data={{
                labels: activityGraphData.labels,
                datasets: displayChartData,
                legend: activityGraphData.legend,
              }}
              width={screenWidth * 0.9 - 40} // Adjusted for padding
              height={220}
              chartConfig={{
                backgroundColor: '#333',
                backgroundGradientFrom: '#333',
                backgroundGradientTo: '#333',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Text color
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#FFF', // White stroke for dots
                },
                propsForBackgroundLines: {
                  strokeDasharray: '', // Solid grid lines
                  stroke: 'rgba(255, 255, 255, 0.1)', // Lighter grid lines
                },
              }}
              bezier
              style={styles.chartStyle}
            />
             <View style={styles.chartLegendBottom}>
              {activityGraphData.datasets.map((dataset, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColorBox, { backgroundColor: dataset.color() }]} />
                  <Text style={styles.legendTextChart}>{activityGraphData.legend[index]}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Expense Statistics Section */}
          <View style={[styles.card, styles.expenseStatisticsSection, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Expense Statistics</Text>
            <View style={styles.expenseContent}>
              <PieChart
                data={expenseStatisticsData}
                width={screenWidth * 0.35}
                height={150}
                chartConfig={{
                  backgroundColor: theme.colors.cardBackground,
                  backgroundGradientFrom: theme.colors.cardBackground,
                  backgroundGradientTo: theme.colors.cardBackground,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                absolute
                hasLegend={false} // Hide default legend
              />
              <View style={styles.expenseLegend}>
                {expenseStatisticsData.map((item, index) => (
                  <View key={index} style={styles.legendItem}>
                    <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
                    <Text style={[styles.legendText, { color: theme.colors.textSecondary }]}>{item.name}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={[styles.recentText, { color: theme.colors.text }]}>Recent</Text>
            {recentExpenseTransactions.map(transaction => (
              <View key={transaction.id} style={styles.recentTransactionRow}>
                <MaterialCommunityIcons name={transaction.icon as any} size={20} color={theme.colors.textSecondary} style={{ marginRight: 10 }} />
                <Text style={[styles.recentTransactionLabel, { color: theme.colors.text }]}>{transaction.label}</Text>
                <Text style={[styles.recentTransactionDate, { color: theme.colors.textSecondary }]}>{transaction.date}</Text>
                <Text style={[styles.recentTransactionAmount, { color: theme.colors.text }]}>{transaction.amount}</Text>
              </View>
            ))}
          </View>

          {/* Recent Calls Section */}
          <View style={[styles.card, styles.recentCallsSection, { backgroundColor: theme.colors.cardBackground }]}>
            <View style={styles.recentCallsHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Calls</Text>
              <View style={styles.recentCallsSearch}>
                <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.text} />
                <TextInput
                  placeholder="Search here..."
                  placeholderTextColor={theme.colors.textSecondary}
                  style={[styles.searchInputSmall, { color: theme.colors.text }]}
                />
              </View>
            </View>
            <View style={styles.recentCallsTableHeaders}>
              <Text style={[styles.tableHeader, { color: theme.colors.textSecondary }]}>Agent</Text>
              <Text style={[styles.tableHeader, { color: theme.colors.textSecondary }]}>Number</Text>
              <Text style={[styles.tableHeader, { color: theme.colors.textSecondary }]}>Direction</Text>
              <Text style={[styles.tableHeader, { color: theme.colors.textSecondary }]}>Date</Text>
            </View>
            <FlatList
              data={recentCallsData}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.recentCallRowItem}>
                  <View style={styles.agentInfo}>
                    <View style={styles.agentAvatarPlaceholder}>
                       <Text style={styles.agentAvatarText}>{item.agent.charAt(0)}</Text>
                    </View>
                    <Text style={[styles.agentName, { color: theme.colors.text }]}>{item.agent}</Text>
                  </View>
                  <Text style={[styles.callNumber, { color: theme.colors.text }]}>{item.number}</Text>
                  <View style={[styles.directionBadge, { backgroundColor: item.direction === 'Inbound' ? '#E0FFF0' : '#F0E0FF' }]}>
                    <Text style={[styles.directionText, { color: item.direction === 'Inbound' ? '#2ECC71' : '#800080' }]}>{item.direction}</Text>
                  </View>
                  <Text style={[styles.callDate, { color: theme.colors.textSecondary }]}>{item.date}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          </View>

          {/* Usage History Section */}
          <View style={[styles.card, styles.usageHistorySection, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Usage History</Text>
            <View style={styles.usageHistoryControls}>
              <TouchableOpacity style={styles.usageHistoryButton}>
                <Text style={styles.usageHistoryButtonText}>On track</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.usageHistoryButton}>
                <Text style={styles.usageHistoryButtonText}>Month</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.usageHistoryButton}>
                <Text style={styles.usageHistoryButtonText}>Date</Text>
              </TouchableOpacity>
            </View>
            {usageHistoryData.map(item => (
              <View key={item.id} style={styles.usageHistoryRow}>
                <Text style={[styles.usageHistoryLabel, { color: theme.colors.text }]}>{item.label}</Text>
                <Text style={styles.usageHistoryValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Reason for Call Section */}
          <View style={[styles.card, styles.reasonForCallSection, { backgroundColor: theme.colors.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Reason for Call</Text>
            {reasonForCallData.map(item => (
              <View key={item.id} style={styles.reasonRow}>
                <Text style={[styles.reasonLabel, { color: theme.colors.text }]}>{item.reason}</Text>
                <View style={styles.reasonProgressBarContainer}>
                  <View style={[styles.reasonProgressBar, { width: `${item.percentage}%`, backgroundColor: item.color }]} />
                </View>
                <Text style={[styles.reasonPercentage, { color: theme.colors.textSecondary }]}>{item.percentage}%</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Overlay for closing sidebar */}
      {isSidebarOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1} // Ensures it captures touch immediately
          onPress={toggleSidebar} // Close sidebar when tapping outside
        />
      )}

      {/* Sidebar (Animated) */}
      <Animated.View style={[
        styles.sidebarAnimated,
        { backgroundColor: theme.colors.cardBackground || '#FFFFFF' }, // Fallback color in case theme.colors.cardBackground is not defined
        { transform: [{ translateX: sidebarAnim }] }
      ]}>
        {/* Sidebar content moved here */}
        <View style={styles.sidebarContent}>
          <View style={styles.sidebarHeader}>
            <MaterialCommunityIcons name="phone-dial" size={28} color="#800080" />
            <Text style={styles.sidebarTitle}>Call Dash</Text>
          </View>
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { navigation.navigate('DashboardScreen'); toggleSidebar(); }}>
              <MaterialCommunityIcons name="view-dashboard-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.sidebarItemText, { color: theme.colors.text }]}>Dashboard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { /* Live Calls */ toggleSidebar(); }}>
              <MaterialCommunityIcons name="phone-in-talk-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.sidebarItemText, { color: theme.colors.text }]}>Live Calls</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { /* CDR Reports */ toggleSidebar(); }}>
              <MaterialCommunityIcons name="file-chart-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.sidebarItemText, { color: theme.colors.text }]}>CDR Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { /* Numbers */ toggleSidebar(); }}>
              <MaterialCommunityIcons name="numeric" size={20} color={theme.colors.text} />
              <Text style={[styles.sidebarItemText, { color: theme.colors.text }]}>Numbers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { /* Campaigns */ toggleSidebar(); }}>
              <MaterialCommunityIcons name="bullhorn-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.sidebarItemText, { color: theme.colors.text }]}>Campaigns</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { /* Add Users */ toggleSidebar(); }}>
              <MaterialCommunityIcons name="account-plus-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.sidebarItemText, { color: theme.colors.text }]}>Add Users</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { /* Server IP */ toggleSidebar(); }}>
              <MaterialCommunityIcons name="server" size={20} color={theme.colors.text} />
              <Text style={[styles.sidebarItemText, { color: theme.colors.text }]}>Server IP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { /* Messaging */ toggleSidebar(); }}>
              <MaterialCommunityIcons name="message-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.sidebarItemText, { color: theme.colors.text }]}>Messaging</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { navigation.navigate('ProfileScreen'); toggleSidebar(); }}>
              <MaterialCommunityIcons name="account-outline" size={20} color={theme.colors.text} />
              <Text style={[styles.sidebarItemText, { color: theme.colors.text }]}>Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sidebarItem} onPress={() => { /* Logout */ toggleSidebar(); }}>
              <MaterialCommunityIcons name="logout" size={20} color={theme.colors.text} />
              <Text style={[styles.sidebarItemText, { color: theme.colors.text }]}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.sidebarFooter}>
            <View style={styles.keepSafeBox}>
              <MaterialCommunityIcons name="shield-lock-outline" size={24} color="#FFF" />
              <Text style={styles.keepSafeText}>Keep you safe!</Text>
              <Text style={styles.keepSafeSubText}>Update your privacy</Text>
              <TouchableOpacity style={styles.updatePrivacyButton}>
                <Text style={styles.updatePrivacyButtonText}>Update Privacy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomNavBar, { backgroundColor: theme.colors.cardBackground }]}>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('DashboardScreen')}>
          <MaterialCommunityIcons name="view-dashboard-outline" size={24} color="#2ECC71" />
          <Text style={styles.navItemTextActive}>Dash</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => { /* Dialer Screen */ }}>
          <MaterialCommunityIcons name="dialpad" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navItemText, { color: theme.colors.textSecondary }]}>Dialer</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('Settings')}>
          <MaterialCommunityIcons name="cog-outline" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navItemText, { color: theme.colors.textSecondary }]}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate('ProfileScreen')}>
          <MaterialCommunityIcons name="account-outline" size={24} color={theme.colors.textSecondary} />
          <Text style={[styles.navItemText, { color: theme.colors.textSecondary }]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  // --- Sidebar Styles ---
  sidebarAnimated: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0, // Starts at the left edge
    width: 250,
    zIndex: 100, // Ensures it's on top
    // Background color is set dynamically via props
    // Added overflow to prevent content from spilling out during animation
    overflow: 'hidden',
  },
  sidebarContent: { // This holds the actual content and padding of the sidebar
    flex: 1, // Ensures content fills the Animated.View
    padding: 16,
    borderRightWidth: 1, // Keep the border on the content
    borderColor: '#e0e0e0',
    justifyContent: 'space-between',
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    marginLeft: 10,
  },
  sidebarTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#800080',
    marginLeft: 10,
  },
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  sidebarItemText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  sidebarFooter: {
    paddingVertical: 20,
  },
  keepSafeBox: {
    backgroundColor: '#800080',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  keepSafeText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  keepSafeSubText: {
    color: '#EEE',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 15,
    textAlign: 'center',
  },
  updatePrivacyButton: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  updatePrivacyButtonText: {
    color: '#800080',
    fontWeight: 'bold',
  },
  // --- Overlay Style ---
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent black
    zIndex: 99, // Below sidebar, above main content
  },
  // --- Main Container & Content ---
  container: {
    flex: 1,
    backgroundColor: '#F7F9FB', // Light background
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Space for bottom nav bar
  },
  // --- Header Styles ---
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 0, // Reset padding here, handled by contentContainer
    paddingTop: 10, // Adjust for status bar if needed
  },
  hamburgerButton: {
    marginRight: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold', // Example font, ensure it's loaded
    color: '#333',
  },
  subtext: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular', // Example font
    color: '#666',
    marginTop: 4,
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 15,
    width: screenWidth * 0.3, // Responsive width for search bar
    maxWidth: 250, // Max width for larger screens
    height: 40,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#333',
    paddingVertical: 0, // Remove default vertical padding
  },
  iconButton: {
    marginLeft: 16,
  },
  // --- Activity Cards Row Styles ---
  activityCardsContainer: {
    marginBottom: 20,
  },
  activityCard: {
    width: screenWidth * 0.45, // Two cards per row on smaller screens, adjust for padding
    minWidth: 180, // Minimum width to prevent shrinking too much
    height: 150,
    borderRadius: 16,
    padding: 15,
    marginRight: 15,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05, // Soft shadow
    shadowRadius: 12,
    elevation: 5, // Android shadow
  },
  activityCardIcon: {
    marginBottom: 5,
  },
  activityCardTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  activityCardProgressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 5,
  },
  activityCardProgressBarFill: {
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  activityCardCount: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  // --- Main Content Grid Styles ---
  mainContentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16, // Consistent margin between cards
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Reduced shadow offset
    shadowOpacity: 0.1, // Slightly more visible shadow
    shadowRadius: 4, // Reduced radius
    elevation: 2, // Reduced elevation for Android
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  // --- Active Users Section Styles ---
  activeUsersSection: {
    width: '100%', // Full width on small screens
    // On larger screens, this could be 65% and expense card 32%
    // For simplicity and responsiveness, keeping 100% for now
  },
  activeUsersGrowth: {
    color: '#2ECC71',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
    marginBottom: 5,
  },
  activeUsersCallSMS: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
    marginBottom: 2,
  },
  activeUsersStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom: 20,
  },
  activeUserStatItem: {
    width: '48%', // Two items per row
    alignItems: 'center',
    marginBottom: 15,
  },
  activeUserStatIconBg: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeUserStatLabel: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#666',
  },
  activeUserStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginTop: 2,
  },
  // --- Activity Graph Section Styles ---
  activityGraphSection: {
    backgroundColor: '#333', // Dark background as per image
    width: '100%',
    paddingVertical: 10, // Adjust padding for chart
  },
  chartControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  chartPeriodButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  chartPeriodButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    alignSelf: 'center',
  },
  chartLegendBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    paddingRight: 10,
  },
  legendTextChart: {
    fontSize: 12,
    color: '#FFF',
    fontFamily: 'Roboto-Regular',
  },
  // --- Expense Statistics Section Styles ---
  expenseStatisticsSection: {
    width: '100%',
  },
  expenseContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  expenseLegend: {
    marginLeft: 20,
    flex: 1, // Take remaining space
  },
  recentText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
    marginBottom: 10,
  },
  recentTransactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F0F0F0',
  },
  recentTransactionLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
    flex: 1,
  },
  recentTransactionDate: {
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
    color: '#999',
    marginRight: 10,
  },
  recentTransactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  // --- Recent Calls Section Styles ---
  recentCallsSection: {
    width: '100%',
  },
  recentCallsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  recentCallsSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 10,
    width: screenWidth * 0.4, // Responsive width
    maxWidth: 200,
    height: 35,
  },
  searchInputSmall: {
    flex: 1,
    height: '100%',
    color: '#333',
    paddingVertical: 0,
  },
  recentCallsTableHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    marginBottom: 10,
  },
  tableHeader: {
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
  },
  recentCallRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1.2, // Give more space for agent name
  },
  agentAvatarPlaceholder: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D3D3D3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  agentAvatarText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  agentName: {
    fontSize: 14,
    fontFamily: 'Roboto-Medium',
  },
  callNumber: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  directionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    flex: 0.8, // Adjust flex to fit content
    alignItems: 'center',
  },
  directionText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  callDate: {
    flex: 1.2,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  // --- Usage History Section Styles ---
  usageHistorySection: {
    width: '48%', // Two columns
    marginRight: '4%', // Space between two columns
  },
  usageHistoryControls: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  usageHistoryButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
  },
  usageHistoryButtonText: {
    color: '#333',
    fontSize: 12,
    fontFamily: 'Roboto-Regular',
  },
  usageHistoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F5F5',
    paddingBottom: 5,
  },
  usageHistoryLabel: {
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  usageHistoryValue: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
    color: '#333',
  },
  // --- Reason for Call Section Styles ---
  reasonForCallSection: {
    width: '48%', // Two columns
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  reasonLabel: {
    flex: 2,
    fontSize: 14,
    fontFamily: 'Roboto-Regular',
  },
  reasonProgressBarContainer: {
    flex: 3,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  reasonProgressBar: {
    height: '100%',
    borderRadius: 4,
  },
  reasonPercentage: {
    flex: 0.5,
    fontSize: 12,
    textAlign: 'right',
    fontFamily: 'Roboto-Regular',
  },
  // --- Bottom Navigation Bar Styles ---
  bottomNavBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 8, // Android shadow
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  navItemText: {
    fontSize: 10,
    marginTop: 4,
    fontFamily: 'Roboto-Regular',
  },
  navItemTextActive: {
    fontSize: 10,
    marginTop: 4,
    color: '#2ECC71', // Green highlight for active tab
    fontWeight: 'bold',
    fontFamily: 'Roboto-Bold',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColorBox: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#7F7F7F',
  },
});
