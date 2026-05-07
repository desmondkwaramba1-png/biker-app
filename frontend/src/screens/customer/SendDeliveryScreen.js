import React, { useState } from 'react';
import {
  View, Text, TextInput, StyleSheet, ScrollView, Alert,
} from 'react-native';
import * as Location from 'expo-location';
import { createDelivery } from '../../services/api';
import Button from '../../components/Button';
import { COLORS } from '../../utils/constants';

const Field = ({ label, ...props }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor={COLORS.muted} {...props} />
  </View>
);

const SendDeliveryScreen = ({ navigation }) => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [packageDesc, setPackageDesc] = useState('');
  const [price, setPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const useCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const loc = await Location.getCurrentPositionAsync({});
    const [place] = await Location.reverseGeocodeAsync(loc.coords);
    setPickupAddress(`${place.street}, ${place.city}`);
  };

  const submit = async () => {
    if (!pickupAddress || !dropoffAddress || !packageDesc || !price) {
      return Alert.alert('Please fill all required fields');
    }
    setLoading(true);
    try {
      await createDelivery({
        pickup: { address: pickupAddress, lat: -17.829, lng: 31.052 },
        dropoff: { address: dropoffAddress, lat: -17.84, lng: 31.06 },
        packageDescription: packageDesc,
        price: parseFloat(price),
        notes,
      });
      Alert.alert('Success', 'Delivery request sent! Bikers will respond shortly.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>New Delivery</Text>
      <Field label="Pickup Address *" value={pickupAddress} onChangeText={setPickupAddress} placeholder="Where should the biker pick up?" />
      <Button title="Use My Current Location" variant="secondary" onPress={useCurrentLocation} style={styles.locationBtn} />
      <Field label="Drop-off Address *" value={dropoffAddress} onChangeText={setDropoffAddress} placeholder="Where should it be delivered?" />
      <Field label="Package Description *" value={packageDesc} onChangeText={setPackageDesc} placeholder="e.g. Small parcel, groceries, documents" multiline />
      <Field label="Offer Price (USD) *" value={price} onChangeText={setPrice} placeholder="e.g. 3.00" keyboardType="decimal-pad" />
      <Field label="Notes for Biker" value={notes} onChangeText={setNotes} placeholder="Any special instructions?" multiline />
      <Button title="Send Request" onPress={submit} loading={loading} style={styles.submit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 20, color: COLORS.secondary },
  fieldWrap: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6, color: COLORS.secondary },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15, minHeight: 46 },
  locationBtn: { marginTop: -6, marginBottom: 14 },
  submit: { marginTop: 10 },
});

export default SendDeliveryScreen;
