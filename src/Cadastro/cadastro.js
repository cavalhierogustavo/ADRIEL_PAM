import React, { useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CadastroScreen({ navigation }) {
  // --- Estados do formulário ---
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [foto, setFoto] = useState(null);

  // --- Estados de controle da UI ---
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numeroInputRef = useRef(null);

  const limparCamposEndereco = () => {
    setLogradouro('');
    setBairro('');
    setCidade('');
    setUf('');
  };

  const buscarEnderecoPorCep = async () => {
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      if (cepLimpo.length > 0) {
        Alert.alert('Erro', 'O CEP deve conter 8 dígitos.');
      }
      return;
    }

    setIsLoadingCep(true);
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = response.data;

      if (data.erro) {
        Alert.alert('CEP não encontrado', 'Por favor, verifique o CEP digitado.');
        limparCamposEndereco();
      } else {
        setLogradouro(data.logradouro || '');
        setBairro(data.bairro || '');
        setCidade(data.localidade || '');
        setUf(data.uf || '');
        numeroInputRef.current?.focus();
      }
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error);
      Alert.alert('Erro na busca', 'Não foi possível buscar o CEP.');
    } finally {
      setIsLoadingCep(false);
    }
  };

  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar sua galeria de fotos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFoto(result.assets[0]);
    }
  };

  const handleCadastro = async () => {
    const apiUrl = 'http://127.0.0.1:8000/api/cadastro';

    if (!nome || !email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha os campos obrigatórios: Nome, E-mail e Senha.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();

    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('senha', senha);
    formData.append('data_nascimento', dataNascimento);
    formData.append('cep', cep);
    formData.append('logradouro', logradouro);
    formData.append('numero', numero);
    formData.append('bairro', bairro);
    formData.append('cidade', cidade);
    formData.append('uf', uf);

    if (foto) {
      try {
        const response = await fetch(foto.uri);
        const blob = await response.blob();
        const filename = foto.uri.split('/').pop();
        formData.append('foto', blob, filename);
      } catch (e) {
        console.error("Erro ao processar a imagem: ", e);
        Alert.alert("Erro", "Não foi possível processar a imagem para upload.");
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Sucesso!', 'Cadastro realizado com sucesso. Você será redirecionado.');
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);

    } catch (error) {
      console.error('Erro no cadastro:', error.response ? error.response.data : error.message);
      let errorMessage = 'Não foi possível completar o cadastro. Tente novamente.';
      if (error.response && error.response.data) {
        const errors = error.response.data.errors || error.response.data;
        errorMessage = Object.keys(errors).map(key => errors[key][0]).join('\n');
      }
      Alert.alert('Erro no Cadastro', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.backgroundContainer}>
        <View style={styles.overlay} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Crie sua Conta</Text>
            <Text style={styles.subtitle}>Sua jornada de saúde começa aqui.</Text>

            {/* Bloco de seleção de imagem */}
            <View style={styles.imagePickerContainer}>
              <TouchableOpacity onPress={escolherFoto}>
                {foto ? (
                  <Image source={{ uri: foto.uri }} style={styles.profileImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>📷 Escolher Foto</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            {/* Inputs de texto */}
            <TextInput
              style={styles.input}
              placeholder="Nome Completo"
              value={nome}
              onChangeText={setNome}
              placeholderTextColor="#BBDEFB"
            />

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
              placeholder="Data de Nascimento (DD/MM/AAAA)"
              value={dataNascimento}
              onChangeText={setDataNascimento}
              keyboardType="numeric"
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

            <View style={styles.divider} />

            {/* Endereço */}
            <View style={styles.cepContainer}>
              <TextInput
                style={styles.cepInput}
                placeholder="CEP"
                value={cep}
                onChangeText={setCep}
                keyboardType="numeric"
                maxLength={8}
                onBlur={buscarEnderecoPorCep}
                placeholderTextColor="#BBDEFB"
              />
              {isLoadingCep && <ActivityIndicator size="small" color="#FFFFFF" style={styles.cepLoader} />}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Logradouro"
              value={logradouro}
              onChangeText={setLogradouro}
              placeholderTextColor="#BBDEFB"
            />

            <TextInput
              ref={numeroInputRef}
              style={styles.input}
              placeholder="Número"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
              placeholderTextColor="#BBDEFB"
            />

            <TextInput
              style={styles.input}
              placeholder="Bairro"
              value={bairro}
              onChangeText={setBairro}
              placeholderTextColor="#BBDEFB"
            />

            <TextInput
              style={styles.input}
              placeholder="Cidade"
              value={cidade}
              onChangeText={setCidade}
              placeholderTextColor="#BBDEFB"
            />

            <TextInput
              style={styles.input}
              placeholder="Estado (UF)"
              value={uf}
              onChangeText={setUf}
              maxLength={2}
              autoCapitalize="characters"
              placeholderTextColor="#BBDEFB"
            />

            {/* Botão de Cadastrar */}
            {isSubmitting ? (
              <ActivityIndicator size="large" color="#FFFFFF" style={styles.activityIndicator} />
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                <Text style={styles.buttonText}>Cadastrar</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.loginLinkContainer}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginLinkText}>
                Já tem uma conta? <Text style={styles.loginLinkTextBold}>Faça login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  backgroundContainer: {
    flex: 1,
    backgroundColor: '#9fccffff', // Mesmo azul vibrante da tela de login
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)', // Overlay sutil
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 30,
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
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 19,
    color: '#E3F2FD',
    marginBottom: 30,
    textAlign: 'center',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    width: '100%',
    height: 58,
    borderColor: '#90CAF9',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    fontSize: 17,
    color: '#333333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cepContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderColor: '#90CAF9',
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cepInput: {
    flex: 1,
    fontSize: 17,
    color: '#333333',
  },
  cepLoader: {
    marginLeft: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 15,
  },
  button: {
    width: '100%',
    height: 60,
    backgroundColor: '#1976D2',
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
  loginLinkContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  loginLinkText: {
    fontSize: 17,
    color: '#E3F2FD',
  },
  loginLinkTextBold: {
    fontWeight: '700',
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});
