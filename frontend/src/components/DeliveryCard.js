import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, DELIVERY_STATUSES } from '../utils/constants';

const statusColor = {
  pending: COLORS.primary,
  accepted: '#3498DB',
  picked_up: '#9B59B6',
  delivered: COLORS.success,
  cancelled: COLORS.danger,
};

const DeliveryCard = ({ delivery, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
    <View style={styles.row}>
      <Text style={styles.label}>From</Text>
      <Text style={styles.address} numberOfLines={1}>
        {delivery.pickup?.address}
      </Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>To</Text>
      <Text style={styles.address} numberOfLines={1}>
        {delivery.dropoff?.address}
      </Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Package</Text>
      <Text style={styles.value}>{delivery.packageDescription}</Text>
    </View>
    <View style={styles.footer}>
      <Text style={styles.price}>USD {delivery.price?.toFixed(2)}</Text>
      <Text style={[styles.status, { color: statusColor[delivery.status] }]}>
        {DELIVERY_STATUSES[delivery.status] || delivery.status}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  row: { flexDirection: 'row', marginBottom: 4, alignItems: 'center' },
  label: { width: 60, color: COLORS.muted, fontSize: 12 },
  address: { flex: 1, fontSize: 14, fontWeight: '500' },
  value: { flex: 1, fontSize: 14 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  price: { fontSize: 16, fontWeight: '700', color: COLORS.primary },
  status: { fontSize: 13, fontWeight: '600' },
});

export default DeliveryCard;
