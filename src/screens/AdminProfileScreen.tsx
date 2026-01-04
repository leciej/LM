import React, { useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { useSyncExternalStore } from 'react';
import { useAuth } from '../auth/AuthContext';

import {
  subscribe as subscribeActivity,
  getActivities,
} from '../features/activity/store/activityStore';

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
   ANIMATED ACTION BUTTON
   ========================= */

function AnimatedActionButton({
  label,
  onPress,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const pressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const pressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start(() => {
      onPress(); // 🚀 nawigacja po animacji
    });
  };

  return (
    <Pressable onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View
        style={[
          styles.actionButton,
          variant === 'secondary' && styles.actionButtonSecondary,
          { transform: [{ scale }] },
        ]}
      >
        <Text style={styles.actionText}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

/* =========================
   SCREEN
   ========================= */

export function AdminProfileScreen({ navigation }: any) {
  const { logout, user, isAdmin } = useAuth();

  const activities = useSyncExternalStore(
    subscribeActivity,
    getActivities
  ).filter(a => isAdminType(a.type));

  if (!isAdmin || !user) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Brak dostępu</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name?.[0] ?? 'A'}
          </Text>
        </View>

        <Text style={styles.title}>{user.name}</Text>
        <Text style={styles.subtitle}>{user.email}</Text>

        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>🛠 Administrator</Text>
        </View>
      </View>

      {/* DASHBOARD */}
      <View style={styles.dashboard}>
        {/* ACTIVITY */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Ostatnia aktywność
          </Text>

          {activities.length === 0 ? (
            <Text style={styles.muted}>Brak aktywności</Text>
          ) : (
            activities.slice(0, 5).map((a, i) => (
              <View key={i} style={styles.activityRow}>
                <Text>{label(a.type)}</Text>
                <Text style={styles.time}>
                  {timeAgo(a.createdAt)}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Szybkie akcje</Text>

          <AnimatedActionButton
            label="📦 Produkty"
            onPress={() => navigation.navigate('AdminProducts')}
          />

          <AnimatedActionButton
            label="🖼 Arcydzieła"
            onPress={() => navigation.navigate('AdminGallery')}
          />

          <AnimatedActionButton
            label="📊 Statystyki"
            variant="secondary"
            onPress={() => navigation.navigate('AdminStats')}
          />
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
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
    backgroundColor: '#E5E7EB',
    marginTop: 6,
  },
  roleText: {
    fontWeight: '700',
    fontSize: 13,
  },
  dashboard: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
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
  actionButton: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  actionButtonSecondary: {
    backgroundColor: '#E5E7EB',
  },
  actionText: {
    color: '#111827',
    fontWeight: '700',
    textAlign: 'center',
  },
  actions: {
    marginBottom: 24,
  },
});
