import React, {
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
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
import { useRoute } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useProducts } from '../features/products/useProducts';
import { addItemToCart } from '../features/cart/store/cartStore';
import type { ProductDto } from '../api/products';


import type { ProductsStackParamList } from '../navigation/TabsNavigator/ProductsStackNavigator';

/* =========================
   TYPES
   ========================= */

type Props = NativeStackScreenProps<
  ProductsStackParamList,
  'Products'
>;

type SortOption =
  | 'NAME_ASC'
  | 'NAME_DESC'
  | 'PRICE_ASC'
  | 'PRICE_DESC';

/* =========================
   COMPONENT
   ========================= */

export function ProductsScreen({ navigation }: Props) {
  const { products, loading, error } = useProducts();
  const route = useRoute<any>();

  const listRef = useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] =
    useState(false);
  const [sort, setSort] =
    useState<SortOption>('NAME_ASC');
  const [menuOpen, setMenuOpen] = useState(false);

  /* =========================
     REACT TO HEADER HAMBURGER
     ========================= */

  useEffect(() => {
    if (route.params?.openSortMenu) {
      setMenuOpen(true);
    }
  }, [route.params?.openSortMenu]);

  /* =========================
     SORTED PRODUCTS
     ========================= */

  const sortedProducts = useMemo(() => {
    const copy = [...products];

    switch (sort) {
      case 'PRICE_ASC':
        return copy.sort((a, b) => a.price - b.price);
      case 'PRICE_DESC':
        return copy.sort((a, b) => b.price - a.price);
      case 'NAME_DESC':
        return copy.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
      case 'NAME_ASC':
      default:
        return copy.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
    }
  }, [products, sort]);

  /* =========================
     HANDLERS
     ========================= */

  const handleAddToCart = async (
    product: ProductDto
  ) => {
    try {
      await addItemToCart({ id: product.id });

      if (Platform.OS === 'android') {
        ToastAndroid.show(
          `Dodano "${product.name}"`,
          ToastAndroid.SHORT
        );
      }
    } catch (err) {
      console.error('ADD TO CART ERROR', err);

      if (Platform.OS === 'android') {
        ToastAndroid.show(
          'Nie udało się dodać do koszyka',
          ToastAndroid.SHORT
        );
      }
    }
  };

  const selectSort = (value: SortOption) => {
    setSort(value);
    setMenuOpen(false);
  };

  /* =========================
     STATES
     ========================= */

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

  /* =========================
     RENDER
     ========================= */

  return (
    <View style={styles.container}>
      {}
      {menuOpen && (
        <Pressable
          style={styles.overlay}
          onPress={() => setMenuOpen(false)}
        >
          <View style={styles.menu}>
            <Text style={styles.menuTitle}>
              Sortuj według
            </Text>

            <MenuItem
              label="Nazwa A–Z"
              active={sort === 'NAME_ASC'}
              onPress={() =>
                selectSort('NAME_ASC')
              }
            />
            <MenuItem
              label="Nazwa Z–A"
              active={sort === 'NAME_DESC'}
              onPress={() =>
                selectSort('NAME_DESC')
              }
            />
            <MenuItem
              label="Cena rosnąco"
              active={sort === 'PRICE_ASC'}
              onPress={() =>
                selectSort('PRICE_ASC')
              }
            />
            <MenuItem
              label="Cena malejąco"
              active={sort === 'PRICE_DESC'}
              onPress={() =>
                selectSort('PRICE_DESC')
              }
            />
          </View>
        </Pressable>
      )}

      {}
      <FlatList
        ref={listRef}
        data={sortedProducts}
        keyExtractor={item => item.id}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        scrollEventThrottle={16}
        onScroll={event => {
          const y =
            event.nativeEvent.contentOffset.y;
          setShowScrollTop(y > 300);
        }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              onPress={() =>
                navigation.navigate(
                  'ProductDetails',
                  { product: item }
                )
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
              onPress={() =>
                handleAddToCart(item)
              }
            >
              <Text style={styles.buttonText}>
                Dodaj do koszyka
              </Text>
            </Pressable>
          </View>
        )}
      />

      {}
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
          <Text style={styles.scrollTopText}>
            ⬆
          </Text>
        </Pressable>
      )}

      {}
      {error && products.length > 0 && (
        <Text style={styles.softError}>
          {error}
        </Text>
      )}
    </View>
  );
}

/* =========================
   MENU ITEM
   ========================= */

function MenuItem({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.menuItem,
        active && styles.menuItemActive,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.menuItemText,
          active &&
            styles.menuItemTextActive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
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

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },

  menu: {
    position: 'absolute',
    top: 8,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: 200,
    elevation: 8,
  },

  menuTitle: {
    fontWeight: '800',
    marginBottom: 8,
  },

  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  menuItemActive: {
    backgroundColor: '#2563EB',
  },

  menuItemText: {
    fontSize: 14,
  },

  menuItemTextActive: {
    color: '#fff',
    fontWeight: '700',
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
