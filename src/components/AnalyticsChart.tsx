import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

type Tab = 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';

const chartDataSets = {
  Daily: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [30, 45, 28, 80, 99, 43, 50],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // Call Center
      },
      {
        data: [20, 35, 18, 60, 79, 33, 40],
        color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`, // Message
      },
    ],
  },
  Weekly: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [200, 450, 280, 800],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      },
      {
        data: [150, 350, 180, 600],
        color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
      },
    ],
  },
  Monthly: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [800, 1200, 900, 1400, 1300, 1500],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      },
      {
        data: [600, 900, 700, 1100, 1000, 1200],
        color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
      },
    ],
  },
  Yearly: {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [
      {
        data: [5000, 7000, 6500, 8000, 9000],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
      },
      {
        data: [4000, 6000, 5500, 7000, 8000],
        color: (opacity = 1) => `rgba(34, 128, 176, ${opacity})`,
      },
    ],
  },
};

const statsData = {
  Users: '374,8563',
  Clicks: '23.76M',
  Send: '374,85',
  Receive: '374,8563',
};

const AnalyticsChart: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<Tab>('Daily');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      fadeAnim.setValue(0);
    });
  }, [selectedTab]);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <LineChart
        data={chartDataSets[selectedTab]}
        width={screenWidth - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
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
        bezier
        style={styles.chart}
      />
      <Animated.View style={[styles.statsContainer, { opacity: fadeAnim }]}>
        {Object.entries(statsData).map(([key, value]) => (
          <View key={key} style={styles.statItem}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{key}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeTab: {
    backgroundColor: '#6a5acd',
  },
  tabText: {
    color: '#333',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  chart: {
    borderRadius: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
});

export default AnalyticsChart;
