import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';

export function ProfileScreen() {
  const { role, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text>Rola: {role}</Text>

      <Button
        title="Wyloguj się"
        onPress={logout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: '700',
  },
});
