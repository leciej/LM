import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSyncExternalStore } from 'react';

import {
  getGallery,
  subscribe as gallerySubscribe,
} from '../features/gallery/store/galleryStore';

import { mockProducts } from '../features/products/mockProducts';

import {
  getActivities,
  subscribe as activitySubscribe,
} from '../features/activity/store/activityStore';

type ActivityLike = {
  type: string;
  date?: string;
};

export function AdminStatsScreen() {
  const gallery = useSyncExternalStore(
    gallerySubscribe,
    getGallery
  );

  const activities = useSyncExternalStore(
    activitySubscribe,
    getActivities
  ) as ActivityLike[];

  const products = mockProducts;

  return (
    <ScrollView style={styles.container}>
      {/* KAFELKI */}
      <View style={styles.grid}>
        <StatCard
          label="Produkty"
          value={products.length}
        />
        <StatCard
          label="Arcydzieła"
          value={gallery.length}
        />
        <StatCard
          label="Aktywności"
          value={activities.length}
        />
      </View>

      {/* OSTATNIE AKCJE */}
      <Text style={styles.subtitle}>
        Ostatnie akcje
      </Text>

      {activities.slice(0, 6).map((a, i) => (
        <View key={i} style={styles.activity}>
          <Text style={styles.activityText}>
            • {a.type}
          </Text>
          <Text style={styles.activityDate}>
            {a.date
              ? new Date(a.date).toLocaleString()
              : ''}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6f8',
  },
  subtitle: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    elevation: 3,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  cardLabel: {
    marginTop: 4,
    fontSize: 13,
    color: '#555',
  },
  activity: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  activityText: {
    fontWeight: '600',
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
