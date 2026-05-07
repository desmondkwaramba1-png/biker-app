import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, switchRole } from '../../services/api';
import Button from '../../components/Button';
import { COLORS } from '../../utils/constants';

const ProfileScreen = () => {
  const { user, logout, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);

  const save = async () => {
    setLoading(true);
    try {
      await updateProfile({ name, email });
      await refreshUser();
      Alert.alert('Profile updated!');
    } catch {
      Alert.alert('Could not save profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (value) => {
    try {
      await switchRole(value);
      await refreshUser();
    } catch {
      Alert.alert('Could not switch role');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.phone}>{user?.phone}</Text>
      <Text style={styles.label}>Full Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" />
      <Text style={styles.label}>Email</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="your@email.com" keyboardType="email-address" autoCapitalize="none" />
      <View style={styles.roleRow}>
        <View>
          <Text style={styles.roleLabel}>Biker Mode</Text>
          <Text style={styles.roleSubtitle}>Accept delivery requests</Text>
        </View>
        <Switch value={user?.isBiker || false} onValueChange={toggleRole} trackColor={{ true: COLORS.primary }} />
      </View>
      {user?.isBiker && (
        <View style={styles.verBadge}>
          <Text style={styles.verText}>Verification: {user?.verificationStatus?.toUpperCase()}</Text>
        </View>
      )}
      <Button title="Save Changes" onPress={save} loading={loading} style={styles.save} />
      <Button title="Logout" onPress={logout} variant="secondary" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  phone: { color: COLORS.muted, fontSize: 15, marginBottom: 24 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15 },
  roleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#eee', marginTop: 20 },
  roleLabel: { fontSize: 16, fontWeight: '600' },
  roleSubtitle: { color: COLORS.muted, fontSize: 12 },
  verBadge: { backgroundColor: '#FFF9E6', padding: 10, borderRadius: 8, marginBottom: 8 },
  verText: { color: '#856404', fontWeight: '600' },
  save: { marginTop: 20, marginBottom: 8 },
});

export default ProfileScreen;
