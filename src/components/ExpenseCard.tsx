import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import Ionicons from 'react-native-vector-icons/Ionicons';

const screenWidth = Dimensions.get('window').width;

const pieData = [
  {
    name: 'Entertainment',
    population: 215000,
    color: '#4A90E2',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Bill Expense',
    population: 280000,
    color: '#FF69B4',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Investment',
    population: 527612,
    color: '#FFA500',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
  {
    name: 'Others',
    population: 853800,
    color: '#003366',
    legendFontColor: '#7F7F7F',
    legendFontSize: 12,
  },
];

const recentTransactions = [
  { id: '1', title: 'Taxes', time: '2 days ago', value: '$1,200', icon: 'cash' },
  { id: '2', title: 'Mobile Bills', time: '5 days ago', value: '$80', icon: 'phone-portrait' },
];

const ExpenseCard: React.FC = () => {
  const renderTransaction = ({ item }: { item: typeof recentTransactions[0] }) => (
    <View style={styles.transactionRow}>
      <Ionicons name={item.icon} size={24} color="#666" />
      <View style={styles.transactionInfo}>
        <Text style={styles.transactionTitle}>{item.title}</Text>
        <Text style={styles.transactionTime}>{item.time}</Text>
      </View>
      <Text style={styles.transactionValue}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Statistics</Text>
      <PieChart
        data={pieData}
        width={screenWidth - 32}
        height={150}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
      <FlatList
        data={recentTransactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        style={styles.transactionList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  transactionList: {
    marginTop: 12,
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  transactionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionTime: {
    fontSize: 12,
    color: '#999',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});

export default ExpenseCard;
