import { Dimensions, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const { width, height } = Dimensions.get('window');

// Responsive font size based on screen height
export function responsiveFontSize(fontSize: number): number {
  return RFValue(fontSize, height);
}

// Responsive icon size based on screen width
export function responsiveIconSize(baseSize: number): number {
  // Scale icon size proportionally to screen width, with minimum and maximum limits
  const minSize = baseSize * 0.8;
  const maxSize = baseSize * 1.5;
  const scale = width / 375; // 375 is base width (iPhone 6/7/8)
  const size = baseSize * scale;
  return Math.min(Math.max(size, minSize), maxSize);
}

// Check if device is Android TV or other TV platform
export function isTV(): boolean {
  return Platform.isTV || Platform.OS === 'android' && Platform.isTV;
}
