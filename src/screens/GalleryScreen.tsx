import React, { useEffect, useRef } from 'react';
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
import { observer } from 'mobx-react-lite';

import { galleryStore } from '@/features/gallery/store/galleryStore';
import { GalleryItemDto } from '@/api/gallery';

function GalleryScreen() {
  const navigation = useNavigation<any>();
  const scalesRef = useRef<Record<string, Animated.Value>>({});

  useEffect(() => {
    galleryStore.loadGallery();
  }, []);

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

  const goDetails = (galleryId: string) => {
    navigation.navigate('GalleryDetails', {
      galleryId,
    });
  };

  if (galleryStore.isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading gallery…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={galleryStore.items}
        numColumns={2}
        keyExtractor={(item: GalleryItemDto) => item.id}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
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
                source={{ uri: item.imageUrl }}
                style={styles.image}
              />

              <View style={styles.textBox}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.author} numberOfLines={1}>
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

export default observer(GalleryScreen);

/* =========================
   STYLES (MINIMALNE DODATKI)
   ========================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6f8',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
