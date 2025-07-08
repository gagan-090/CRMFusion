import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const DialerScreen = () => {
  const [number, setNumber] = useState('');

  const handlePress = (value: string) => {
    setNumber(prev => prev + value);
  };

  const handleBackspace = () => {
    setNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (number.length > 0) {
      alert(`Calling ${number}`);
    } else {
      alert('Please enter a number first.');
    }
  };

  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  const renderButton = (label: string) => (
    <TouchableOpacity
      key={label}
      style={styles.dialButton}
      onPress={() => handlePress(label)}
    >
      <Text style={styles.dialButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Top Contact Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.contactButton}>
          <Icon name="people-outline" size={20} color="#2ecc71" />
          <Text style={styles.contactText}>Contacts</Text>
        </TouchableOpacity>
      </View>

      {/* Number Input Row */}
      <View style={styles.numberRow}>
        <TextInput
          style={styles.numberText}
          value={number}
          editable={false}
          placeholder="Enter Number"
          placeholderTextColor="#aaa"
        />
        {number.length > 0 && (
          <TouchableOpacity onPress={handleBackspace} style={styles.backspaceBtn}>
            <Icon name="backspace-outline" size={24} color="#2ecc71" />
          </TouchableOpacity>
        )}
      </View>

      {/* Dial Pad */}
      <View style={styles.keypad}>
        {keypad.map(renderButton)}
      </View>

      {/* Call Button */}
      <TouchableOpacity style={styles.callButton} onPress={handleCall}>
        <Icon name="call" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default DialerScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingBottom: 100, // lifts UI above tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#2ecc71',
    fontWeight: '600',
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
    color: '#000',
  },
  backspaceBtn: {
    paddingLeft: 12,
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  dialButton: {
    width: 70,
    height: 70,
    margin: 10,
    borderRadius: 35,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  dialButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2ecc71',
  },
  callButton: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#2ecc71',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});
