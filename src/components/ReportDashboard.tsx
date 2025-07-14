import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReportDashboard: React.FC = () => {
  return (
    <View>
      <Text style={styles.title}>Report</Text>
      {/* Your dropdowns, filter buttons, and table should go here */}
      <Text style={styles.info}>20 rows of SMS report data appear here...</Text>
    </View>
  );
};

export default ReportDashboard;

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
});
