import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Animated,
  Alert,
  ToastAndroid,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';

import { galleryStore } from '@/features/gallery/store/galleryStore';
import { GalleryItemDto } from '@/api/gallery';
import { addActivity } from '@/features/activity/store/activityStore';

function AdminGalleryScreen() {
  const navigation = useNavigation<any>();
  const scalesRef = useRef<Record<string, Animated.Value>>({});
  const listRef = useRef<FlatList>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useFocusEffect(
    useCallback(() => {
      galleryStore.loadGallery();
    }, [])
  );

  const toast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

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

  const handleEdit = (item: GalleryItemDto) => {
    navigation.navigate('AdminAddGallery', {
      galleryId: item.id,
    });
  };

  const handleRemove = (item: GalleryItemDto) => {
    Alert.alert(
      'Usuń arcydzieło',
      `Czy na pewno chcesz usunąć "${item.title}"?`,
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            await galleryStore.remove(item.id);
            addActivity('REMOVE_GALLERY');
            toast('Arcydzieło usunięte');
            galleryStore.loadGallery();
          },
        },
      ]
    );
  };

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  };

  if (galleryStore.isLoading) {
    return (
      <View style={styles.center}>
        <Text>Ładowanie arcydzieł…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arcydzieła</Text>

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AdminAddGallery')}
      >
        <Text style={styles.addText}>Dodaj arcydzieło</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={galleryStore.items}
        numColumns={2}
        keyExtractor={(item: GalleryItemDto) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 140 }}
        onScroll={e => {
          const y = e.nativeEvent.contentOffset.y;
          setShowScrollTop(y > 300);
        }}
        scrollEventThrottle={16}
        ListEmptyComponent={
          <Text style={styles.empty}>Brak arcydzieł</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <Pressable
              style={styles.cardPressable}
              onPressIn={() => onPressIn(item.id)}
              onPressOut={() => onPressOut(item.id)}
            >
              <Animated.View
                style={[
                  styles.card,
                  {
                    transform: [{ scale: getScale(item.id) }],
                  },
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

            <Pressable
              style={styles.editButton}
              onPress={() => handleEdit(item)}
            >
              <Text style={styles.editText}>Edytuj</Text>
            </Pressable>

            <Pressable
              style={styles.deleteButton}
              onPress={() => handleRemove(item)}
            >
              <Text style={styles.deleteText}>Usuń</Text>
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

export default observer(AdminGalleryScreen);

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  addText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 14,
  },
  cardPressable: {
    marginBottom: 8,
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
  editButton: {
    backgroundColor: '#ffa000',
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  editText: {
    textAlign: 'center',
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#d32f2f',
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
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
