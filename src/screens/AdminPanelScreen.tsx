import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../auth/AuthContext';

export function AdminPanelScreen() {
  const { role } = useAuth();

  if (role !== 'ADMIN') {
    return (
      <View>
        <Text>Brak dostępu</Text>
      </View>
    );
  }

  return (
    <View>
      <Text>Panel administratora</Text>

      <Button
        title="Dodaj produkt"
        onPress={() => {}}
      />

      <Button
        title="Usuń produkt"
        onPress={() => {}}
      />

      <Button
        title="Raport sprzedaży"
        onPress={() => {}}
      />
    </View>
  );
}
