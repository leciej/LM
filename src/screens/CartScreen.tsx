import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  Alert,
  ListRenderItem,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';

import {
  getCartSnapshot,
  decreaseItemInCart,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from '../features/cart/store/cartStore';
import type { CartItem } from '../features/cart/store/cartStore';

import { addPurchase } from '../features/purchases/store/purchasesStore';

const FALLBACK_IMAGE = 'https://picsum.photos/200/200?blur=1';

const getKey = (item: CartItem) =>
  `${item.id}::${item.source}`;

const formatPrice = (value: number) =>
  value
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

export function CartScreen() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const scaleAnim = useRef<Record<string, Animated.Value>>({}).current;

  const getScale = (key: string) => {
    if (!scaleAnim[key]) {
      scaleAnim[key] = new Animated.Value(1);
    }
    return scaleAnim[key];
  };

  const refresh = useCallback(() => {
    const snapshot = getCartSnapshot();
    setItems(snapshot);

    setChecked(prev => {
      const next: Record<string, boolean> = {};
      snapshot.forEach(item => {
        const key = getKey(item);
        next[key] = prev[key] ?? true;
      });
      return next;
    });
  }, []);

  useFocusEffect(refresh);

  const allChecked =
    items.length > 0 &&
    items.every(item => checked[getKey(item)]);

  const toggleAll = () => {
    const next: Record<string, boolean> = {};
    items.forEach(item => {
      next[getKey(item)] = !allChecked;
    });
    setChecked(next);
  };

  const toggleOne = (key: string) => {
    const scale = getScale(key);

    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.7,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    setChecked(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const removeSelected = () => {
    const toRemove = items.filter(
      item => checked[getKey(item)]
    );

    toRemove.forEach(item => {
      removeItemFromCart(item.cartItemId);
    });

    setChecked({});
    refresh();
  };

  const total = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    return checked[getKey(item)]
      ? sum + price * item.quantity
      : sum;
  }, 0);

  const order = () => {
    if (!Number.isFinite(total)) {
      Alert.alert('Błąd', 'Nieprawidłowa cena');
      return;
    }

    const purchasedItems = items.filter(
      item => checked[getKey(item)]
    );

    if (purchasedItems.length === 0) {
      Alert.alert(
        'Brak produktów',
        'Nie zaznaczono żadnych produktów.'
      );
      return;
    }

    addPurchase(purchasedItems);

    Alert.alert(
      'Zamówienie złożone',
      `Suma: ${formatPrice(total)} zł`
    );

    clearCart();
    setChecked({});
    refresh();
  };

  const renderRightActions = (item: CartItem) => (
    <Pressable
      style={styles.swipeDelete}
      onPress={() => {
        removeItemFromCart(item.cartItemId);
        refresh();
      }}
    >
      <Text style={styles.swipeDeleteText}>Usuń</Text>
    </Pressable>
  );

  const renderItem: ListRenderItem<CartItem> = ({ item }) => {
    const key = getKey(item);

    return (
      <Swipeable renderRightActions={() => renderRightActions(item)}>
        <View style={styles.rowWrapper}>
          <Pressable onPress={() => toggleOne(key)}>
            <Animated.Text
              style={[
                styles.checkboxText,
                { transform: [{ scale: getScale(key) }] },
              ]}
            >
              {checked[key] ? '☑' : '☐'}
            </Animated.Text>
          </Pressable>

          <View style={styles.card}>
            <View style={styles.left}>
              <Image
                source={{ uri: item.imageUrl || FALLBACK_IMAGE }}
                style={styles.thumb}
              />
              <View>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>
                  {formatPrice(Number(item.price) || 0)} zł
                </Text>
              </View>
            </View>

            <View style={styles.right}>
              <View style={styles.controls}>
                <Pressable
                  style={[
                    styles.qtyBtn,
                    item.quantity === 1 && styles.disabled,
                  ]}
                  disabled={item.quantity === 1}
                  onPress={() => {
                    decreaseItemInCart(item.cartItemId);
                    refresh();
                  }}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </Pressable>

                <Text style={styles.qty}>{item.quantity}</Text>

                <Pressable
                  style={styles.qtyBtn}
                  onPress={() => {
                    addItemToCart(item, item.source);
                    refresh();
                  }}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </Pressable>
              </View>

              <View style={styles.itemTotal}>
                <Text style={styles.itemTotalValue}>
                  {formatPrice(
                    Number(item.price) * item.quantity
                  )}{' '}
                  zł
                </Text>
                <Text style={styles.itemTotalSub}>
                  za sztukę {formatPrice(Number(item.price) || 0)} zł
                </Text>
              </View>

              <Pressable
                style={styles.trash}
                onPress={() => {
                  removeItemFromCart(item.cartItemId);
                  refresh();
                }}
              >
                <Text style={styles.trashText}>🗑</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      {items.length > 0 && (
        <>
          <Pressable style={styles.selectAll} onPress={toggleAll}>
            <Text style={styles.selectAllText}>
              {allChecked ? '☑' : '☐'} Zaznacz wszystko
            </Text>
          </Pressable>

          <Pressable
            style={styles.removeSelected}
            onPress={removeSelected}
          >
            <Text style={styles.removeSelectedText}>
              Usuń zaznaczone
            </Text>
          </Pressable>
        </>
      )}

      <FlatList
        data={items}
        keyExtractor={getKey}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>Koszyk jest pusty</Text>
        }
      />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Razem:</Text>
          <Text style={styles.totalValue}>
            {formatPrice(total)} zł
          </Text>
        </View>

        <Pressable
          style={[
            styles.primary,
            total === 0 && styles.disabled,
          ]}
          disabled={total === 0}
          onPress={order}
        >
          <Text style={styles.primaryText}>ZAMÓW</Text>
        </Pressable>
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
    padding: 16,
    backgroundColor: '#f5f6f8',
  },

  selectAll: { marginBottom: 6 },
  selectAllText: { fontSize: 16, fontWeight: '600' },
  removeSelected: { marginBottom: 8 },
  removeSelectedText: {
    color: '#b71c1c',
    fontWeight: '700',
  },

  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  checkboxText: {
    fontSize: 20,
    marginRight: 8,
  },

  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  thumb: {
    width: 56,
    height: 56,
    borderRadius: 6,
    marginRight: 10,
  },

  name: { fontWeight: '700' },
  price: { marginTop: 4, color: '#2563EB' },

  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },

  qtyBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  qtyBtnText: { fontSize: 16, fontWeight: '800' },
  qty: { marginHorizontal: 10, fontWeight: '800' },

  itemTotal: {
    minWidth: 130,
    alignItems: 'flex-end',
    marginRight: 16,
  },

  itemTotalValue: {
    fontSize: 16,
    fontWeight: '800',
  },

  itemTotalSub: {
    fontSize: 11,
    color: '#6b7280',
  },

  trash: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 999,
  },

  trashText: { fontSize: 16 },

  swipeDelete: {
    backgroundColor: '#b71c1c',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 10,
  },

  swipeDeleteText: {
    color: '#fff',
    fontWeight: '800',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },

  listContent: {
    paddingBottom: 150,
  },

  summary: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 12,
  },

  totalLabel: { fontWeight: '700' },
  totalValue: { fontWeight: '900', fontSize: 18 },

  primary: {
    backgroundColor: '#2563EB',
    padding: 14,
    borderRadius: 10,
  },

  primaryText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '900',
  },

  disabled: { opacity: 0.5 },
});
