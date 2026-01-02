import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { observer } from 'mobx-react-lite';

import { galleryStore } from '@/features/gallery/store/galleryStore';
import { GalleryItemDto } from '@/api/gallery';

function GalleryScreen() {
  const navigation = useNavigation<any>();
  const listRef = useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useFocusEffect(
    useCallback(() => {
      galleryStore.load();
    }, [])
  );

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  };

  const goToDetails = (item: GalleryItemDto) => {
    navigation.navigate('GalleryDetails', {
      galleryId: item.id,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={galleryStore.items}
        keyExtractor={(item: GalleryItemDto) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        onScroll={e => {
          setShowScrollTop(
            e.nativeEvent.contentOffset.y > 300
          );
        }}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <Text style={styles.empty}>Brak arcydzieł</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <Pressable onPress={() => goToDetails(item)}>
              <View style={styles.card}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                />

                <View style={styles.textBox}>
                  <Text style={styles.name} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.author} numberOfLines={1}>
                    {item.artist}
                  </Text>
                </View>
              </View>
            </Pressable>
          </View>
        )}
      />

      {showScrollTop && (
        <Pressable
          style={styles.scrollTopButton}
          onPress={scrollToTop}
        >
          <Text style={styles.scrollTopText}>⬆</Text>
        </Pressable>
      )}
    </View>
  );
}

export default observer(GalleryScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f6f8',
  },
  row: {
    justifyContent: 'space-between',
  },
  content: {
    paddingBottom: 80,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 14,
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
  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#666',
  },
  scrollTopButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#2563EB',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  scrollTopText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
});
