
import React, { useEffect, useState } from 'react';
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

import { BarChart } from '../components/BarChart';

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

type OrdersChart = {
  days: string[];
  orders: number[];
  revenue: number[];
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

  const [chart, setChart] = useState<OrdersChart>({
    days: [],
    orders: [],
    revenue: [],
  });

  useEffect(() => {
    http
      .get<PlatformStats>('/stats/platform')
      .then(res => setStats(res.data))
      .catch(() => {});

    http
      .get<OrdersChart>('/stats/orders-last-7-days')
      .then(res => setChart(res.data))
      .catch(() => {});
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {}
      <View style={styles.grid}>
        <StatCard label="Produkty" value={products.length} />
        <StatCard label="Arcydzieła" value={gallery.length} />
        <StatCard
          label="Aktywności"
          value={stats.activitiesCount}
        />
      </View>

      {}
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

      {}
      {chart.orders.length === 7 && chart.revenue.length === 7 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            📊 Zamówienia vs Przychód (7 dni)
          </Text>

          <BarChart
            seriesA={chart.orders}
            seriesB={chart.revenue.map(v => Math.round(v))}
            labelA="Zamówienia"
            labelB="Przychód"
          />
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
    minHeight: '100%',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#f5f6f8',
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
