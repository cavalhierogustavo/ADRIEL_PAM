import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
// If you want to use a linear gradient, you would typically import it like this:
// import { LinearGradient } from 'expo-linear-gradient';

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
      // Sucesso! O AppNavigator cuida do redirecionamento.
      // Não precisamos fazer nada aqui.
    } else {
      // Se o login falhou, 'result' conterá a mensagem de erro.
      Alert.alert('Erro de Login', result);
    }
    
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardAvoidingContainer} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Using a simple View with a background color for now. For a true gradient, 'expo-linear-gradient' would be ideal. */}
      <View style={styles.backgroundContainer}>
        <View style={styles.overlay} /> {/* Subtle overlay for better text readability */}
        <View style={styles.container}>
          <Text style={styles.title}>Bem-vindo de volta!</Text>
          <Text style={styles.subtitle}>Sua jornada de saúde começa aqui.</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#BBDEFB"
          />
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholderTextColor="#BBDEFB"
          />
        
          {loading ? (
            <ActivityIndicator size="large" color="#FFFFFF" style={styles.activityIndicator} />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.registerLinkContainer} 
            onPress={() => navigation.navigate('Cadastro')}
          >
            <Text style={styles.registerLinkText}>
              Não tem uma conta? <Text style={styles.registerLinkTextBold}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#9fccffff', // A vibrant blue for health apps
    // For a gradient, you would replace this with LinearGradient component
    // For example: <LinearGradient colors={['#42A5F5', '#1976D2']} style={styles.backgroundContainer}>...</LinearGradient>
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)', // Subtle dark overlay
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },
  title: {
    fontSize: 38,
    fontWeight: '800',
    color: '#FFFFFF', // White text for contrast on blue background
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 19,
    color: '#E3F2FD', // Lighter blue/off-white for subtitle
    marginBottom: 50,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 58,
    borderColor: '#90CAF9', 
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent white for inputs
    fontSize: 17,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: '#1976D2', // Darker blue for button
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  activityIndicator: {
    marginTop: 30,
  },
  registerLinkContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  registerLinkText: {
    fontSize: 17,
    color: '#E3F2FD',
  },
  registerLinkTextBold: {
    fontWeight: '700',
    color: '#FFFFFF', // White for emphasis on link
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

