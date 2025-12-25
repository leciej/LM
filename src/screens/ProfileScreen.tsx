import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSyncExternalStore } from 'react';
import { useAuth } from '../auth/AuthContext';

import {
  subscribe as subscribePurchases,
  getPurchasedCount,
} from '../features/purchases/store/purchasesStore';

import {
  subscribe as subscribeRatings,
  getRatedCount,
} from '../features/ratings/store/ratingsStore';

import {
  subscribe as subscribeComments,
  getCommentsCount,
} from '../features/comments/commentsStore';

export function ProfileScreen() {
  const { role, logout } = useAuth();

  const purchasedCount = useSyncExternalStore(
    subscribePurchases,
    getPurchasedCount
  );

  const ratedCount = useSyncExternalStore(
    subscribeRatings,
    getRatedCount
  );

  const commentsCount = useSyncExternalStore(
    subscribeComments,
    getCommentsCount
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

      {/* STATS */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Twoje statystyki
        </Text>

        <Text>✅ Kupione produkty: {purchasedCount}</Text>
        <Text>⭐ Ocenione arcydzieła: {ratedCount}</Text>
        <Text>💬 Napisane komentarze: {commentsCount}</Text>
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
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  actions: {
    marginBottom: 24,
  },
});
