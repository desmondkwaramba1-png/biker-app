import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { io } from 'socket.io-client';
import { getDelivery, updateDeliveryStatus, updateLocation } from '../../services/api';
import Button from '../../components/Button';
import { COLORS, SOCKET_URL } from '../../utils/constants';

const ActiveDeliveryScreen = ({ route, navigation }) => {
  const { deliveryId } = route.params;
  const [delivery, setDelivery] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const socketRef = useRef(null);
  const watchRef = useRef(null);

  useEffect(() => {
    load();
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit('biker:join', { deliveryId });

    Location.requestForegroundPermissionsAsync().then(({ status }) => {
      if (status !== 'granted') return;
      watchRef.current = Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 10 },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          setMyLocation({ latitude, longitude });
          socket.emit('biker:location', { deliveryId, lat: latitude, lng: longitude });
          updateLocation(latitude, longitude).catch(() => {});
        }
      );
    });

    return () => {
      socket.disconnect();
      watchRef.current?.then((sub) => sub.remove());
    };
  }, [deliveryId]);

  const load = async () => {
    try {
      const data = await getDelivery(deliveryId);
      setDelivery(data);
    } catch {}
  };

  const advance = async () => {
    const nextStatus = delivery.status === 'accepted' ? 'picked_up' : 'delivered';
    const label = nextStatus === 'picked_up' ? 'Mark as Picked Up' : 'Mark as Delivered';
    Alert.alert('Confirm', label + '?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await updateDeliveryStatus(deliveryId, nextStatus);
            socketRef.current?.emit('delivery:status', { deliveryId, status: nextStatus });
            if (nextStatus === 'delivered') {
              Alert.alert('Delivery Complete!', 'Great job!', [
                { text: 'OK', onPress: () => navigation.navigate('Requests') },
              ]);
            } else {
              setDelivery((d) => ({ ...d, status: nextStatus }));
            }
          } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed');
          }
        },
      },
    ]);
  };

  if (!delivery) return <View style={styles.center}><Text>Loading...</Text></View>;

  const pickupCoord = { latitude: delivery.pickup.lat, longitude: delivery.pickup.lng };
  const dropCoord = { latitude: delivery.dropoff.lat, longitude: delivery.dropoff.lng };
  const focusCoord = delivery.status === 'accepted' ? pickupCoord : dropCoord;

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{ ...focusCoord, latitudeDelta: 0.04, longitudeDelta: 0.04 }}>
        <Marker coordinate={pickupCoord} title="Pickup" pinColor="green" />
        <Marker coordinate={dropCoord} title="Drop-off" pinColor="red" />
        {myLocation && <Marker coordinate={myLocation} title="You" pinColor={COLORS.primary} />}
        <Polyline coordinates={[pickupCoord, dropCoord]} strokeColor={COLORS.primary} strokeWidth={3} />
      </MapView>
      <View style={styles.panel}>
        <Text style={styles.step}>{delivery.status === 'accepted' ? '📍 Go to pickup location' : '🚀 Deliver to customer'}</Text>
        <View style={styles.row}><Text style={styles.muted}>Pickup</Text><Text style={styles.addr}>{delivery.pickup.address}</Text></View>
        <View style={styles.row}><Text style={styles.muted}>Drop-off</Text><Text style={styles.addr}>{delivery.dropoff.address}</Text></View>
        <View style={styles.row}><Text style={styles.muted}>Package</Text><Text style={styles.addr}>{delivery.packageDescription}</Text></View>
        {delivery.notes ? <View style={styles.noteBox}><Text style={styles.noteText}>📝 {delivery.notes}</Text></View> : null}
        <Text style={styles.price}>USD {delivery.price?.toFixed(2)}</Text>
        {delivery.status !== 'delivered' && (
          <Button title={delivery.status === 'accepted' ? 'Mark as Picked Up' : 'Mark as Delivered'} onPress={advance} style={styles.btn} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  panel: { backgroundColor: COLORS.white, padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  step: { fontSize: 17, fontWeight: '800', color: COLORS.primary, marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 6 },
  muted: { color: COLORS.muted, width: 60, fontSize: 13 },
  addr: { flex: 1, fontSize: 14 },
  noteBox: { backgroundColor: '#FFF9E6', borderRadius: 8, padding: 10, marginVertical: 8 },
  noteText: { fontSize: 13, color: '#856404' },
  price: { fontSize: 22, fontWeight: '900', color: COLORS.primary, marginVertical: 10 },
  btn: { marginTop: 4 },
});

export default ActiveDeliveryScreen;
