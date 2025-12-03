import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext'; 
import { useNavigation } from '@react-navigation/native';

// Ícones
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const MonitorCardiaco = () => {
  const [sistolica, setSistolica] = useState('');
  const [diastolica, setDiastolica] = useState('');
  const navigation = useNavigation();
  const [pulso, setPulso] = useState('');
  const [resultado, setResultado] = useState(null);
  const [historicoPressao, setHistoricoPressao] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  
  const { user } = useContext(AuthContext);
  const scrollViewRef = useRef(null);

  const fadeInAnimation = useRef(new Animated.Value(0)).current;
  const slideInAnimation = useRef(new Animated.Value(30)).current;

  const storageKey = user ? `cardiacoData_${user.id}` : null;

  useEffect(() => {
    const loadCardiacoData = async () => {
      if (storageKey) {
        try {
          const dadosSalvos = await AsyncStorage.getItem(storageKey);
          if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            setHistoricoPressao(dados.historicoPressao || []);
          }
        } catch (error) {
          console.log('Erro ao carregar dados do monitor:', error);
        }
      }
    };
    loadCardiacoData();
  }, [storageKey]);

  useEffect(() => {
    const saveCardiacoData = async () => {
      if (storageKey) {
        try {
          const dados = { historicoPressao };
          await AsyncStorage.setItem(storageKey, JSON.stringify(dados));
        } catch (error) {
          console.log('Erro ao salvar dados do monitor:', error);
        }
      }
    };
    saveCardiacoData();
  }, [historicoPressao, storageKey]);

  const getClassificacaoCardiaca = (sist, diast, puls) => {
    const s = parseFloat(sist);
    const d = parseFloat(diast);
    const p = parseFloat(puls);
    
    if (isNaN(s) || isNaN(d) || isNaN(p)) return null;
    
    let classificacao = '';
    let cor = '';
    let recomendacao = '';
    let icone = '';
    let gravidade = '';
    
    if (s < 90 || d < 60) {
      classificacao = 'Hipotensão Crítica';
      cor = '#7B1FA2';
      recomendacao = 'Pressão arterial baixa. Evite movimentos bruscos e procure ajuda médica.';
      icone = 'alert-octagon'; // 🆘
      gravidade = 'critica';
    } else if (s < 120 && d < 80) {
      classificacao = 'Pressão Ideal';
      cor = '#4CAF50';
      recomendacao = 'Excelente! Mantenha hábitos saudáveis e exercícios regulares.';
      icone = 'heart-check-outline'; // ✅ alternativo
      gravidade = 'ideal';
    } else if ((s >= 120 && s <= 129) && d < 80) {
      classificacao = 'Pressão Elevada';
      cor = '#FF9800';
      recomendacao = 'Considere adotar dieta com baixo teor de sal e exercícios.';
      icone = 'alert-circle-outline'; // ⚠️
      gravidade = 'atencao';
    } else if ((s >= 130 && s <= 139) || (d >= 80 && d <= 89)) {
      classificacao = 'Hipertensão Leve';
      cor = '#F97316';
      recomendacao = 'Consulte cardiologista para avaliação e possível tratamento.';
      icone = 'alert-circle-outline';
      gravidade = 'atencao';
    } else if (s >= 140 || d >= 90) {
      classificacao = 'Hipertensão Moderada';
      cor = '#D32F2F';
      recomendacao = 'Acompanhamento médico urgente é essencial.';
      icone = 'alert-octagram'; // 🚨
      gravidade = 'alerta';
    } else if (s > 180 || d > 120) {
      classificacao = 'Crise Hipertensiva';
      cor = '#B71C1C';
      recomendacao = 'PROCURE ATENDIMENTO MÉDICO IMEDIATO!';
      icone = 'ambulance';
      gravidade = 'emergencia';
    }
    
    let pulsoClassificacao = '';
    let pulsoCor = '';
    let pulsoIcone = '';
    
    if (p < 60) {
      pulsoClassificacao = 'Bradicardia (Lenta)';
      pulsoCor = '#7B1FA2';
      pulsoIcone = 'turtle'; // 🐌
    } else if (p <= 100) {
      pulsoClassificacao = 'Frequência Normal';
      pulsoCor = '#4CAF50';
      pulsoIcone = 'heart-pulse'; // 💚
    } else {
      pulsoClassificacao = 'Taquicardia (Rápida)';
      pulsoCor = '#D32F2F';
      pulsoIcone = 'run-fast'; // 🔥
    }
    
    return {
      classificacao, cor, recomendacao, icone, gravidade, sistolica: s, diastolica: d, pulso: p,
      pulsoClassificacao, pulsoCor, pulsoIcone
    };
  };

  const monitorarPressao = () => {
    const s = parseFloat(sistolica);
    const d = parseFloat(diastolica);
    const p = parseFloat(pulso);
    
    if (!sistolica || !diastolica || !pulso) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (s <= 0 || d <= 0 || p <= 0) {
      Alert.alert('Erro', 'Por favor, insira valores válidos (maiores que zero).');
      return;
    }
    
    if (s > 300 || d > 300 || p > 300) {
      Alert.alert('Erro', 'Por favor, insira valores realistas (máximo 300).');
      return;
    }
    
    const classificacao = getClassificacaoCardiaca(s, d, p);
    if (!classificacao) {
      Alert.alert('Erro', 'Não foi possível classificar os valores.');
      return;
    }
    
    const novoResultado = {
      id: Date.now().toString(),
      sistolica: s,
      diastolica: d,
      pulso: p,
      classificacao: classificacao.classificacao,
      cor: classificacao.cor,
      recomendacao: classificacao.recomendacao,
      icone: classificacao.icone,
      gravidade: classificacao.gravidade,
      pulsoClassificacao: classificacao.pulsoClassificacao,
      pulsoCor: classificacao.pulsoCor,
      pulsoIcone: classificacao.pulsoIcone,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setResultado(novoResultado);
    
    fadeInAnimation.setValue(0);
    slideInAnimation.setValue(30);
    Animated.parallel([
      Animated.timing(fadeInAnimation, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideInAnimation, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
    
    setHistoricoPressao(prevHistorico => {
      const novoHistorico = [novoResultado, ...prevHistorico].slice(0, 15);
      return novoHistorico;
    });

    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const limparDados = () => {
    setSistolica('');
    setDiastolica('');
    setPulso('');
    setResultado(null);
  };

  const limparHistorico = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja apagar todos os registros cardíacos?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: () => setHistoricoPressao([]) }
      ]
    );
  };

  const renderResultCard = () => {
    if (!resultado) return null;

    const { 
      classificacao, cor, recomendacao, icone, sistolica, diastolica, pulso, 
      pulsoClassificacao, pulsoCor, pulsoIcone 
    } = resultado;

    return (
      <Animated.View 
        style={[
          styles.resultBox, 
          { borderLeftColor: cor },
          { opacity: fadeInAnimation, transform: [{ translateY: slideInAnimation }] }
        ]}
      >
        <View style={styles.resultHeader}>
          <View style={[styles.resultIconContainer, { backgroundColor: cor + '1A' }]}>
            <MaterialCommunityIcons name={icone} size={20} color={cor} />
          </View>
          <Text style={[styles.resultTitle, { color: cor }]}>{classificacao}</Text>
        </View>

        <View style={styles.pressaoDisplay}>
          <View style={styles.pressaoCard}>
            <Text style={styles.pressaoLabel}>Sistólica</Text>
            <Text style={[styles.pressaoValue, { color: cor }]}>{sistolica} mmHg</Text>
          </View>
          <View style={styles.pressaoSeparator}>
            <Text style={styles.pressaoSeparatorText}>/</Text>
          </View>
          <View style={styles.pressaoCard}>
            <Text style={styles.pressaoLabel}>Diastólica</Text>
            <Text style={[styles.pressaoValue, { color: cor }]}>{diastolica} mmHg</Text>
          </View>
        </View>

        <View style={[styles.pulsoBox, { borderColor: pulsoCor }]}>
          <Text style={styles.pulsoLabel}>Frequência Cardíaca</Text>
          <Text style={[styles.pulsoValue, { color: pulsoCor }]}>{pulso} bpm</Text>
          <View style={styles.pulsoCategoryContainer}>
            <MaterialCommunityIcons name={pulsoIcone} size={12} color={pulsoCor} />
            <Text style={[styles.pulsoCategory, { color: pulsoCor }]}>
              {' '} {pulsoClassificacao}
            </Text>
          </View>
        </View>

        <Text style={styles.resultRecommendation}>{recomendacao}</Text>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sobre Pressão Cardíaca</Text>
            <View style={styles.infoSection}>
              <MaterialCommunityIcons name="water" size={16} color="#33691E" />
              <Text style={styles.infoText}>
                {' '}A pressão arterial mede a força do sangue nas artérias em mmHg.
              </Text>
            </View>
            <View style={styles.infoSection}>
              <MaterialCommunityIcons name="chart-line" size={16} color="#33691E" />
              <Text style={styles.infoText}>
                {' '}Valores normais: Sistólica 120 e Diastólica 80 em repouso.
              </Text>
            </View>
            <View style={styles.infoSection}>
              <FontAwesome5 name="exclamation-triangle" size={16} color="#33691E" />
              <Text style={styles.infoText}>
                {' '}Importante: Para diagnóstico e tratamento, sempre consulte seu cardiologista.
              </Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.modalButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
        {/* BOTÃO VOLTAR (100% PRESERVADO) */}
        <TouchableOpacity style={styles.voltarbtn} onPress={() => navigation.goBack()}>
          <Text style={styles.voltarbtnTxt}> VOLTAR </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <MaterialCommunityIcons name="heart-pulse" size={32} color="#0D47A1" />
            <Text style={styles.title}>Cardio Monitor</Text>
          </View>
          <Text style={styles.subtitle}>Monitoramento Cardiovascular Inteligente</Text>
        </View>

        <View style={styles.monitorCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Nova Avaliação</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.secondaryButton} onPress={limparDados}>
                <MaterialCommunityIcons name="delete" size={18} color="#0D47A1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setModalVisivel(true)}>
                <MaterialCommunityIcons name="help-circle" size={18} color="#0D47A1" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.inputField}>
              <Text style={styles.label}>Pressão Sistólica (mmHg)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={sistolica}
                  onChangeText={setSistolica}
                  placeholder="Ex: 120"
                  keyboardType="numeric"
                  maxLength={3}
                />
                <View style={styles.inputIcon}>
                  <MaterialCommunityIcons name="heart" size={18} color="#1976D2" />
                </View>
              </View>
            </View>

            <View style={styles.inputField}>
              <Text style={styles.label}>Pressão Diastólica (mmHg)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={diastolica}
                  onChangeText={setDiastolica}
                  placeholder="Ex: 80"
                  keyboardType="numeric"
                  maxLength={3}
                />
                <View style={styles.inputIcon}>
                  <MaterialCommunityIcons name="heart-outline" size={18} color="#1976D2" />
                </View>
              </View>
            </View>

            <View style={styles.inputField}>
              <Text style={styles.label}>Frequência Cardíaca (bpm)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={pulso}
                  onChangeText={setPulso}
                  placeholder="Ex: 72"
                  keyboardType="numeric"
                  maxLength={3}
                />
                <View style={styles.inputIcon}>
                  <FontAwesome5 name="heartbeat" size={18} color="#1976D2" />
                </View>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, (!sistolica || !diastolica || !pulso) && styles.buttonDisabled]}
              onPress={monitorarPressao}
              disabled={!sistolica || !diastolica || !pulso}
            >
              <Text style={styles.primaryButtonText}>Monitorar Cardíaco</Text>
            </TouchableOpacity>

            {resultado && renderResultCard()}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.toggleSection}
          onPress={() => setMostrarHistorico(!mostrarHistorico)}
        >
          <Ionicons name={mostrarHistorico ? "chevron-up" : "chevron-down"} size={16} color="#0D47A1" />
          <Text style={styles.toggleText}>
            Histórico Cardíaco ({historicoPressao.length})
          </Text>
          <Text style={styles.toggleAction}>
            {mostrarHistorico ? 'Ocultar' : 'Ver'}
          </Text>
        </TouchableOpacity>

        {mostrarHistorico && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>Registros Cardíacos</Text>
              {historicoPressao.length > 0 && (
                <TouchableOpacity onPress={limparHistorico}>
                  <Text style={styles.clearHistoryText}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.historyCard}>
              {historicoPressao.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="heart-pulse" size={24} color="#0D47A1" />
                  <Text style={styles.emptyText}>Nenhum registro ainda</Text>
                  <Text style={styles.emptySubtext}>Comece monitorando sua saúde cardíaca!</Text>
                </View>
              ) : (
                <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                  {historicoPressao.map((item) => (
                    <View key={item.id} style={[styles.historyItem, { borderLeftColor: item.cor }]}>
                      <View style={styles.historyContent}>
                        <View style={styles.historyHeader}>
                          <MaterialCommunityIcons name={item.icone} size={16} color={item.cor} />
                          <View style={styles.historyMain}>
                            <Text style={styles.historyValue}>
                              {item.sistolica}/{item.diastolica} mmHg
                            </Text>
                            <Text style={[styles.historyClassification, { color: item.cor }]}>
                              {item.classificacao}
                            </Text>
                          </View>
                          <Text style={styles.historyTime}>{item.data}, {item.hora}</Text>
                        </View>
                        <View style={styles.historyPulseContainer}>
                          <MaterialCommunityIcons name={item.pulsoIcone} size={12} color={item.pulsoCor} />
                          <Text style={[styles.historyPulse, { color: item.pulsoCor }]}>
                            {' '} {item.pulso} bpm ({item.pulsoClassificacao})
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        )}

        <View style={styles.referenceSection}>
          <Text style={styles.referenceTitle}>Valores de Referência</Text>
          <View style={styles.referenceCard}>
            <View style={styles.referenceItem}>
              <View style={styles.referenceHeader}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.referenceName}>Pressão Ideal</Text>
              </View>
              <Text style={styles.referenceValue}>Sistólica: 120 mmHg | Diastólica: 80 mmHg</Text>
            </View>
            
            <View style={styles.referenceItem}>
              <View style={styles.referenceHeader}>
                <MaterialCommunityIcons name="alert-circle" size={16} color="#F97316" />
                <Text style={styles.referenceName}>Hipertensão</Text>
              </View>
              <Text style={styles.referenceValue}>Sistólica: ≥140 mmHg | Diastólica: ≥90 mmHg</Text>
            </View>

            <View style={styles.referenceItem}>
              <View style={styles.referenceHeader}>
                <MaterialCommunityIcons name="heart-pulse" size={16} color="#4CAF50" />
                <Text style={styles.referenceName}>Pulso Normal</Text>
              </View>
              <Text style={styles.referenceValue}>60-100 bpm (adulto em repouso)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Estilos (sem emojis, ícones integrados)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 19,
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 20,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0D47A1',
    marginLeft: 8,
  },
  subtitle: {
    color: '#1976D2',
    fontSize: 15,
  },
  monitorCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#0D47A1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E3F2FD',
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D47A1',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B0BEC5',
  },
  formGroup: {
    padding: 16,
    gap: 16,
  },
  inputField: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0D47A1',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 52,
    backgroundColor: '#F0F8FF',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingRight: 50,
    fontSize: 16,
    color: '#455A64',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#0077B6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  resultBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderLeftWidth: 6,
    marginTop: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  resultIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D47A1',
  },
  pressaoDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 8,
  },
  pressaoCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B0BEC5',
  },
  pressaoSeparator: {
    paddingHorizontal: 8,
  },
  pressaoSeparatorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1976D2',
  },
  pressaoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1976D2',
    marginBottom: 4,
  },
  pressaoValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D47A1',
  },
  pulsoBox: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    marginVertical: 12,
  },
  pulsoLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#1976D2',
    marginBottom: 4,
  },
  pulsoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D47A1',
    marginBottom: 2,
  },
  pulsoCategoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  pulsoCategory: {
    fontSize: 10,
    fontWeight: '500',
    color: '#1976D2',
  },
  resultRecommendation: {
    fontSize: 14,
    color: '#0D47A1',
    lineHeight: 20,
    textAlign: 'center',
  },
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#0D47A1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#0D47A1',
    marginLeft: 8,
  },
  toggleAction: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '500',
  },
  historySection: {
    marginBottom: 16,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D47A1',
  },
  clearHistoryText: {
    fontSize: 14,
    color: '#F44336',
    fontWeight: '500',
  },
  historyCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 6,
  },
  emptyText: {
    fontSize: 16,
    color: '#455A64',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#1976D2',
  },
  historyList: {
    maxHeight: height * 0.4,
  },
  historyItem: {
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    borderLeftWidth: 4,
  },
  historyContent: {
    flex: 1,
    marginLeft: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  historyMain: {
    flex: 1,
  },
  historyValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D47A1',
  },
  historyClassification: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 1,
    color: '#1976D2',
  },
  historyTime: {
    fontSize: 11,
    color: '#455A64',
    fontWeight: '500',
  },
  historyPulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 26,
    marginTop: 4,
  },
  historyPulse: {
    fontSize: 12,
    color: '#B0BEC5',
  },
  referenceSection: {
    marginBottom: 24,
  },
  referenceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 16,
  },
  referenceCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
  },
  referenceItem: {
    marginBottom: 16,
  },
  referenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  referenceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0D47A1',
  },
  referenceValue: {
    fontSize: 13,
    color: '#1976D2',
    marginLeft: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(13, 71, 161, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    gap: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoSection: {
    backgroundColor: '#F1F8E9',
    borderLeftColor: '#33691E',
    borderLeftWidth: 4,
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#33691E',
    lineHeight: 20,
  },
  modalButton: {
    backgroundColor: '#0077B6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  voltarbtn: {
    position: 'absolute',
    top: 20,
    left: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
    zIndex: 10,
    width: 78,
    height: 30,
  },
  voltarbtnTxt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0D47A1',
  },
});

export default MonitorCardiaco;