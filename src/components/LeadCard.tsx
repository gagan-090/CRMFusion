import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Lead {
  id: string;
  name: string;
  status: string;
  nextAction: string;
}

const LeadCard = ({ lead, onPress }: { lead: Lead; onPress: () => void }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.name}>{lead.name}</Text>
      <Text style={styles.status}>Status: {lead.status}</Text>
      <Text style={styles.action}>Next: {lead.nextAction}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 12,
    padding: 16,
    borderRadius: 10,
    elevation: 3
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  status: { color: '#555', marginTop: 4 },
  action: { color: '#333', marginTop: 2 }
});

export default LeadCard;
