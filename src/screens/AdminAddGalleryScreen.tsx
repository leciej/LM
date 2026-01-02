import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import {
  GalleryItemDto,
  CreateGalleryItemRequestDto,
  UpdateGalleryItemRequestDto,
} from '../api/gallery/gallery.types';
import { GalleryApi } from '../api/gallery/GalleryApi';
import { addActivity } from '../features/activity/store/activityStore';

export function AdminAddGalleryScreen({ navigation, route }: any) {
  const editingGalleryId: string | undefined =
    route?.params?.galleryId;

  const [editingItem, setEditingItem] =
    useState<GalleryItemDto | null>(null);

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>();
  const [imageUrlInput, setImageUrlInput] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     LOAD FOR EDIT
     ========================= */
  useEffect(() => {
    if (!editingGalleryId) return;

    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        const remote = await GalleryApi.getById(editingGalleryId);
        if (!cancelled) setEditingItem(remote);
      } catch {
        Alert.alert('Błąd', 'Nie udało się załadować arcydzieła');
        navigation.goBack();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [editingGalleryId, navigation]);

  /* =========================
     FILL FORM
     ========================= */
  useEffect(() => {
    if (!editingItem) return;

    setTitle(editingItem.title);
    setArtist(editingItem.artist);
    setPrice(String(editingItem.price));
    setImageUrl(editingItem.imageUrl);
  }, [editingItem]);

  const toast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

  /* =========================
     IMAGE
     ========================= */
  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets?.[0]?.uri) {
      setImageUrl(result.assets[0].uri);
      setImageUrlInput('');
    }
  };

  const applyImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImageUrl(imageUrlInput.trim());
    }
  };

  /* =========================
     SAVE
     ========================= */
  const saveGallery = async () => {
    if (!title.trim() || !artist.trim() || !price.trim()) {
      Alert.alert(
        'Błąd',
        'Uzupełnij tytuł, autora i cenę'
      );
      return;
    }

    try {
      setIsSaving(true);

      if (editingGalleryId) {
        const payload: UpdateGalleryItemRequestDto = {
          title: title.trim(),
          artist: artist.trim(),
          price: Number(price),
          imageUrl,
        };

        await GalleryApi.update(editingGalleryId, payload);
        addActivity('EDIT_GALLERY');
        toast('Zaktualizowano arcydzieło');
      } else {
        const payload: CreateGalleryItemRequestDto = {
          title: title.trim(),
          artist: artist.trim(),
          price: Number(price),
          imageUrl: imageUrl!,
        };

        await GalleryApi.create(payload);
        addActivity('ADD_GALLERY');
        toast('Dodano arcydzieło');
      }

      navigation.goBack();
    } catch {
      Alert.alert(
        'Błąd',
        'Nie udało się zapisać arcydzieła'
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* =========================
     UI
     ========================= */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingGalleryId
          ? 'Edytuj arcydzieło'
          : 'Dodaj arcydzieło'}
      </Text>

      {isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator />
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Tytuł"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={artist}
        onChangeText={setArtist}
      />

      <TextInput
        style={styles.input}
        placeholder="Cena"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <Pressable
        style={styles.imageButton}
        onPress={pickImage}
      >
        <Text style={styles.imageText}>
          Wybierz obraz
        </Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="lub URL obrazu"
        value={imageUrlInput}
        onChangeText={setImageUrlInput}
        onBlur={applyImageUrl}
      />

      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          style={styles.preview}
        />
      )}

      <Pressable
        style={[
          styles.saveButton,
          isSaving && styles.disabled,
        ]}
        onPress={saveGallery}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>
            Zapisz
          </Text>
        )}
      </Pressable>
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
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  loading: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  imageButton: {
    backgroundColor: '#455a64',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
  },
  imageText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.7,
  },
});
