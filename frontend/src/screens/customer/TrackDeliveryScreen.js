import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { io } from 'socket.io-client';
import { getDelivery, rateDelivery } from '../../services/api';
import Button from '../../components/Button';
import { COLORS, DELIVERY_STATUSES, SOCKET_URL } from '../../utils/constants';

const TrackDeliveryScreen = ({ route }) => {
  const { deliveryId } = route.params;
  const [delivery, setDelivery] = useState(null);
  const [bikerLocation, setBikerLocation] = useState(null);
  const [rated, setRated] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    load();
    const socket = io(SOCKET_URL);
    socketRef.current = socket;
    socket.emit('customer:watch', { deliveryId });
    socket.on('biker:location', ({ lat, lng }) => setBikerLocation({ latitude: lat, longitude: lng }));
    socket.on('delivery:status', ({ status }) => setDelivery((d) => d ? { ...d, status } : d));
    return () => socket.disconnect();
  }, [deliveryId]);

  const load = async () => {
    try {
      const data = await getDelivery(deliveryId);
      setDelivery(data);
    } catch {}
  };

  const handleRate = (stars) => {
    rateDelivery(deliveryId, stars)
      .then(() => { setRated(true); Alert.alert('Thanks for your rating!'); })
      .catch(() => Alert.alert('Could not save rating'));
  };

  if (!delivery) return <View style={styles.center}><Text>Loading...</Text></View>;

  const pickupCoord = { latitude: delivery.pickup.lat, longitude: delivery.pickup.lng };
  const dropCoord = { latitude: delivery.dropoff.lat, longitude: delivery.dropoff.lng };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{ ...pickupCoord, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
        <Marker coordinate={pickupCoord} title="Pickup" pinColor="green" />
        <Marker coordinate={dropCoord} title="Drop-off" pinColor="red" />
        {bikerLocation && <Marker coordinate={bikerLocation} title="Biker" pinColor={COLORS.primary} />}
        <Polyline coordinates={[pickupCoord, dropCoord]} strokeColor={COLORS.primary} strokeWidth={3} />
      </MapView>
      <View style={styles.panel}>
        <Text style={styles.status}>{DELIVERY_STATUSES[delivery.status]}</Text>
        <View style={styles.row}><Text style={styles.muted}>From</Text><Text style={styles.addr}>{delivery.pickup.address}</Text></View>
        <View style={styles.row}><Text style={styles.muted}>To</Text><Text style={styles.addr}>{delivery.dropoff.address}</Text></View>
        {delivery.bikerId && (
          <View style={styles.bikerInfo}>
            <Text style={styles.bikerName}>🏍️ {delivery.bikerId.name || 'Your Biker'}</Text>
            <Text style={styles.muted}>{delivery.bikerId.phone}</Text>
          </View>
        )}
        <Text style={styles.price}>USD {delivery.price?.toFixed(2)}</Text>
        {delivery.status === 'delivered' && !rated && (
          <View style={styles.ratingRow}>
            <Text style={styles.rateLabel}>Rate this delivery:</Text>
            {[1, 2, 3, 4, 5].map((s) => (
              <Button key={s} title={`${s}★`} onPress={() => handleRate(s)} style={styles.starBtn} />
            ))}
          </View>
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
  status: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginBottom: 12 },
  row: { flexDirection: 'row', marginBottom: 6 },
  muted: { color: COLORS.muted, width: 50, fontSize: 13 },
  addr: { flex: 1, fontSize: 14 },
  bikerInfo: { backgroundColor: COLORS.light, borderRadius: 10, padding: 10, marginVertical: 10 },
  bikerName: { fontWeight: '700', fontSize: 15 },
  price: { fontSize: 20, fontWeight: '900', color: COLORS.primary, marginTop: 8 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 12 },
  rateLabel: { fontSize: 14, fontWeight: '600', marginRight: 8 },
  starBtn: { paddingHorizontal: 10, paddingVertical: 8, marginHorizontal: 2 },
});

export default TrackDeliveryScreen;
