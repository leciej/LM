import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Alert,
  ListRenderItem,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getCartSnapshot,
  decreaseItemInCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from '../features/cart/store/cartStore';
import type { CartItem } from '../features/cart/store/cartStore';

export function CartScreen() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [blinkPlusId, setBlinkPlusId] = useState<string | null>(null);
  const [blinkMinusId, setBlinkMinusId] = useState<string | null>(null);

  const refresh = (): void => {
    setItems([...getCartSnapshot()]);
  };

  useFocusEffect(
    useCallback((): void => {
      refresh();
    }, [])
  );

  const total: number = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = (): void => {
    Alert.alert(
      'Zamówienie złożone',
      'Koszyk został wyczyszczony (demo)',
      [{ text: 'OK' }]
    );
    clearCart();
    refresh();
  };

  const renderItem: ListRenderItem<CartItem> = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.row}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.thumbnail} />
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>

          <View style={styles.controls}>
            <Pressable
              style={[
                styles.controlButton,
                item.quantity === 1 && styles.disabled,
              ]}
              disabled={item.quantity === 1}
              onPress={() => {
                decreaseItemInCart(item.id);
                setBlinkMinusId(item.id);
                refresh();
                setTimeout(() => setBlinkMinusId(null), 150);
              }}
            >
              <Text style={styles.controlText}>−</Text>
            </Pressable>

            <Text
              style={[
                styles.quantity,
                blinkPlusId === item.id && styles.blinkPlus,
                blinkMinusId === item.id && styles.blinkMinus,
              ]}
            >
              {item.quantity}
            </Text>

            <Pressable
              style={styles.controlButton}
              onPress={() => {
                addItemToCart(item);
                setBlinkPlusId(item.id);
                refresh();
                setTimeout(() => setBlinkPlusId(null), 150);
              }}
            >
              <Text style={styles.controlText}>+</Text>
            </Pressable>

            <Pressable
              style={styles.remove}
              onPress={() => {
                removeItemFromCart(item.id);
                refresh();
              }}
            >
              <Text style={styles.removeText}>🗑</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Koszyk</Text>

      <FlatList<CartItem>
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      <Text style={styles.total}>Suma: {total} zł</Text>

      <Pressable
        style={[styles.order, items.length === 0 && styles.disabled]}
        disabled={items.length === 0}
        onPress={order}
      >
        <Text style={styles.orderText}>Zamów</Text>
      </Pressable>

      <Pressable
        style={styles.clear}
        onPress={() => {
          clearCart();
          refresh();
        }}
      >
        <Text style={styles.clearText}>Wyczyść koszyk</Text>
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  item: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 64,
    height: 64,
    borderRadius: 6,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  controlText: {
    fontSize: 18,
    fontWeight: '700',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  blinkPlus: {
    color: '#2e7d32',
    fontSize: 18,
  },
  blinkMinus: {
    color: '#b71c1c',
    fontSize: 18,
  },
  remove: {
    marginLeft: 16,
  },
  removeText: {
    fontSize: 18,
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 24,
  },
  order: {
    marginTop: 12,
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 6,
  },
  orderText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  clear: {
    marginTop: 10,
    backgroundColor: '#b71c1c',
    padding: 14,
    borderRadius: 6,
  },
  clearText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});
