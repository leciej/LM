import React, { useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSyncExternalStore } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth, type UserRole } from '../auth/AuthContext';
import { http } from '../api/http';

import {
  subscribe as subscribeActivity,
  getActivities,
} from '../features/activity/store/activityStore';

/* =========================
   ROLE META
   ========================= */

const ROLE_META: Record<
  Exclude<UserRole, 'GUEST'>,
  { label: string; color: string }
> = {
  USER: { label: '👤 Użytkownik', color: '#1976d2' },
  ADMIN: { label: '🛠 Administrator', color: '#111827' },
};

const FALLBACK_META = {
  label: '👤 Gość',
  color: '#6B7280',
};

function roleMeta(role: UserRole | null) {
  if (!role || role === 'GUEST') return FALLBACK_META;
  return ROLE_META[role];
}

/* =========================
   HELPERS
   ========================= */

const isAdminType = (type: string) =>
  [
    'ADD_PRODUCT',
    'EDIT_PRODUCT',
    'REMOVE_PRODUCT',
    'ADD_GALLERY',
    'EDIT_GALLERY',
    'REMOVE_GALLERY',
  ].includes(type);

const label = (type: string) =>
  ({
    COMMENT: '💬 Dodano komentarz',
    RATING: '⭐ Dodano ocenę',
    PURCHASE: '🛒 Złożono zamówienie',
    ADD_TO_CART: '➕ Dodano do koszyka',
    REMOVE_FROM_CART: '🗑 Usunięto z koszyka',
    ADD_PRODUCT: '➕ Dodano produkt',
    EDIT_PRODUCT: '✏️ Edytowano produkt',
    REMOVE_PRODUCT: '🗑 Usunięto produkt',
    ADD_GALLERY: '🖼➕ Dodano arcydzieło',
    EDIT_GALLERY: '🖼✏️ Edytowano arcydzieło',
    REMOVE_GALLERY: '🖼🗑 Usunięto arcydzieło',
  }[type] ?? '—');

function timeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'przed chwilą';
  if (min < 60) return `${min} min temu`;
  const h = Math.floor(min / 60);
  return `${h} h temu`;
}

/* =========================
   TYPES
   ========================= */

type UserStats = {
  purchasedCount: number;
  totalSpent: number;
  ratedCount: number;
  averageRating: number;
  commentsCount: number;
};

/* =========================
   SCREEN
   ========================= */

export function ProfileScreen() {
  const { user, logout, isAdmin } = useAuth();
  const meta = roleMeta(user?.role ?? null);

  const activities = useSyncExternalStore(
    subscribeActivity,
    getActivities
  );

  const visibleActivities = isAdmin
    ? activities.filter(a => isAdminType(a.type))
    : activities.filter(a => !isAdminType(a.type));

  const [stats, setStats] = useState<UserStats>({
    purchasedCount: 0,
    totalSpent: 0,
    ratedCount: 0,
    averageRating: 0,
    commentsCount: 0,
  });

  // 🔥 KLUCZ: odświeżanie statystyk ZA KAŻDYM WEJŚCIEM NA EKRAN
  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      let active = true;

      http
        .get<UserStats>(`/users/${user.id}/stats`)
        .then(res => {
          if (active) setStats(res.data);
        })
        .catch(() => {
          if (active)
            setStats({
              purchasedCount: 0,
              totalSpent: 0,
              ratedCount: 0,
              averageRating: 0,
              commentsCount: 0,
            });
        });

      return () => {
        active = false;
      };
    }, [user])
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name?.[0]?.toUpperCase() ?? '👤'}
          </Text>
        </View>

        <Text style={styles.title}>{user?.name ?? 'Gość'}</Text>
        <Text style={styles.subtitle}>{user?.email}</Text>

        <View style={styles.roleBadge}>
          <Text style={[styles.roleText, { color: meta.color }]}>
            {meta.label}
          </Text>
        </View>
      </View>

      {/* DASHBOARD */}
      <View style={styles.dashboard}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ostatnia aktywność</Text>

          {visibleActivities.length === 0 ? (
            <Text style={styles.muted}>Brak aktywności</Text>
          ) : (
            visibleActivities.map((a, i) => (
              <View key={i} style={styles.activityRow}>
                <Text>{label(a.type)}</Text>
                <Text style={styles.time}>
                  {timeAgo(a.createdAt)}
                </Text>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            {isAdmin ? 'Statystyki platformy' : 'Twoje statystyki'}
          </Text>

          <Text>✅ Kupione produkty: {stats.purchasedCount}</Text>
          <Text>
            💸 Wydane pieniądze:{' '}
            {stats.totalSpent.toFixed(2)} zł
          </Text>
          <Text>⭐ Ocenione: {stats.ratedCount}</Text>
          <Text>
            ⭐ Średnia: {stats.averageRating.toFixed(1)}
          </Text>
          <Text>💬 Komentarze: {stats.commentsCount}</Text>
        </View>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <Button title="Wyloguj się" onPress={logout} />
      </View>
    </View>
  );
}

/* =========================
   STYLES
   ========================= */

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
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#1976d2',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
    backgroundColor: '#e5e7eb',
  },
  roleText: {
    fontWeight: '700',
    fontSize: 13,
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
