import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  Image,
  Alert,
  ToastAndroid,
  Platform,
  Animated,
} from 'react-native';
import { observer } from 'mobx-react-lite';
import { useFocusEffect } from '@react-navigation/native';

import { galleryStore } from '../features/gallery/store/galleryStore';
import { addActivity } from '../features/activity/store/activityStore';
import { GalleryApi } from '../api/gallery/GalleryApi';

export const AdminGalleryScreen = observer(({ navigation }: any) => {
  const listRef = useRef<FlatList>(null);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      galleryStore.load(true);
    }, [])
  );

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  };

  const showToast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

  const toggleOverlay = (id: string) => {
    if (activeId === id) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setActiveId(null));
    } else {
      setActiveId(id);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    }
  };

  const removeItem = (id: string) => {
    Alert.alert(
      'Usuń arcydzieło',
      'Czy na pewno chcesz usunąć to arcydzieło?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          style: 'destructive',
          onPress: async () => {
            try {
              await GalleryApi.delete(id);
              galleryStore.remove(id);
              addActivity('REMOVE_GALLERY');
              showToast('Usunięto arcydzieło');
              setActiveId(null);
            } catch {
              Alert.alert(
                'Błąd',
                'Nie udało się usunąć arcydzieła'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      
      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AddGallery')}
      >
        <Text style={styles.addText}>Dodaj arcydzieło</Text>
      </Pressable>

      <FlatList
        ref={listRef}
        data={galleryStore.items}
        keyExtractor={item => item.id}
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
        renderItem={({ item }) => {
          const isActive = activeId === item.id;

          return (
            <View style={styles.cardWrapper}>
              <Pressable
                onPress={() => toggleOverlay(item.id)}
                style={styles.card}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                />

                <View style={styles.info}>
                  <Text style={styles.name} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.author}>
                    {item.artist}
                  </Text>
                </View>

                {isActive && (
                  <Animated.View
                    style={[
                      styles.overlay,
                      { opacity: fadeAnim },
                    ]}
                  >
                    <Pressable
                      style={styles.actionEdit}
                      onPress={() =>
                        navigation.navigate('AddGallery', {
                          galleryId: item.id,
                        })
                      }
                    >
                      <Text style={styles.actionText}>
                        ✏️ Edytuj
                      </Text>
                    </Pressable>

                    <Pressable
                      style={styles.actionDelete}
                      onPress={() => removeItem(item.id)}
                    >
                      <Text style={styles.actionText}>
                        🗑 Usuń
                      </Text>
                    </Pressable>
                  </Animated.View>
                )}
              </Pressable>
            </View>
          );
        }}
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
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },

  addButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  addText: { color: '#fff', textAlign: 'center', fontWeight: '600' },

  row: { justifyContent: 'space-between' },
  content: { paddingBottom: 100 },

  cardWrapper: { width: '48%', marginBottom: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },

  image: {
    width: '100%',
    height: 140,
  },

  info: {
    padding: 10,
  },

  name: { fontSize: 14, fontWeight: '600' },
  author: { fontSize: 12, color: '#666', marginTop: 2 },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20,20,20,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  actionEdit: {
    backgroundColor: '#f59e0b',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
  },

  actionDelete: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 22,
  },

  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  empty: { textAlign: 'center', marginTop: 40, color: '#666' },

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
