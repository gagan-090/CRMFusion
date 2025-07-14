import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

type RecentCallRowProps = {
  number: string;
  direction: 'Inbound' | 'Outbound';
  date: string;
  onPress: () => void;
};

const RecentCallRow: React.FC<RecentCallRowProps> = ({ number, direction, date, onPress }) => {
  const badgeColor = direction === 'Inbound' ? '#4CAF50' : '#F44336';

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name="person-circle-outline" size={40} color="#666" />
      <View style={styles.info}>
        <Text style={styles.number}>{number}</Text>
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{direction}</Text>
        </View>
      </View>
      <Text style={styles.date}>{date}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  number: {
    fontSize: 16,
    fontWeight: '600',
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  date: {
    fontSize: 14,
    color: '#999',
  },
});

export default RecentCallRow;
