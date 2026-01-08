// screens/AdminStatsScreen.tsx
import React, { useMemo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { observer } from 'mobx-react-lite';

import { galleryStore } from '../features/gallery/store/galleryStore';
import { useProducts } from '../features/products/useProducts';
import { http } from '../api/http';

import { LineChart } from '../components/LineChart';

/* =========================
   TYPES
   ========================= */

type PlatformStats = {
  purchasedCount: number;
  totalSpent: number;
  ratedCount: number;
  averageRating: number;
  commentsCount: number;
  activitiesCount: number;
};

/* =========================
   SCREEN
   ========================= */

export const AdminStatsScreen = observer(() => {
  useEffect(() => {
    galleryStore.load();
  }, []);

  const gallery = galleryStore.items;
  const { products } = useProducts();

  const [stats, setStats] = useState<PlatformStats>({
    purchasedCount: 0,
    totalSpent: 0,
    ratedCount: 0,
    averageRating: 0,
    commentsCount: 0,
    activitiesCount: 0,
  });

  useEffect(() => {
    http
      .get<PlatformStats>('/stats/platform')
      .then(res => setStats(res.data))
      .catch(err => {
        console.error('STATS ERROR', err);
      });
  }, []);

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
        <StatCard label="Produkty" value={products.length} />
        <StatCard label="Arcydzieła" value={gallery.length} />
        <StatCard
          label="Aktywności"
          value={stats.activitiesCount}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Statystyki platformy
        </Text>

        <StatRow
          label="✅ Kupione produkty"
          value={stats.purchasedCount.toString()}
        />
        <StatRow
          label="💸 Wydane pieniądze"
          value={`${stats.totalSpent.toFixed(2)} zł`}
        />
        <StatRow
          label="⭐ Ocenione"
          value={stats.ratedCount.toString()}
        />
        <StatRow
          label="⭐ Średnia"
          value={stats.averageRating.toFixed(1)}
        />
        <StatRow
          label="💬 Komentarze"
          value={stats.commentsCount.toString()}
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
    minHeight: '100%',          // ✅ KLUCZ
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f5f6f8', // ✅ KLUCZ
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
    color: '#111827',
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
    color: '#111827',
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
    color: '#111827',
  },
});
