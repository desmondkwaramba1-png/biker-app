import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { getMyDeliveries } from '../../services/api';
import DeliveryCard from '../../components/DeliveryCard';
import { COLORS } from '../../utils/constants';

const DeliveryHistoryScreen = ({ navigation }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const data = await getMyDeliveries();
      setDeliveries(data);
    } catch {}
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery History</Text>
      <FlatList
        data={deliveries}
        keyExtractor={(d) => d._id}
        renderItem={({ item }) => (
          <DeliveryCard delivery={item} onPress={() => navigation.navigate('TrackDelivery', { deliveryId: item._id })} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        ListEmptyComponent={<Text style={styles.empty}>No deliveries yet</Text>}
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
});

export default DeliveryHistoryScreen;
