// context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userString = await AsyncStorage.getItem('user');
        if (userString) {
          setUser(JSON.parse(userString));
        }
      } catch (e) {
        console.error("Falha ao carregar usuário do armazenamento", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserFromStorage();
  }, []);

  const login = async (email, senha) => {
    try {
      // Lembre-se de usar o IP correto da sua máquina!
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        senha,
      } );
      const userData = response.data.usuario;
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Erro no login (AuthContext):', error.response ? error.response.data : error.message);
      return error.response?.data?.message || 'Credenciais inválidas.';
    }
  };

  const logout = async () => {
    console.log("1. Função 'logout' no AuthContext foi chamada.");
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      console.log("2. 'setUser(null)' foi chamado e AsyncStorage foi limpo.");
    } catch (e) {
      console.error("Falha ao executar o logout:", e);
    }
  };

  const updateUser = async (newUserData) => {
    // Função para o futuro (Editar Perfil)
    try {
      setUser(newUserData);
      await AsyncStorage.setItem('user', JSON.stringify(newUserData));
    } catch(e) {
      console.error("Falha ao atualizar os dados do usuário:", e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
