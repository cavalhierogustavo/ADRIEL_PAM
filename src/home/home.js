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
  TextInput, // <-- IMPORTAR TextInput
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios'; // <-- IMPORTAR axios

// Seus dados e imagens locais
const localImages = { remedio: require("../../assets/copo.png"), /* ... */ };
const data = [ { id: "1", title: "Hidrômetro", img: localImages.remedio, screen: "Aguinha" }, /* ... */ 
{ id: "2", title: "imc", img: localImages.remedio, screen: "IMC" },
{ id: "3", title: "glisemia", img: localImages.remedio, screen: "glise" },
{ id: "4", title: "pressao", img: localImages.remedio, screen: "pressao" },
];

export default function Home() {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);

  // --- ESTADOS ---
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [confirmLogoutVisible, setConfirmLogoutVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const animationValues = useRef(data.map(() => new Animated.Value(0))).current;

  // --- EFFECTS ---
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setProfileModalVisible(true)} style={{ marginRight: 15 }}>
          <Ionicons name="person-circle-outline" size={32} color={darkMode ? "#fff" : "#000"} />
        </TouchableOpacity>
      ),
      headerTitle: `Bem-vindo, ${user?.nome}`,
      headerTitleStyle: { color: darkMode ? '#fff' : '#000' },
      headerStyle: { backgroundColor: darkMode ? '#1E1E1E' : '#f0f8ff' }
    });
  }, [navigation, darkMode, user]);

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
  }, []);

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
    if (deleteConfirmationText !== 'DELETAR') {
      Alert.alert('Confirmação Incorreta', 'Você deve digitar "DELETAR" para confirmar.');
      return;
    }

    const apiUrl = `http://127.0.0.1:8000/api/usuarios/${user.id}`; // Lembre-se de usar seu IP

    try {
      await axios.delete(apiUrl );
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
    const translateY = animationValues[index].interpolate({ inputRange: [0, 1], outputRange: [30, 0] });
    const opacity = animationValues[index];
    return (
      <Animated.View style={{ transform: [{ translateY }], opacity, flex: 1 }}>
        <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={() => navigation.navigate(item.screen)}>
          <Image source={item.img} style={styles.cardImg} />
          <Text style={styles.cardText}>{item.title}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? "#1E1E1E" : "#f0f8ff" }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />

      {/* Modal de Perfil */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setProfileModalVisible(false)}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.modalButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={22} color="#333" />
              <Text style={styles.modalButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={22} color="#e74c3c" />
              <Text style={[styles.modalButtonText, { color: '#e74c3c' }]}>Sair</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.modalButton} onPress={handleDeleteAccount}>
              <Ionicons name="trash-outline" size={22} color="#800000" />
              <Text style={[styles.modalButtonText, { color: '#800000' }]}>Deletar Conta</Text>
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
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalView}>
            <Text style={styles.confirmModalTitle}>Confirmar Saída</Text>
            <Text style={styles.confirmModalText}>Você tem certeza que deseja se desconectar?</Text>
            <View style={styles.confirmModalButtonContainer}>
              <TouchableOpacity style={[styles.confirmModalButton, styles.cancelButton]} onPress={() => setConfirmLogoutVisible(false)}>
                <Text style={[styles.confirmModalButtonText, styles.cancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmModalButton, styles.logoutButton]} onPress={() => { setConfirmLogoutVisible(false); logout(); }}>
                <Text style={[styles.confirmModalButtonText, styles.logoutButtonText]}>Sim, Sair</Text>
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
        <View style={styles.confirmModalOverlay}>
          <View style={styles.confirmModalView}>
            <Ionicons name="warning" size={40} color="#d9534f" />
            <Text style={styles.confirmModalTitle}>Ação Irreversível!</Text>
            <Text style={styles.confirmModalText}>Para confirmar, digite <Text style={{fontWeight: 'bold'}}>DELETAR</Text> no campo abaixo.</Text>
            <TextInput
              style={styles.deleteInput}
              placeholder="DELETAR"
              value={deleteConfirmationText}
              onChangeText={setDeleteConfirmationText}
              autoCapitalize="characters"
            />
            <View style={styles.confirmModalButtonContainer}>
              <TouchableOpacity style={[styles.confirmModalButton, styles.cancelButton]} onPress={() => setDeleteModalVisible(false)}>
                <Text style={[styles.confirmModalButtonText, styles.cancelButtonText]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmModalButton, styles.deleteConfirmButton, deleteConfirmationText !== 'DELETAR' && styles.buttonDisabled]}
                onPress={confirmDeleteAccount}
                disabled={deleteConfirmationText !== 'DELETAR'}
              >
                <Text style={[styles.confirmModalButtonText, styles.logoutButtonText]}>Confirmar Exclusão</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Estilos (certifique-se de que todos os estilos que definimos antes estão aqui)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  confirmModalOverlay: {
    flex: 1,
    justifyContent: 'center', // Centraliza verticalmente
    alignItems: 'center',     // Centraliza horizontalmente
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo mais escuro
  },
  confirmModalView: {
    width: '85%',
    maxWidth: 320,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  confirmModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  confirmModalText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  confirmModalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmModalButton: {
    flex: 1, // Faz os botões dividirem o espaço
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5, // Espaçamento entre os botões
  },
  confirmModalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButtonText: {
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
  },
  logoutButtonText: {
    color: 'white',
  },
  grid: {
    padding: 10,
  },
  card: {
    flex: 1,
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardImg: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalView: {
    marginRight: 10,
    marginTop: 60,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 200,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  modalButtonText: {
    marginLeft: 15,
    fontSize: 18,
    color: '#333',
  },
divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 5,
  },
  deleteInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#333',
  },
  deleteConfirmButton: {
    backgroundColor: '#d9534f',
  },
  buttonDisabled: {
    backgroundColor: '#aaa',
  },
});
