import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { getPendingDeliveries, acceptDelivery } from '../../services/api';
import DeliveryCard from '../../components/DeliveryCard';
import Button from '../../components/Button';
import { COLORS } from '../../utils/constants';

const DeliveryRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const data = await getPendingDeliveries();
      setRequests(data);
    } catch {}
    setRefreshing(false);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const accept = async (id) => {
    try {
      await acceptDelivery(id);
      Alert.alert('Accepted!', 'Head to the pickup location.', [
        { text: 'OK', onPress: () => navigation.navigate('ActiveDelivery', { deliveryId: id }) },
      ]);
    } catch (err) {
      Alert.alert('Error', err.response?.data?.message || 'Could not accept');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Deliveries</Text>
      <FlatList
        data={requests}
        keyExtractor={(d) => d._id}
        renderItem={({ item }) => (
          <View>
            <DeliveryCard delivery={item} onPress={() => {}} />
            <Button title="Accept Delivery" onPress={() => accept(item._id)} style={styles.acceptBtn} />
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        ListEmptyComponent={<Text style={styles.empty}>No delivery requests right now</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  title: { fontSize: 22, fontWeight: '800', padding: 16, backgroundColor: COLORS.white },
  list: { padding: 12 },
  empty: { textAlign: 'center', color: COLORS.muted, marginTop: 40 },
  acceptBtn: { marginHorizontal: 0, marginTop: -4, borderTopLeftRadius: 0, borderTopRightRadius: 0 },
});

export default DeliveryRequestsScreen;
