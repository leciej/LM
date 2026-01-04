import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

import { useAuth } from '../auth/AuthContext';

export function AdminPanelScreen({ navigation }: any) {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.denied}>Brak dostępu</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel administratora</Text>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('AdminProducts')}
      >
        <Text style={styles.buttonText}>
          Zarządzaj produktami
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('AdminStats')}
      >
        <Text style={styles.buttonText}>
          Statystyki
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate('AdminGallery')}
      >
        <Text style={styles.buttonText}>
          Galeria
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#1976d2',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  denied: {
    fontSize: 16,
    color: '#c62828',
    fontWeight: '600',
  },
});
