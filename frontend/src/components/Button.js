import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../utils/constants';

const Button = ({ title, onPress, loading, variant = 'primary', style }) => {
  const bg = variant === 'primary' ? COLORS.primary : COLORS.secondary;
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bg }, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.white} />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 6,
  },
  text: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Button;
