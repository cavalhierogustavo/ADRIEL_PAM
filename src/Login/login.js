import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator,TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha o email e a senha.');
      return;
    }
    setLoading(true); 
    
    const result = await login(email, senha);

    if (result === true) {

    } else {
      
      Alert.alert('Erro de Login', result);
    }
    
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
    <TouchableOpacity 
  style={styles.loginLinkContainer} 
  onPress={() => navigation.navigate('Cadastro')}
>
  <Text style={styles.loginLinkText}>
    Não tem uma conta? <Text style={styles.loginLinkTextBold}>Cadastre-se</Text>
  </Text>
</TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Entrar" onPress={handleLogin} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },

   loginLinkContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginLinkText: {
      fontSize: 14,
      color: '#5A6A7D',
  },
  loginLinkTextBold: {
      fontWeight: 'bold',
      color: '#2A72E6',
  }
});

export default LoginScreen;
