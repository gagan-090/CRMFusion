import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const [callDuration, setCallDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCallTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopCallTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      setCallDuration(0);
    }
  };

  useEffect(() => {
    return () => {
      stopCallTimer();
    };
  }, []);

  const pieData = [
    { name: 'Connected', population: 60, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Missed', population: 25, color: '#B0BEC5', legendFontColor: '#333', legendFontSize: 14 },
    { name: 'Ongoing', population: 15, color: '#90A4AE', legendFontColor: '#333', legendFontSize: 14 },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>CRM Fusion</Text>

      <PieChart
        data={pieData}
        width={screenWidth - 20}
        height={180}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          color: () => '#333',
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="10"
        absolute
        hasLegend={false}
      />
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
          <Text>Connected Calls</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#B0BEC5' }]} />
          <Text>Missed Calls</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#90A4AE' }]} />
          <Text>Ongoing Calls</Text>
        </View>
      </View>

      {/* Call Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Call Details</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Calls Today</Text>
            <Text style={styles.statValue}>23</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Calls Connected</Text>
            <Text style={styles.statValue}>14</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Calls Missed</Text>
            <Text style={styles.statValue}>9</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avg Call Duration</Text>
            <Text style={styles.statValue}>02:17</Text>
          </View>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.card}>
        <View style={styles.userRow}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/women/1.jpg' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.userName}>Lisa Wong</Text>
            <Text style={styles.userRole}>Sales Manager</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Available for Calls</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Ongoing Call */}
      <View style={styles.card}>
        <View style={styles.ongoingRow}>
          <View>
            <Text style={styles.callName}>Sarah Johnson</Text>
            <Text style={styles.callNumber}>123-456-7890</Text>
          </View>
          <Text style={styles.callTimer}>{formatDuration(callDuration)}</Text>
        </View>
      </View>

      {/* Call Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={startCallTimer} style={[styles.controlBtn, { backgroundColor: '#4CAF50' }]}>
          <Icon name="phone" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Mute')} style={styles.controlBtn}>
          <Icon name="mic-off" size={22} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Speaker')} style={styles.controlBtn}>
          <Icon name="volume-2" size={22} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Hold')} style={styles.controlBtn}>
          <Icon name="pause" size={22} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity onPress={stopCallTimer} style={[styles.controlBtn, { backgroundColor: '#E53935' }]}>
          <Icon name="phone-off" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 100,
    backgroundColor: '#F8F9FA',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginTop: 15,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    paddingVertical: 8,
  },
  statLabel: {
    color: '#555',
  },
  statValue: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 12,
  },
  userName: {
    fontWeight: '700',
    fontSize: 16,
  },
  userRole: {
    color: '#607D8B',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#555',
  },
  ongoingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  callName: {
    fontWeight: '600',
    fontSize: 16,
  },
  callNumber: {
    color: '#555',
  },
  callTimer: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 25,
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 16,
    elevation: 4,
  },
  controlBtn: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 50,
  },
});
