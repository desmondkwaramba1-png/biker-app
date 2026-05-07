import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import { COLORS } from '../../utils/constants';

const OTPScreen = ({ route }) => {
  const { verificationId, phone } = route.params;
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithFirebaseToken } = useAuth();

  const confirmOTP = async () => {
    if (code.length !== 6) return Alert.alert('Enter the 6-digit OTP');
    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const result = await signInWithCredential(auth, credential);
      const idToken = await result.user.getIdToken();
      await loginWithFirebaseToken(idToken);
    } catch (err) {
      Alert.alert('Invalid OTP', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Sent to {phone}</Text>
      <TextInput
        style={styles.input}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="6-digit code"
        placeholderTextColor={COLORS.muted}
      />
      <Button title="Verify" onPress={confirmOTP} loading={loading} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: COLORS.white },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: COLORS.muted, marginBottom: 32 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 22,
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default OTPScreen;
