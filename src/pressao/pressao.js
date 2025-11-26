import React, { useState, useEffect, useContext, useRef } from 'react'; // 1. Importar useRef
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

const { width } = Dimensions.get('window');

const PressaoArterial = () => {
  const [sistolica, setSistolica] = useState('');
  const [diastolica, setDiastolica] = useState('');
  const [pulso, setPulso] = useState('');
  const [resultado, setResultado] = useState(null);
  const [historicoPressao, setHistoricoPressao] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState('');
  
  const { user } = useContext(AuthContext);

  // 2. Criar uma referência para o ScrollView
  const scrollViewRef = useRef(null);

const fadeInAnimation = useRef(new Animated.Value(0)).current;
const slideInAnimation = useRef(new Animated.Value(30)).current;

  const storageKey = user ? `pressaoData_${user.id}` : null;

  useEffect(() => {
    const loadPressaoData = async () => {
      if (storageKey) {
        try {
          const dadosSalvos = await AsyncStorage.getItem(storageKey);
          if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            setHistoricoPressao(dados.historicoPressao || []);
          }
        } catch (error) {
          console.log('Erro ao carregar dados da pressão:', error);
        }
      }
    };
    loadPressaoData();
  }, [storageKey]);

  useEffect(() => {
    const savePressaoData = async () => {
      if (storageKey) {
        try {
          const dados = { historicoPressao };
          await AsyncStorage.setItem(storageKey, JSON.stringify(dados));
        } catch (error) {
          console.log('Erro ao salvar dados da pressão:', error);
        }
      }
    };
    savePressaoData();
  }, [historicoPressao, storageKey]);

  const getClassificacaoPressao = (sist, diast, puls) => {
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
      classificacao = 'Hipotensão';
      cor = '#6B73FF';
      recomendacao = 'Pressão baixa. Evite mudanças bruscas de posição.';
      icone = '🔽';
      gravidade = 'atencao';
    } else if (s < 120 && d < 80) {
      classificacao = 'Normal';
      cor = '#10B981';
      recomendacao = 'Pressão ideal. Continue com hábitos saudáveis.';
      icone = '✅';
      gravidade = 'normal';
    } else if ((s >= 120 && s <= 129) && d < 80) {
      classificacao = 'Elevada';
      cor = '#F59E0B';
      recomendacao = 'Pressão elevada. Adote estilo de vida saudável.';
      icone = '⚠️';
      gravidade = 'atencao';
    } else if ((s >= 130 && s <= 139) || (d >= 80 && d <= 89)) {
      classificacao = 'Hipertensão Estágio 1';
      cor = '#F97316';
      recomendacao = 'Consulte seu médico para avaliação e acompanhamento.';
      icone = '⚠️';
      gravidade = 'atencao';
    } else if (s >= 140 || d >= 90) {
      classificacao = 'Hipertensão Estágio 2';
      cor = '#EF4444';
      recomendacao = 'Procure acompanhamento médico urgente.';
      icone = '🚨';
      gravidade = 'alerta';
    } else if (s > 180 || d > 120) {
      classificacao = 'Crise Hipertensiva';
      cor = '#DC2626';
      recomendacao = 'PROCURE ATENDIMENTO MÉDICO IMEDIATO!';
      icone = '🚨';
      gravidade = 'emergencia';
    }
    
    let pulsoClassificacao = '';
    let pulsoCor = '';
    let pulsoIcone = '';
    
    if (p < 60) {
      pulsoClassificacao = 'Bradicardia (Baixo)';
      pulsoCor = '#6B73FF';
      pulsoIcone = '🟦';
    } else if (p <= 100) {
      pulsoClassificacao = 'Normal';
      pulsoCor = '#10B981';
      pulsoIcone = '🟢';
    } else {
      pulsoClassificacao = 'Taquicardia (Alto)';
      pulsoCor = '#EF4444';
      pulsoIcone = '🔴';
    }
    
    return {
      classificacao, cor, recomendacao, icone, gravidade, sistolica: s, diastolica: d, pulso: p,
      pulsoClassificacao, pulsoCor, pulsoIcone
    };
  };

  const verificarPressao = () => {
    const s = parseFloat(sistolica);
    const d = parseFloat(diastolica);
    const p = parseFloat(pulso);
    
    if (!sistolica || !diastolica || !pulso) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
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
    
    const classificacao = getClassificacaoPressao(s, d, p);
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
      const novoHistorico = [novoResultado, ...prevHistorico].slice(0, 20);
      return novoHistorico;
    });

    // 4. Rolar para o topo após calcular
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const abrirModalInfo = (texto) => {
    setModalInfo(texto);
    setModalVisible(true);
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
          styles.resultCard, 
          { borderLeftColor: cor },
          { opacity: fadeInAnimation, transform: [{ translateY: slideInAnimation }] }
        ]}
      >
        <View style={styles.resultHeader}>
          <View style={[styles.resultIconContainer, { backgroundColor: cor + '1A' }]}>
            <Text style={styles.resultIcon}>{icone}</Text>
          </View>
          <Text style={[styles.resultTitle, { color: cor }]}>{classificacao}</Text>
        </View>

        <View style={styles.pressaoContainer}>
          <View style={styles.pressaoCard}>
            <Text style={styles.pressaoLabel}>Sistólica</Text>
            <Text style={[styles.pressaoValue, { color: cor }]}>{sistolica} mmHg</Text>
          </View>
          <View style={styles.pressaoCard}>
            <Text style={styles.pressaoLabel}>Diastólica</Text>
            <Text style={[styles.pressaoValue, { color: cor }]}>{diastolica} mmHg</Text>
          </View>
        </View>

        <View style={[styles.pulsoCard, { borderColor: pulsoCor + '33' }]}>
          <Text style={styles.pulsoLabel}>Frequência Cardíaca</Text>
          <Text style={[styles.pulsoValue, { color: pulsoCor }]}>{pulso} bpm</Text>
          <Text style={[styles.pulsoClassificacao, { color: pulsoCor }]}>
            {pulsoIcone} {pulsoClassificacao}
          </Text>
        </View>

        <Text style={styles.resultDescription}>{recomendacao}</Text>
      </Animated.View>
    );
  };

  const renderHistory = () => {
    if (historicoPressao.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📋</Text>
          <Text style={styles.emptyStateText}>Nenhum registro de pressão arterial encontrado.</Text>
        </View>
      );
    }

    return (
      <View style={styles.historyList}>
        {historicoPressao.map((item) => (
          <View key={item.id} style={[styles.historyItem, { borderLeftColor: item.cor }]}>
            <View style={styles.historyContent}>
              <View style={styles.historyMain}>
                <Text style={styles.historyValue}>
                  {item.sistolica}/{item.diastolica} mmHg
                </Text>
                <View style={styles.historyClassification}>
                  <Text style={styles.historyClassificationIcon}>{item.icone}</Text>
                  <Text style={[styles.historyClassificationText, { color: item.cor }]}>
                    {item.classificacao}
                  </Text>
                </View>
              </View>
              <View style={styles.historyPulso}>
                <Text style={[styles.historyPulsoText, { color: item.pulsoCor }]}>
                  {item.pulso} bpm ({item.pulsoClassificacao})
                </Text>
              </View>
              <View style={styles.historyMeta}>
                <Text style={styles.historyMetaIcon}>📅</Text>
                <Text style={styles.historyMetaText}>{item.data} às {item.hora}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Calculadora de Pressão Arterial</Text>
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={() => abrirModalInfo(
              'Esta calculadora classifica a pressão arterial e frequência cardíaca. Os valores são baseados em diretrizes médicas. Sempre consulte seu médico para diagnóstico e tratamento adequado.'
            )}
          >
            <Text style={styles.infoIcon}>ℹ️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 3. Atribuir a referência ao ScrollView */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Nova Medição</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pressão Sistólica (mmHg)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={sistolica}
                onChangeText={setSistolica}
                placeholder="Ex: 120"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={3}
              />
              <View style={styles.inputIcon}>
                <Text style={styles.inputIconText}>💓</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pressão Diastólica (mmHg)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={diastolica}
                onChangeText={setDiastolica}
                placeholder="Ex: 80"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={3}
              />
              <View style={styles.inputIcon}>
                <Text style={styles.inputIconText}>❤️</Text>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Frequência Cardíaca (bpm)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={pulso}
                onChangeText={setPulso}
                placeholder="Ex: 72"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={3}
              />
              <View style={styles.inputIcon}>
                <Text style={styles.inputIconText}>⚡</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.calculateButton} onPress={verificarPressao}>
            <Text style={styles.calculateButtonText}>Calcular Pressão</Text>
            <Text style={styles.calculateButtonIcon}>➡️</Text>
          </TouchableOpacity>
        </View>

        {resultado && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Resultado</Text>
            {renderResultCard()}
          </View>
        )}

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Histórico de Medições</Text>
          {renderHistory()}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>💡</Text>
            <Text style={styles.modalText}>{modalInfo}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// Seus estilos (styles) permanecem os mesmos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0D1C2E',
    lineHeight: 30,
    flex: 1,
  },
  infoButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  formSection: {
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D1C2E',
    lineHeight: 26,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    paddingLeft: 4,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 56,
    backgroundColor: '#F7F8FA',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingRight: 56,
    fontSize: 18,
    fontWeight: '500',
    color: '#0D1C2E',
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  inputIconText: {
    fontSize: 20,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: '#007AFF',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
  calculateButtonIcon: {
    fontSize: 18,
  },
  resultSection: {
    marginBottom: 32,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderLeftWidth: 6,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  resultIcon: {
    fontSize: 24,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  pressaoContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
  },
  pressaoCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  pressaoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  pressaoValue: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  pulsoCard: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F7F8FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    marginBottom: 20,
  },
  pulsoLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  pulsoValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 2,
  },
  pulsoClassificacao: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  resultDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
  },
  historySection: {
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyList: {
    gap: 16,
  },
  emptyState: {
    backgroundColor: '#F7F8FA',
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  historyContent: {
    flex: 1,
  },
  historyMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  historyValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0D1C2E',
    marginBottom: 4,
    marginRight: 8,
  },
  historyClassification: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  historyClassificationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  historyClassificationText: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyPulso: {
    marginBottom: 8,
  },
  historyPulsoText: {
    fontSize: 12,
    fontWeight: '500',
  },
  historyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyMetaIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  historyMetaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 32,
    borderRadius: 24,
    margin: 24,
    maxWidth: width - 48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 12,
  },
  modalIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default PressaoArterial;
