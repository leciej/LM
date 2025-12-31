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

import type {
  CreateProductRequestDto,
  UpdateProductRequestDto,
  ProductDto,
} from '../api/products';
import { useProducts } from '../features/products/useProducts';
import { addActivity } from '../features/activity/store/activityStore';

export function AdminAddProductScreen({ navigation, route }: any) {
  const editingProductId: string | undefined =
    route?.params?.productId;

  const { products, add, update } = useProducts();

  const editingProduct: ProductDto | undefined =
    editingProductId
      ? products.find(p => p.id === editingProductId)
      : undefined;

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(
    undefined
  );
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editingProduct) return;

    setName(editingProduct.name);
    setPrice(String(editingProduct.price));
    setDescription(editingProduct.description ?? '');
    setImageUrl(editingProduct.imageUrl);
  }, [editingProduct]);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
    });

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

  const showToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    }
  };

  const saveProduct = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert(
        'Błąd',
        'Uzupełnij nazwę i cenę.'
      );
      return;
    }

    try {
      setIsSaving(true);

      if (editingProductId) {
        const payload: UpdateProductRequestDto = {
          name: name.trim(),
          price: Number(price),
          description: description.trim(),
          imageUrl,
        };

        await update(editingProductId, payload);
        addActivity('EDIT_PRODUCT');
        showToast('Zaktualizowano produkt');
      } else {
        const payload: CreateProductRequestDto = {
          name: name.trim(),
          price: Number(price),
          description: description.trim(),
          imageUrl,
        };

        await add(payload);
        addActivity('ADD_PRODUCT');
        showToast('Dodano produkt');
      }

      navigation.goBack();
    } catch (e: any) {
      Alert.alert(
        'Błąd',
        e?.message ?? 'Nie udało się zapisać produktu'
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {editingProduct
          ? 'Edytuj produkt'
          : 'Dodaj produkt'}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nazwa"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Cena"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Opis produktu"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Pressable
        style={styles.imageButton}
        onPress={pickImage}
        disabled={isSaving}
      >
        <Text style={styles.imageText}>
          Wybierz obraz z galerii
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
        onPress={saveProduct}
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
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 6,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.7,
  },
});
