// src/screens/EditProfileScreen.js

import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';


const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useContext(AuthContext);

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [novaSenha, setNovaSenha] = useState('');
  const [novaFoto, setNovaFoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const escolherNovaFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setNovaFoto(result.assets[0]);
    }
  };

  const handleSalvar = async () => {
    if (!nome || !email) {
      Alert.alert('Erro', 'Nome e E-mail são obrigatórios.');
      return;
    }
    setIsSubmitting(true);

    // Lembre-se de usar o IP da sua máquina!
    const apiUrl = `http://127.0.0.1:8000/api/usuarios/${user.id}`;
    const formData = new FormData( );

    formData.append('nome', nome);
    formData.append('email', email);

    if (novaSenha) {
      formData.append('senha', novaSenha);
    }

    if (novaFoto) {
      try {
        const response = await fetch(novaFoto.uri);
        const blob = await response.blob();
        const filename = novaFoto.uri.split('/').pop();
        formData.append('foto', blob, filename);
      } catch (e) {
        Alert.alert("Erro", "Não foi possível processar a nova imagem.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      updateUser(response.data.usuario);
      Alert.alert('Sucesso!', 'Seu perfil foi atualizado.');
      navigation.goBack();

    } catch (error) {
      console.error('Erro ao atualizar perfil:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fotoUrl = user?.foto ? `http://127.0.0.1:8000/storage/${user.foto}` : null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity onPress={escolherNovaFoto} style={styles.imageContainer}>
          {novaFoto ? (
            <Image source={{ uri: novaFoto.uri }} style={styles.profileImage} />
           ) : fotoUrl ? (
            <Image source={{ uri: fotoUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={40} color="#ccc" />
            </View>
          )}
          <View style={styles.cameraIcon}>
            <Ionicons name="camera-reverse" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.label}>Nome Completo</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text style={styles.label}>E-mail</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

        <Text style={styles.label}>Nova Senha</Text>
        <TextInput
          style={styles.input}
          placeholder="Deixe em branco para não alterar"
          value={novaSenha}
          onChangeText={setNovaSenha}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, isSubmitting && styles.buttonDisabled]}
          onPress={handleSalvar}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Seus estilos (sem alterações)
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    padding: 8,
    borderRadius: 15,
  },
  label: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
