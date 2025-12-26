import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSyncExternalStore } from 'react';
import { useAuth } from '../auth/AuthContext';

import {
  subscribe as subscribePurchases,
  getPurchasedCount,
  getTotalSpent,
} from '../features/purchases/store/purchasesStore';

import {
  subscribe as subscribeRatings,
  getRatedCount,
  getAverageRating,
} from '../features/ratings/store/ratingsStore';

import {
  subscribe as subscribeComments,
  getCommentsCount,
} from '../features/comments/commentsStore';

import {
  subscribe as subscribeActivity,
  getActivities,
} from '../features/activity/store/activityStore';

/* ===== helpers ===== */

const label = (type: string) =>
  ({
    COMMENT: '💬 Dodano komentarz',
    RATING: '⭐ Dodano ocenę',
    PURCHASE: '🛒 Złożono zamówienie',
  }[type]);

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'przed chwilą';
  if (min < 60) return `${min} min temu`;
  const h = Math.floor(min / 60);
  return `${h} h temu`;
}

/* ===== screen ===== */

export function ProfileScreen() {
  const { role, logout } = useAuth();

  const purchasedCount = useSyncExternalStore(
    subscribePurchases,
    getPurchasedCount
  );

  const totalSpent = useSyncExternalStore(
    subscribePurchases,
    getTotalSpent
  );

  const ratedCount = useSyncExternalStore(
    subscribeRatings,
    getRatedCount
  );

  const avgRating = useSyncExternalStore(
    subscribeRatings,
    getAverageRating
  );

  const commentsCount = useSyncExternalStore(
    subscribeComments,
    getCommentsCount
  );

  const activities = useSyncExternalStore(
    subscribeActivity,
    getActivities
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>

        <Text style={styles.title}>Profil</Text>
        <Text style={styles.subtitle}>
          Status: zalogowany
        </Text>
        <Text>Rola: {role}</Text>
      </View>

      {/* DASHBOARD */}
      <View style={styles.dashboard}>
        {/* ACTIVITY */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Ostatnia aktywność
          </Text>

          {activities.length === 0 ? (
            <Text style={styles.muted}>
              Brak aktywności
            </Text>
          ) : (
            activities.map((a, i) => (
              <View key={i} style={styles.activityRow}>
                <Text>{label(a.type)}</Text>
                <Text style={styles.time}>
                  {timeAgo(a.createdAt)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* STATS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Twoje statystyki
          </Text>

          <Text>✅ Kupione: {purchasedCount}</Text>
          <Text>
            💸 Wydano: {totalSpent.toFixed(2)} zł
          </Text>
          <Text>⭐ Ocenione: {ratedCount}</Text>
          <Text>
            ⭐ Średnia: {avgRating.toFixed(1)}
          </Text>
          <Text>💬 Komentarze: {commentsCount}</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <Button
          title="Wyloguj się"
          onPress={logout}
        />
      </View>
    </View>
  );
}

/* ===== styles ===== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },

  header: {
    alignItems: 'center',
    marginTop: 40,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 32,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },

  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },

  card: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  activityRow: {
    marginBottom: 6,
  },

  time: {
    fontSize: 12,
    color: '#666',
    marginLeft: 16,
  },

  muted: {
    color: '#666',
    fontStyle: 'italic',
  },

  actions: {
    marginBottom: 24,
  },
});
