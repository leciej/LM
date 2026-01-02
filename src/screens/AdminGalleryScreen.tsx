import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { observer } from 'mobx-react-lite';

import { galleryStore } from '../features/gallery/store/galleryStore';
import { addActivity } from '../features/activity/store/activityStore';

export const AdminGalleryScreen = observer(({ navigation }: any) => {
  const [, force] = useState(0);

  useEffect(() => {
    galleryStore.load().then(() => force(x => x + 1));
  }, []);

  const showToast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
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
          onPress: () => {
            galleryStore.remove(id);
            addActivity('REMOVE_GALLERY');
            showToast('Usunięto arcydzieło');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Arcydzieła</Text>

      <Pressable
        style={styles.addButton}
        onPress={() => navigation.navigate('AddGallery')}
      >
        <Text style={styles.addText}>Dodaj arcydzieło</Text>
      </Pressable>

      <FlatList
        data={galleryStore.items}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <Text style={styles.empty}>Brak arcydzieł</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <View style={styles.card}>
              {item.imageUrl && (
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
              )}

              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.author}>{item.artist}</Text>
              </View>

              <Pressable
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('AddGallery', {
                    galleryId: item.id,
                  })
                }
              >
                <Text style={styles.editText}>Edytuj</Text>
              </Pressable>

              <Pressable
                style={styles.deleteButton}
                onPress={() => removeItem(item.id)}
              >
                <Text style={styles.deleteText}>Usuń</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  addButton: {
    backgroundColor: '#1976d2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  addText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  row: { justifyContent: 'space-between' },
  cardWrapper: { width: '48%', marginBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
  },
  image: { width: '100%', height: 120 },
  info: { padding: 8 },
  name: { fontSize: 14, fontWeight: '600' },
  author: { fontSize: 12, color: '#666' },
  editButton: { backgroundColor: '#ffa000', paddingVertical: 6 },
  editText: { textAlign: 'center', fontWeight: '600' },
  deleteButton: { backgroundColor: '#d32f2f', paddingVertical: 6 },
  deleteText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  empty: { textAlign: 'center', marginTop: 40, color: '#666' },
});
