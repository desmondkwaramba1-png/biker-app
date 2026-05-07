import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, RefreshControl,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getMyDeliveries } from '../../services/api';
import DeliveryCard from '../../components/DeliveryCard';
import Button from '../../components/Button';
import { COLORS, DEFAULT_REGION } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [deliveries, setDeliveries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion((r) => ({
          ...r,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        }));
      }
    })();
    load();
  }, []);

  const load = async () => {
    setRefreshing(true);
    try {
      const data = await getMyDeliveries();
      setDeliveries(data.filter((d) => d.status !== 'delivered' && d.status !== 'cancelled'));
    } catch {}
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} showsUserLocation>
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
      </MapView>
      <View style={styles.panel}>
        <Text style={styles.greeting}>Hello, {user?.name || 'there'} 👋</Text>
        <Button
          title="Send a Delivery"
          onPress={() => navigation.navigate('SendDelivery')}
          style={styles.sendBtn}
        />
        {deliveries.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Deliveries</Text>
            <FlatList
              data={deliveries}
              keyExtractor={(d) => d._id}
              renderItem={({ item }) => (
                <DeliveryCard
                  delivery={item}
                  onPress={() => navigation.navigate('TrackDelivery', { deliveryId: item._id })}
                />
              )}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { height: '45%' },
  panel: { flex: 1, backgroundColor: COLORS.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, marginTop: -20 },
  greeting: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  sendBtn: { marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 8, color: COLORS.secondary },
});

export default HomeScreen;
