import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
type StatCardProps = {
  title: string;
  activityType: 'SMS' | 'Call';
  completed: number;
  total: number;
  color: string;
  onPress: () => void;
};

const StatCard: React.FC<StatCardProps> = ({ title, activityType, completed, total, color, onPress }) => {
  const progress = completed / total;
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity style={[styles.card, { borderColor: color, shadowColor: color }]} onPress={onPress} activeOpacity={0.8}>
      <Text style={[styles.title, { color }]}>{title}</Text>
      <Text style={styles.subtitle}>
        {completed} Completed of {total}
      </Text>
      <View style={styles.progressBarBackground}>
        <Animated.View style={[styles.progressBarFill, { width: widthInterpolated, backgroundColor: color }]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
});

export default StatCard;
