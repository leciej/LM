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
  getGallery,
  addGallery,
  updateGallery,
  GalleryItem,
} from '../features/gallery/store/galleryStore';

import { addActivity } from '../features/activity/store/activityStore';

export function AdminAddGalleryScreen({ navigation, route }: any) {
  const editingId = route?.params?.galleryId;

  const editingItem = editingId
    ? getGallery().find(g => g.id === editingId)
    : undefined;

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState<string | undefined>();
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editingItem) return;
    setTitle(editingItem.title);
    setAuthor(editingItem.author);
    setImage(editingItem.image);
  }, [editingId]);

  const showToast = (msg: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT);
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (result.assets?.[0]?.uri) {
      setImage(result.assets[0].uri);
      setImageUrlInput('');
    }
  };

  const applyImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImage(imageUrlInput.trim());
    }
  };

  const saveGallery = () => {
    if (!title || !author || !image) {
      Alert.alert(
        'Uzupełnij dane',
        'Tytuł, autor i obraz są wymagane'
      );
      return;
    }

    if (isSaving) return;
    setIsSaving(true);

    const item: GalleryItem = {
      id: editingId ?? Date.now().toString(),
      title,
      author,
      image,
    };

    setTimeout(() => {
      if (editingId) {
        updateGallery(item);
        addActivity('EDIT_GALLERY');
        showToast('Zapisano zmiany arcydzieła');
      } else {
        addGallery(item);
        addActivity('ADD_GALLERY');
        showToast('Dodano nowe arcydzieło');
      }

      setIsSaving(false);
      navigation.goBack();
    }, 600);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingId ? 'Edytuj arcydzieło' : 'Dodaj arcydzieło'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Tytuł"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor"
        value={author}
        onChangeText={setAuthor}
      />

      <Pressable
        style={styles.imageButton}
        onPress={pickImage}
        disabled={isSaving}
      >
        <Text style={styles.imageText}>
          Wybierz obraz z dysku
        </Text>
      </Pressable>

      <TextInput
        style={styles.input}
        placeholder="lub wklej URL obrazu"
        value={imageUrlInput}
        onChangeText={setImageUrlInput}
        onBlur={applyImageUrl}
        editable={!isSaving}
      />

      {image && (
        <Image source={{ uri: image }} style={styles.preview} />
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
          <Text style={styles.saveText}>Zapisz</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
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
  imageText: { color: '#fff', textAlign: 'center' },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: '600' },
  disabled: { opacity: 0.7 },
});
