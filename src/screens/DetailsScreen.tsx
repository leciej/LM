import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function DetailsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Szczegóły</Text>
      <Text>Drugi ekran aplikacji</Text>
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
    marginBottom: 8,
    fontWeight: '600',
  },
});
