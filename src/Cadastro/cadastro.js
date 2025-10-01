import React, { useState, useRef } from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function cadastro({ navigation }) {
  
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

    if (!nome || !email || !senha ) {
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
    <SafeAreaView style={styles.container}>
  <ScrollView contentContainerStyle={styles.scrollView}>
    
    <View style={styles.card}> 
      <Text style={styles.title}>Crie sua Conta</Text>
      <Text style={styles.subtitle}>Comece a cuidar da sua saúde hoje mesmo.</Text>

      
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity onPress={escolherFoto}>
          {foto ? (
            <Image source={{ uri: foto.uri }} style={styles.profileImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.imagePlaceholderText}>Escolher Foto</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      
      <Text style={styles.label}>Nome Completo</Text>
      <TextInput style={styles.input} placeholder="Digite seu nome completo" value={nome} onChangeText={setNome} placeholderTextColor="#999" />
      
      <Text style={styles.label}>E-mail</Text>
      <TextInput style={styles.input} placeholder="exemplo@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#999"/>

      <Text style={styles.label}>Data de Nascimento</Text>
      <TextInput style={styles.input} placeholder="DD/MM/AAAA" value={dataNascimento} onChangeText={setDataNascimento} keyboardType="numeric" placeholderTextColor="#999"/>

      <Text style={styles.label}>Senha</Text>
      <TextInput style={styles.input} placeholder="Crie uma senha forte" value={senha} onChangeText={setSenha} secureTextEntry placeholderTextColor="#999"/>
      
      <View style={styles.divider} />

      
      <Text style={styles.label}>CEP</Text>
      <View style={styles.cepContainer}>
        <TextInput style={styles.cepInput} placeholder="Digite seu CEP" value={cep} onChangeText={setCep} keyboardType="numeric" maxLength={8} onBlur={buscarEnderecoPorCep} placeholderTextColor="#999"/>
        {isLoadingCep && <ActivityIndicator size="small" color="#2A72E6" />}
      </View>

      <Text style={styles.label}>Logradouro</Text>
      <TextInput style={styles.input} placeholder="Rua, Avenida..." value={logradouro} onChangeText={setLogradouro} placeholderTextColor="#999"/>

      <Text style={styles.label}>Número</Text>
      <TextInput ref={numeroInputRef} style={styles.input} placeholder="Digite o número" value={numero} onChangeText={setNumero} keyboardType="numeric" placeholderTextColor="#999"/>

      <Text style={styles.label}>Bairro</Text>
      <TextInput style={styles.input} placeholder="Seu bairro" value={bairro} onChangeText={setBairro} placeholderTextColor="#999"/>

      <Text style={styles.label}>Cidade</Text>
      <TextInput style={styles.input} placeholder="Sua cidade" value={cidade} onChangeText={setCidade} placeholderTextColor="#999"/>
      
      <Text style={styles.label}>Estado (UF)</Text>
      <TextInput style={styles.input} placeholder="Seu estado" value={uf} onChangeText={setUf} maxLength={2} autoCapitalize="characters" placeholderTextColor="#999"/>

      
      <TouchableOpacity 
        style={[styles.button, isSubmitting && styles.buttonDisabled]} 
        onPress={handleCadastro} 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      </TouchableOpacity>
      

      <TouchableOpacity style={styles.loginLinkContainer} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLinkText}>
          Já tem uma conta? <Text style={styles.loginLinkTextBold}>Faça login</Text>
        </Text>
      </TouchableOpacity>
      
    </View>
  </ScrollView>
</SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A2E44',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#5A6A7D',
    textAlign: 'center',
    marginBottom: 25,
  },
  label: {
    fontSize: 14,
    color: '#1A2E44',
    marginBottom: 8,
    marginTop: 12,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 48,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E0E7EE',
    color: '#1A2E44',
  },
  cepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F8FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E7EE',
  },
  cepInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#1A2E44',
  },
  button: {
    backgroundColor: '#2A72E6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 25,
  },
  buttonDisabled: {
    backgroundColor: '#A9C4F5',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E7EE',
    marginVertical: 20,
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
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#2A72E6',
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E7EE',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#A9C4F5',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    color: '#5A6A7D',
    textAlign: 'center',
  },
});

