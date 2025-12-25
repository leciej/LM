import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { mockProducts, Product } from '../features/products/mockProducts';

const STOCK_IMAGES = [
  'https://picsum.photos/600/400?random=1',
  'https://picsum.photos/600/400?random=2',
  'https://picsum.photos/600/400?random=3',
  'https://picsum.photos/600/400?random=4',
  'https://picsum.photos/600/400?random=5',
];

export function GalleryScreen() {
  const navigation = useNavigation<any>();
  const scalesRef = useRef<Record<string, Animated.Value>>({});

  const getScale = (id: string) => {
    if (!scalesRef.current[id]) {
      scalesRef.current[id] = new Animated.Value(1);
    }
    return scalesRef.current[id];
  };

  const onPressIn = (id: string) => {
    Animated.spring(getScale(id), {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = (id: string) => {
    Animated.spring(getScale(id), {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const goDetails = (productId: string) => {
    navigation.navigate('GalleryDetails', {
      productId,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockProducts}
        numColumns={2}
        keyExtractor={(item: Product) => item.id}
        columnWrapperStyle={styles.row}
        renderItem={({ item, index }) => (
          <Pressable
            style={styles.cardPressable}
            onPress={() => goDetails(item.id)}
            onPressIn={() => onPressIn(item.id)}
            onPressOut={() => onPressOut(item.id)}
          >
            <Animated.View
              style={[
                styles.card,
                { transform: [{ scale: getScale(item.id) }] },
              ]}
            >
              <Image
                source={{
                  uri:
                    STOCK_IMAGES[index % STOCK_IMAGES.length],
                }}
                style={styles.image}
              />

              <View style={styles.textBox}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text
                  style={styles.author}
                  numberOfLines={1}
                >
                  {item.artist}
                </Text>
              </View>
            </Animated.View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6f8',
  },
  row: {
    justifyContent: 'space-between',
  },
  cardPressable: {
    width: '48%',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 140,
  },
  textBox: {
    padding: 10,
  },
  name: {
    fontWeight: '700',
    fontSize: 14,
  },
  author: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
});
