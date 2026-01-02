// screens/AdminStatsScreen.tsx
import React, { useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { observer } from 'mobx-react-lite';

import { galleryStore } from '../features/gallery/store/galleryStore';

import { useProducts } from '../features/products/useProducts';

import {
  subscribe as subscribePurchases,
  getPurchasedCount,
  getTotalSpent,
} from '../features/purchases/store/purchasesStore';

import {
  subscribe as subscribeRatings,
  getRatedCountTotal,
  getAverageRatingTotal,
} from '../features/ratings/store/ratingsStore';

import {
  subscribe as subscribeComments,
  getCommentsCountTotal,
} from '../features/comments/commentsStore';

import {
  subscribe as activitySubscribe,
  getActivities,
} from '../features/activity/store/activityStore';

import { useSyncExternalStore } from 'react';
import { LineChart } from '../components/LineChart';

/* =========================
   SCREEN
   ========================= */

export const AdminStatsScreen = observer(() => {
  useEffect(() => {
    galleryStore.load();
  }, []);

  const gallery = galleryStore.items;

  const activities =
    useSyncExternalStore(
      activitySubscribe,
      getActivities
    ) ?? [];

  const purchasedCount =
    useSyncExternalStore(
      subscribePurchases,
      getPurchasedCount
    ) ?? 0;

  const totalSpent =
    useSyncExternalStore(
      subscribePurchases,
      getTotalSpent
    ) ?? 0;

  const ratedCount =
    useSyncExternalStore(
      subscribeRatings,
      getRatedCountTotal
    ) ?? 0;

  const avgRating =
    useSyncExternalStore(
      subscribeRatings,
      getAverageRatingTotal
    ) ?? 0;

  const commentsCount =
    useSyncExternalStore(
      subscribeComments,
      getCommentsCountTotal
    ) ?? 0;

  const { products } = useProducts();

  const series = useMemo(
    () => [2, 4, 1, 7, 3, 6, 4],
    []
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Statystyki platformy
        </Text>

        <StatRow
          label="✅ Kupione produkty"
          value={purchasedCount.toString()}
        />
        <StatRow
          label="💸 Wydane pieniądze"
          value={`${totalSpent.toFixed(2)} zł`}
        />
        <StatRow
          label="⭐ Ocenione"
          value={ratedCount.toString()}
        />
        <StatRow
          label="⭐ Średnia"
          value={avgRating.toFixed(1)}
        />
        <StatRow
          label="💬 Komentarze"
          value={commentsCount.toString()}
        />
      </View>

      {series.length > 1 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📈 Wydatki – ostatnie 7 dni
          </Text>

          <LineChart data={series} />
        </View>
      )}
    </ScrollView>
  );
});

/* =========================
   COMPONENTS
   ========================= */

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

function StatRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}

/* =========================
   STYLES
   ========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
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
  section: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    color: '#444',
  },
  statValue: {
    fontWeight: '700',
  },
});
