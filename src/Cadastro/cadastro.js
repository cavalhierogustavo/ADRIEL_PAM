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

export default function CadastroSaude({ navigation }) {
  // --- Estados do formulário original ---
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

  // --- Estados de controle da UI original ---
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

    // Campos originais mantidos
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

    // Processamento da foto original
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

      Alert.alert('Sucesso!', 'Cadastro realizado com sucesso. Bem-vindo ao seu app de saúde!');
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
      {/* Header com tema de saúde */}
      

      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Criar Conta</Text>
            <Text style={styles.formSubtitle}>Junte-se à nossa comunidade de saúde</Text>
          </View>

          {/* Seção de foto */}
          <View style={styles.photoSection}>
            <TouchableOpacity style={styles.photoButton} onPress={escolherFoto}>
              {foto ? (
                <Image source={{ uri: foto.uri }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoIcon}>📷</Text>
                  <Text style={styles.photoText}>Adicionar Foto</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Formulário com tema médico */}
          <View style={styles.formSections}>
            
            {/* Seção Pessoal */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>👤</Text>
                <Text style={styles.sectionTitle}>Informações Pessoais</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nome Completo *</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Digite seu nome completo" 
                  value={nome} 
                  onChangeText={setNome} 
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>E-mail *</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="seu@email.com" 
                  value={email} 
                  onChangeText={setEmail} 
                  keyboardType="email-address" 
                  autoCapitalize="none" 
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Data de Nascimento</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="DD/MM/AAAA" 
                  value={dataNascimento} 
                  onChangeText={setDataNascimento} 
                  keyboardType="numeric" 
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Senha *</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Crie uma senha segura" 
                  value={senha} 
                  onChangeText={setSenha} 
                  secureTextEntry 
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Seção Endereço */}
            <View style={styles.formSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>📍</Text>
                <Text style={styles.sectionTitle}>Endereço</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>CEP</Text>
                <View style={styles.cepInputContainer}>
                  <TextInput 
                    style={styles.cepInput} 
                    placeholder="00000-000" 
                    value={cep} 
                    onChangeText={setCep} 
                    keyboardType="numeric" 
                    maxLength={8} 
                    onBlur={buscarEnderecoPorCep}
                    placeholderTextColor="#9CA3AF"
                  />
                  {isLoadingCep && (
                    <ActivityIndicator size="small" color="#3B82F6" style={styles.loadingIndicator} />
                  )}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Logradouro</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Rua, Avenida, Travessa..." 
                  value={logradouro} 
                  onChangeText={setLogradouro} 
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Número</Text>
                  <TextInput 
                    ref={numeroInputRef}
                    style={styles.input} 
                    placeholder="123" 
                    value={numero} 
                    onChangeText={setNumero} 
                    keyboardType="numeric" 
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfInput]}>
                  <Text style={styles.inputLabel}>Estado</Text>
                  <TextInput 
                    style={styles.input} 
                    placeholder="SP" 
                    value={uf} 
                    onChangeText={setUf} 
                    maxLength={2} 
                    autoCapitalize="characters" 
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Bairro</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Seu bairro" 
                  value={bairro} 
                  onChangeText={setBairro} 
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Cidade</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Sua cidade" 
                  value={cidade} 
                  onChangeText={setCidade} 
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>
          </View>

          {/* Botão de cadastro com tema médico */}
          <TouchableOpacity 
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
            onPress={handleCadastro} 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitButtonIcon}>✨</Text>
                <Text style={styles.submitButtonText}>Criar Conta</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Link para login */}
          <TouchableOpacity 
            style={styles.loginLink} 
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginLinkText}>
              Já tem uma conta? <Text style={styles.loginLinkHighlight}>Entrar</Text>
            </Text>
          </TouchableOpacity>

          {/* Footer motivacional */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>💚 Cuidando da sua saúde com tecnologia</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header com tema de saúde
  headerContainer: {
    backgroundColor: '#3B82F6',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  healthIcon: {
    fontSize: 50,
    marginBottom: 10,
  },
  
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  scrollView: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 40,
  },

  formContainer: {
    marginHorizontal: 20,
  },

  formHeader: {
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },

  formTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },

  formSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },

  // Seção de foto
  photoSection: {
    alignItems: 'center',
    marginBottom: 25,
  },

  photoButton: {
    borderRadius: 50,
    overflow: 'hidden',
  },

  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#3B82F6',
  },

  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E5E7EB',
    borderWidth: 3,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },

  photoIcon: {
    fontSize: 24,
    marginBottom: 4,
  },

  photoText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Seções do formulário
  formSections: {
    marginBottom: 30,
  },

  formSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },

  sectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },

  inputGroup: {
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  cepInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },

  cepInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },

  loadingIndicator: {
    marginLeft: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfInput: {
    width: '48%',
  },

  // Botão de submit
  submitButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },

  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },

  submitButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },

  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Link para login
  loginLink: {
    alignItems: 'center',
    marginBottom: 30,
  },

  loginLinkText: {
    fontSize: 16,
    color: '#6B7280',
  },

  loginLinkHighlight: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  footerText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});