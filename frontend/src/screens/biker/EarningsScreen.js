import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { getMyEarnings } from '../../services/api';
import { COLORS } from '../../utils/constants';

const EarningsScreen = () => {
  const [data, setData] = useState({ earnings: [], total: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    setRefreshing(true);
    try {
      const res = await getMyEarnings();
      setData(res);
    } catch {}
    setRefreshing(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Total Earnings</Text>
        <Text style={styles.total}>USD {data.total.toFixed(2)}</Text>
      </View>
      <FlatList
        data={data.earnings}
        keyExtractor={(e) => e._id}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View>
              <Text style={styles.addr} numberOfLines={1}>
                {item.deliveryId?.pickup?.address} → {item.deliveryId?.dropoff?.address}
              </Text>
              <Text style={styles.date}>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}</Text>
            </View>
            <Text style={styles.amount}>+${item.amount.toFixed(2)}</Text>
          </View>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
        ListEmptyComponent={<Text style={styles.empty}>No earnings yet</Text>}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.light },
  header: { backgroundColor: COLORS.primary, padding: 24, alignItems: 'center' },
  label: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  total: { color: COLORS.white, fontSize: 36, fontWeight: '900', marginTop: 4 },
  list: { padding: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 10, padding: 14, marginBottom: 8 },
  addr: { fontSize: 14, fontWeight: '500', maxWidth: 220 },
  date: { color: COLORS.muted, fontSize: 12, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: '700', color: COLORS.success },
  empty: { textAlign: 'center', color: COLORS.muted, marginTop: 40 },
});

export default EarningsScreen;
