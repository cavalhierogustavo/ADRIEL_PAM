// src/home/home.js

import React, { useState, useRef, useEffect, useContext, useLayoutEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  StyleSheet,
  Alert,
  TextInput,
  SafeAreaView, // Adicionado para melhor manuseio de áreas seguras
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';


const localImages = {
  remedio: require("../../assets/agua.png"),
};

const data = [
  { id: "1", title: "Hidrômetro", img: localImages.remedio, screen: "Aguinha" },
  { id: "2", title: "Batimento", img: localImages.remedio, screen: "OutraTela" }, // Exemplo
  { id: "3", title: "Sangue", img: localImages.remedio, screen: "MaisUmaTela" }, // Exemplo
  { id: "4", title: "Glicose", img: localImages.remedio, screen: "TesteTela" }, // Exemplo
];

export default function Home() {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);

  // --- ESTADOS ---
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [darkMode, setDarkMode] = useState(false); // Pode ser gerenciado por um contexto ou preferência do usuário
  const animationValues = useRef(data.map(() => new Animated.Value(0))).current;

  // --- CORES (Paleta mais coesa) ---
  const colors = {
    primary: '#4CAF50', // Verde vibrante
    primaryDark: '#388E3C',
    accent: '#FFC107', // Amarelo para destaque
    backgroundLight: '#F5F5F5',
    backgroundDark: '#212121',
    textLight: '#212121',
    textDark: '#E0E0E0',
    cardBackgroundLight: '#FFFFFF',
    cardBackgroundDark: '#424242',
    modalBackgroundLight: 'rgba(0,0,0,0.4)',
    modalBackgroundDark: 'rgba(0,0,0,0.6)',
    danger: '#D32F2F',
    warning: '#FFA000',
    divider: '#BDBDBD',
  };

  // --- EFFECTS ---
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setProfileModalVisible(true)} style={{ marginRight: 15 }}>
          <Ionicons name="person-circle-outline" size={32} color={darkMode ? colors.textDark : colors.textLight} />
        </TouchableOpacity>
      ),
      headerTitle: `Bem-vindo, ${user?.nome || 'Usuário'}`,
      headerTitleStyle: { color: darkMode ? colors.textDark : colors.textLight, fontSize: 20, fontWeight: 'bold' },
      headerStyle: { backgroundColor: darkMode ? colors.backgroundDark : colors.backgroundLight, elevation: 0, shadowOpacity: 0 }
    });
  }, [navigation, darkMode, user, colors]);

  useEffect(() => {
    const animations = data.map((_, index) =>
      Animated.timing(animationValues[index], {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      })
    );
    Animated.stagger(100, animations).start();
  }, [animationValues]);

  // --- FUNÇÕES HANDLER ---

  const handleEditProfile = () => {
    setProfileModalVisible(false);
    navigation.navigate('EditProfile');
  };

  const handleLogout = () => {
    setProfileModalVisible(false);
    setConfirmLogoutVisible(true);
  };

  const handleDeleteAccount = () => {
    setProfileModalVisible(false);
    setDeleteModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    if (deleteConfirmationText.toUpperCase() !== 'DELETAR') {
      Alert.alert('Confirmação Incorreta', 'Você deve digitar "DELETAR" para confirmar.');
      return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/usuarios/${user.id}`; // Lembre-se de usar seu IP

    try {
      await axios.delete(apiUrl);
      Alert.alert('Conta Deletada', 'Sua conta foi permanentemente deletada.');
      setDeleteModalVisible(false);
      logout();
    } catch (error) {
      console.error('Erro ao deletar conta:', error.response ? error.response.data : error.message);
      Alert.alert('Erro', 'Não foi possível deletar sua conta.');
    }
  };

  // --- RENDERIZAÇÃO ---

  const renderItem = ({ item, index }) => {
    const translateY = animationValues[index].interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    const opacity = animationValues[index];
    return (
      <Animated.View style={{ transform: [{ translateY }], opacity, flex: 1 }}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: darkMode ? colors.cardBackgroundDark : colors.cardBackgroundLight }]} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Image source={item.img} style={styles.cardImg} />
          <Text style={[styles.cardText, { color: darkMode ? colors.textDark : colors.textLight }]}>{item.title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: darkMode ? colors.backgroundDark : colors.backgroundLight }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
      />

      {/* Modal de Perfil */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <TouchableOpacity style={[styles.modalOverlay, { backgroundColor: darkMode ? colors.modalBackgroundDark : colors.modalBackgroundLight }]} activeOpacity={1} onPressOut={() => setProfileModalVisible(false)}>
          <View style={[styles.modalView, { backgroundColor: darkMode ? colors.cardBackgroundDark : colors.cardBackgroundLight }]}>
            <TouchableOpacity style={styles.modalButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={22} color={darkMode ? colors.textDark : colors.textLight} />
              <Text style={[styles.modalButtonText, { color: darkMode ? colors.textDark : colors.textLight }]}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color={colors.danger} />
              <Text style={[styles.modalButtonText, { color: colors.danger }]}>Sair</Text>
            </TouchableOpacity>
            <View style={[styles.divider, { backgroundColor: darkMode ? colors.divider : colors.divider }]} />
            <TouchableOpacity style={styles.modalButton} onPress={handleDeleteAccount}>
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
              <Text style={[styles.modalButtonText, { color: colors.danger }]}>Deletar Conta</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal de Confirmação de Logout */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmLogoutVisible}
        onRequestClose={() => setConfirmLogoutVisible(false)}
      >
        <View style={[styles.confirmModalOverlay, { backgroundColor: darkMode ? colors.modalBackgroundDark : colors.modalBackgroundLight }]}>
          <View style={[styles.confirmModalView, { backgroundColor: darkMode ? colors.cardBackgroundDark : colors.cardBackgroundLight }]}>
            <Text style={[styles.confirmModalTitle, { color: darkMode ? colors.textDark : colors.textLight }]}>Confirmar Saída</Text>
            <Text style={[styles.confirmModalText, { color: darkMode ? colors.textDark : colors.textLight }]}>Você tem certeza que deseja se desconectar?</Text>
            <View style={styles.confirmModalButtonContainer}>
              <TouchableOpacity style={[styles.confirmModalButton, styles.cancelButton]} onPress={() => setConfirmLogoutVisible(false)}>
                <Text style={[styles.confirmModalButtonText, styles.cancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmModalButton, styles.logoutButton, { backgroundColor: colors.danger }]} onPress={() => { setConfirmLogoutVisible(false); logout(); }}>
                <Text style={[styles.confirmModalButtonText, styles.logoutButtonText]}>Sair</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de Deleção */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={[styles.confirmModalOverlay, { backgroundColor: darkMode ? colors.modalBackgroundDark : colors.modalBackgroundLight }]}>
          <View style={[styles.confirmModalView, { backgroundColor: darkMode ? colors.cardBackgroundDark : colors.cardBackgroundLight }]}>
            <Ionicons name="warning" size={40} color={colors.warning} />
            <Text style={[styles.confirmModalTitle, { color: darkMode ? colors.textDark : colors.textLight }]}>Ação Irreversível!</Text>
            <Text style={[styles.confirmModalText, { color: darkMode ? colors.textDark : colors.textLight }]}>Para confirmar, digite <Text style={{fontWeight: 'bold'}}>DELETAR</Text> no campo abaixo.</Text>
            <TextInput
              style={[styles.deleteInput, { borderColor: darkMode ? colors.divider : '#ccc', color: darkMode ? colors.textDark : colors.textLight, backgroundColor: darkMode ? colors.backgroundDark : '#fff' }]} 
              placeholder="DELETAR"
              placeholderTextColor={darkMode ? colors.textDark : '#999'}
              value={deleteConfirmationText}
              onChangeText={setDeleteConfirmationText}
              autoCapitalize="characters"
            />
            <View style={styles.confirmModalButtonContainer}>
              <TouchableOpacity style={[styles.confirmModalButton, styles.cancelButton]} onPress={() => setDeleteModalVisible(false)}>
                <Text style={[styles.confirmModalButtonText, styles.cancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.confirmModalButton,
                  styles.deleteConfirmButton,
                  { backgroundColor: colors.danger },
                  deleteConfirmationText.toUpperCase() !== 'DELETAR' && styles.buttonDisabled
                ]}
                onPress={confirmDeleteAccount}
                disabled={deleteConfirmationText.toUpperCase() !== 'DELETAR'}
              >
                <Text style={[styles.confirmModalButtonText, styles.logoutButtonText]}>Excluir Conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    padding: 10,
  },
  row: {
    justifyContent: 'space-around', // Distribui os itens uniformemente
  },
  card: {
    flex: 1,
    margin: 8, // Espaçamento reduzido para melhor visualização em grid
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 }, // Sombra mais pronunciada
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  cardImg: {
    width: 100,
    height: 100,
    marginBottom: 10,
    resizeMode: 'contain', // Garante que a imagem se ajuste sem cortar
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  // Estilos do Modal de Perfil
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: '100%',
  },
  modalButtonText: {
    marginLeft: 15,
    fontSize: 17,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 8,
  },
  // Estilos dos Modais de Confirmação (Logout e Deleção)
  confirmModalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmModalView: {
    width: '85%',
    maxWidth: 350, // Aumentado ligeiramente
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  confirmModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  confirmModalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24, // Melhorar legibilidade
  },
  confirmModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  confirmModalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  confirmModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  cancelButtonText: {
    color: '#424242',
  },
  logoutButton: {
    // Cor definida inline para o danger color
  },
  logoutButtonText: {
    color: 'white',
  },

  deleteConfirmButton: {
    // Cor definida inline para o danger color
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

