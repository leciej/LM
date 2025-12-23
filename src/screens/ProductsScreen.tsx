import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ToastAndroid,
} from 'react-native';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { mockProducts, Product } from '../features/products/mockProducts';
import { addItemToCart } from '../features/cart/store/cartStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Products'>;

export function ProductsScreen({ navigation }: Props) {
  const handleAddToCart = (product: Product) => {
    addItemToCart(product);
    ToastAndroid.show(
      `Dodano "${product.name}" do koszyka`,
      ToastAndroid.SHORT
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produkty</Text>

      <FlatList
        data={mockProducts}
        keyExtractor={(item: Product) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  productId: item.id,
                })
              }
            >
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
            </Pressable>

            <Pressable
              style={styles.cartButton}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.cartText}>Dodaj do koszyka</Text>
            </Pressable>
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
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
  cartButton: {
    marginTop: 8,
    backgroundColor: '#2e7d32',
    padding: 10,
    borderRadius: 6,
  },
  cartText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
