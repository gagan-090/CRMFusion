import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import LeadCard from '../components/LeadCard';

const leads = [
  { id: '1', name: 'Emma Johnson', status: 'Interested', nextAction: 'Follow-up Call' },
  { id: '2', name: 'Michael Brown', status: 'New Lead', nextAction: 'Send Email' },
  { id: '3', name: 'Jessica Williams', status: 'Contacted', nextAction: 'Schedule Meeting' }
];

const LeadListScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={leads}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LeadCard lead={item} onPress={() => navigation.navigate('LeadDetail', { lead: item })} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 }
});

export default LeadListScreen;
