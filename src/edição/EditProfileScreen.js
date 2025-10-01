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
  SafeAreaView, // Adicionado para melhor manuseio de áreas seguras
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

// --- CORES (Paleta Azul) ---
const colors = {
  primaryBlue: '#2196F3', // Azul principal para botões e destaques
  darkBlue: '#1976D2',    // Azul mais escuro para elementos importantes
  lightBlue: '#BBDEFB',   // Azul claro para fundos secundários
  extraLightBlue: '#E3F2FD', // Azul muito claro para fundos
  textDark: '#212121',
  textLight: '#FFFFFF',
  grayText: '#616161',
  inputBackground: '#F5F5F5',
  inputBorder: '#E0E0E0',
  danger: '#D32F2F',
  white: '#FFFFFF',
  black: '#000000',
};

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    const formData = new FormData();

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <TouchableOpacity onPress={escolherNovaFoto} style={styles.imageContainer}>
            {novaFoto ? (
              <Image source={{ uri: novaFoto.uri }} style={styles.profileImage} />
             ) : fotoUrl ? (
              <Image source={{ uri: fotoUrl }} style={styles.profileImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={40} color={colors.grayText} />
              </View>
            )}
            <View style={styles.cameraIcon}>
              <Ionicons name="camera-reverse" size={20} color={colors.white} />
            </View>
          </TouchableOpacity>

          <Text style={styles.label}>Nome Completo</Text>
          <TextInput style={styles.input} value={nome} onChangeText={setNome} />

          <Text style={styles.label}>E-mail</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

          <Text style={styles.label}>Nova Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Altere sua senha"
            placeholderTextColor={colors.grayText}
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
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.buttonText}>Salvar Alterações</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#9fccffff', // Fundo geral azul muito claro
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 25,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: colors.primaryBlue, // Borda da imagem de perfil
    borderWidth: 3,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.lightBlue, // Fundo do placeholder azul claro
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primaryBlue,
    borderWidth: 3,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.darkBlue, // Fundo do ícone da câmera azul escuro
    padding: 8,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.white,
  },
  label: {
    fontSize: 16,
    color: colors.grayText,
    marginBottom: 8,
    marginTop: 15,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    color: colors.textDark,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.primaryBlue, // Botão principal azul
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: colors.primaryBlue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: colors.lightBlue, // Botão desabilitado azul claro
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
