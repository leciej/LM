import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
} from 'react-native';

import {
  mockProducts,
  Product,
} from '../features/products/mockProducts';

export function AdminProductsScreen({ navigation }: any) {
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const removeProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produkty</Text>

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.addText}>
          Dodaj produkt
        </Text>
      </Pressable>

      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.topRow}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.thumbnail}
                />
              )}

              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.artist}>{item.artist}</Text>
                <Text style={styles.price}>{item.price} zł</Text>
              </View>
            </View>

            <View style={styles.actions}>
              <Pressable
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('AddProduct', {
                    productId: item.id,
                  })
                }
              >
                <Text style={styles.editText}>Edytuj</Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => removeProduct(item.id)}
              >
                <Text style={styles.deleteText}>Usuń</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
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
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  addText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 12,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 14,
    marginTop: 4,
  },
  actions: {
    gap: 6,
  },
  editButton: {
    backgroundColor: '#ffa000',
    padding: 8,
    borderRadius: 6,
  },
  editText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    padding: 8,
    borderRadius: 6,
  },
  deleteText: {
    color: '#fff',
    textAlign: 'center',
  },
});
