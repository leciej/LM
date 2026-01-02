import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  ToastAndroid,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useProducts } from '../features/products/useProducts';
import { addItemToCart } from '../features/cart/store/cartStore';
import type { ProductDto } from '../api/products';
import type { ProductsStackParamList } from '../navigation/TabsNavigator/ProductsStackNavigator';

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  'Products'
>;

export function ProductsScreen({ navigation }: Props) {
  const { products, loading, error } = useProducts();

  const listRef = useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleAddToCart = (product: ProductDto) => {
    addItemToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl, // ⬅️ KLUCZOWA ZMIANA
      },
      'PRODUCTS'
    );

    if (Platform.OS === 'android') {
      ToastAndroid.show(
        `Dodano "${product.name}"`,
        ToastAndroid.SHORT
      );
    }
  };

  if (loading && products.length === 0) {
    return (
      <View style={styles.center}>
        <Text>Ładowanie produktów…</Text>
      </View>
    );
  }

  if (error && products.length === 0) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={16}
        onScroll={event => {
          const y = event.nativeEvent.contentOffset.y;
          setShowScrollTop(y > 300);
        }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() =>
                navigation.navigate('ProductDetails', {
                  product: item,
                  source: 'PRODUCTS',
                })
              }
            >
              <View style={styles.row}>
                {item.imageUrl && (
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.image}
                  />
                )}

                <View style={styles.info}>
                  <Text style={styles.name}>
                    {item.name}
                  </Text>

                  {!!item.description && (
                    <Text
                      style={styles.description}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  )}

                  <Text style={styles.price}>
                    {item.price} zł
                  </Text>
                </View>
              </View>
            </Pressable>

            <Pressable
              style={styles.button}
              onPress={() => handleAddToCart(item)}
            >
              <Text style={styles.buttonText}>
                Dodaj do koszyka
              </Text>
            </Pressable>
          </View>
        )}
      />

      {showScrollTop && (
        <Pressable
          style={styles.scrollTopButton}
          onPress={() =>
            listRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            })
          }
        >
          <Text style={styles.scrollTopText}>⬆</Text>
        </Pressable>
      )}

      {error && products.length > 0 && (
        <Text style={styles.softError}>
          {error}
        </Text>
      )}
    </View>
  );
}

/* =========================
   STYLES
   ========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6f8',
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },

  info: {
    flex: 1,
    justifyContent: 'center',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },

  description: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },

  price: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2563EB',
  },

  button: {
    marginTop: 10,
    backgroundColor: '#2e7d32',
    paddingVertical: 10,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  softError: {
    textAlign: 'center',
    marginTop: 8,
    color: '#888',
    fontSize: 12,
  },

  scrollTopButton: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },

  scrollTopText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },
});
