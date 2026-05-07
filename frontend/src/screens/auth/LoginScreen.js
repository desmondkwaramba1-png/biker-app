import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../services/firebase';
import Button from '../../components/Button';
import { COLORS } from '../../utils/constants';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('+263');
  const [loading, setLoading] = useState(false);

  const sendOTP = async () => {
    if (phone.length < 10) return Alert.alert('Enter a valid Zimbabwe number');
    setLoading(true);
    try {
      const provider = new PhoneAuthProvider(auth);
      const verificationId = await provider.verifyPhoneNumber(phone, window.recaptchaVerifier);
      navigation.navigate('OTP', { verificationId, phone });
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>MotoDeliver</Text>
        <Text style={styles.tagline}>Fast bike deliveries across Zimbabwe</Text>

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="+263 77 000 0000"
          placeholderTextColor={COLORS.muted}
        />

        <Button title="Send OTP" onPress={sendOTP} loading={loading} />
        <Text style={styles.terms}>
          By continuing you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  inner: { flex: 1, padding: 24, justifyContent: 'center' },
  logo: { fontSize: 32, fontWeight: '900', color: COLORS.primary, marginBottom: 6 },
  tagline: { fontSize: 15, color: COLORS.muted, marginBottom: 40 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  terms: { textAlign: 'center', color: COLORS.muted, fontSize: 12, marginTop: 12 },
});

export default LoginScreen;
