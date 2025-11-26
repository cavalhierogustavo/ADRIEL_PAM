import React, { useState, useEffect, useContext } from 'react';
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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext'; 

const { width } = Dimensions.get('window');

const Glicemia = () => {
  const [glicemia, setGlicemia] = useState('');
  const [tipo, setTipo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [historicoGlicemia, setHistoricoGlicemia] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState('');
  const { user } = useContext(AuthContext);

  const storageKey = user ? `glicemiaData_${user.id}` : null;

  useEffect(() => {
    const loadGlicemiaData = async () => {
      if (storageKey) {
        try {
          const dadosSalvos = await AsyncStorage.getItem(storageKey);
          if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            setHistoricoGlicemia(dados.historicoGlicemia || []);
          }
        } catch (error) {
          console.log('Erro ao carregar dados da glicemia:', error);
        }
      }
    };
    loadGlicemiaData();
  }, [storageKey]);

  useEffect(() => {
    const saveGlicemiaData = async () => {
      if (storageKey) {
        try {
          const dados = { historicoGlicemia };
          await AsyncStorage.setItem(storageKey, JSON.stringify(dados));
        } catch (error) {
          console.log('Erro ao salvar dados da glicemia:', error);
        }
      }
    };
    saveGlicemiaData();
  }, [historicoGlicemia, storageKey]);

  const getClassificacaoGlicemia = (valor, tipoSelecionado) => {
    const val = parseFloat(valor);
    
    if (isNaN(val)) return null;
    
    switch (tipoSelecionado) {
      case 'Em jejum':
        if (val < 70) {
          return {
            classificacao: 'Hipoglicemia',
            cor: '#F97316',
            recomendacao: 'Valor baixo. Consuma carboidratos de ação rápida.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else if (val >= 70 && val <= 99) {
          return {
            classificacao: 'Normal',
            cor: '#10B981',
            recomendacao: 'Valor ideal. Continue com os hábitos saudáveis.',
            icone: '✅',
            gravidade: 'normal'
          };
        } else if (val >= 100 && val <= 125) {
          return {
            classificacao: 'Pré-diabetes',
            cor: '#F97316',
            recomendacao: 'Atenção! Consulte seu médico para avaliação.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else {
          return {
            classificacao: 'Diabetes',
            cor: '#EC4899',
            recomendacao: 'Procure acompanhamento médico urgente.',
            icone: '🚨',
            gravidade: 'alerta'
          };
        }
        
      case '2h após refeição':
        if (val < 70) {
          return {
            classificacao: 'Hipoglicemia',
            cor: '#F97316',
            recomendacao: 'Valor baixo. Consuma carboidratos de ação rápida.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else if (val < 140) {
          return {
            classificacao: 'Normal',
            cor: '#10B981',
            recomendacao: 'Valor ideal. Continue com os hábitos saudáveis.',
            icone: '✅',
            gravidade: 'normal'
          };
        } else if (val >= 140 && val <= 199) {
          return {
            classificacao: 'Pré-diabetes',
            cor: '#F97316',
            recomendacao: 'Atenção! Consulte seu médico para avaliação.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else {
          return {
            classificacao: 'Diabetes',
            cor: '#EC4899',
            recomendacao: 'Procure acompanhamento médico urgente.',
            icone: '🚨',
            gravidade: 'alerta'
          };
        }
        
      case 'Antes da refeição':
        if (val < 80) {
          return {
            classificacao: 'Hipoglicemia',
            cor: '#F97316',
            recomendacao: 'Valor baixo. Consuma carboidratos antes da refeição.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else if (val >= 80 && val <= 130) {
          return {
            classificacao: 'Normal',
            cor: '#10B981',
            recomendacao: 'Valor ideal para antes da refeição.',
            icone: '✅',
            gravidade: 'normal'
          };
        } else if (val > 130 && val <= 180) {
          return {
            classificacao: 'Elevada',
            cor: '#F97316',
            recomendacao: 'Valores elevados. Evite alimentos ricos em açúcar.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else {
          return {
            classificacao: 'Muito Elevada',
            cor: '#EC4899',
            recomendacao: 'Procure acompanhamento médico urgente.',
            icone: '🚨',
            gravidade: 'alerta'
          };
        }
        
      case 'Aleatório':
        if (val < 70) {
          return {
            classificacao: 'Hipoglicemia',
            cor: '#F97316',
            recomendacao: 'Valor baixo. Consuma carboidratos de ação rápida.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else if (val < 140) {
          return {
            classificacao: 'Normal',
            cor: '#10B981',
            recomendacao: 'Valor dentro da normalidade.',
            icone: '✅',
            gravidade: 'normal'
          };
        } else if (val >= 140 && val <= 199) {
          return {
            classificacao: 'Elevada',
            cor: '#F97316',
            recomendacao: 'Atenção! Consulte seu médico para avaliação.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else {
          return {
            classificacao: 'Suspeito de Diabetes',
            cor: '#EC4899',
            recomendacao: 'Procure acompanhamento médico urgente.',
            icone: '🚨',
            gravidade: 'alerta'
          };
        }
        
      default:
        return null;
    }
  };

  const verificarGlicemia = () => {
    const valor = parseFloat(glicemia);
    
    if (!valor || valor <= 0 || valor > 600) {
      Alert.alert('Erro', 'Por favor, insira um valor válido de glicemia (1-600 mg/dL).');
      return;
    }
    
    if (!tipo) {
      Alert.alert('Erro', 'Por favor, selecione o tipo de medição.');
      return;
    }
    
    const classificacao = getClassificacaoGlicemia(valor, tipo);
    if (!classificacao) {
      Alert.alert('Erro', 'Não foi possível classificar o valor.');
      return;
    }
    
    const novoResultado = {
      id: Date.now().toString(),
      glicemia: valor,
      tipo: tipo,
      classificacao: classificacao.classificacao,
      cor: classificacao.cor,
      recomendacao: classificacao.recomendacao,
      icone: classificacao.icone,
      gravidade: classificacao.gravidade,
      data: new Date().toLocaleDateString('pt-BR'),
      hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setResultado(novoResultado);
    
    setHistoricoGlicemia(prevHistorico => {
      const novoHistorico = [novoResultado, ...prevHistorico].slice(0, 20);
      return novoHistorico;
    });
  };

  const abrirModalInfo = (texto) => {
    setModalInfo(texto);
    setModalVisible(true);
  };

  const tiposGlicemia = [
    { label: 'Em jejum', value: 'Em jejum' },
    { label: '2h após refeição', value: '2h após refeição' },
    { label: 'Antes da refeição', value: 'Antes da refeição' },
    { label: 'Aleatório', value: 'Aleatório' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calculadora de Glicemia</Text>
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={() => abrirModalInfo(
            'Esta calculadora fornece orientações baseadas nos valores de referência de glicemia. Sempre consulte seu médico para diagnóstico e tratamento adequado.'
          )}
        >
          <Text style={styles.infoIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={styles.sectionTitle}>Nova Medição</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Glicemia (mg/dL)</Text>
            <TextInput
              style={styles.input}
              value={glicemia}
              onChangeText={setGlicemia}
              placeholder="Ex: 95"
              keyboardType="numeric"
              maxLength={5}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tipo de Medição</Text>
            <View style={styles.tiposContainer}>
              {tiposGlicemia.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.tipoButton,
                    tipo === item.value && styles.tipoButtonActive
                  ]}
                  onPress={() => setTipo(item.value)}
                >
                  <Text style={[
                    styles.tipoButtonText,
                    tipo === item.value && styles.tipoButtonTextActive
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={verificarGlicemia}>
            <Text style={styles.buttonText}>Verificar Glicemia</Text>
          </TouchableOpacity>
        </View>

        {resultado && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Resultado</Text>
            <View style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <Text style={[styles.resultIcon, { color: resultado.cor }]}>
                  {resultado.icone}
                </Text>
                <Text style={[styles.resultTitle, { color: resultado.cor }]}>
                  {resultado.classificacao}
                </Text>
              </View>
              
              <View style={styles.glicemiaValueContainer}>
                <Text style={[styles.glicemiaValue, { color: resultado.cor }]}>
                  {resultado.glicemia} mg/dL
                </Text>
              </View>
              
              <Text style={styles.resultDescription}>
                {resultado.recomendacao}
              </Text>
              
              <Text style={styles.resultType}>
                {resultado.tipo}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Histórico</Text>
          {historicoGlicemia.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                Nenhuma medição registrada ainda
              </Text>
            </View>
          ) : (
            historicoGlicemia.map((item) => (
              <View key={item.id} style={styles.historyItem}>
                <View style={[styles.historyIndicator, { backgroundColor: item.cor }]} />
                <View style={styles.historyContent}>
                  <View style={styles.historyMain}>
                    <Text style={styles.historyValue}>
                      {item.glicemia} mg/dL
                    </Text>
                    <Text style={styles.historyClassification}>
                      {item.icone} {item.classificacao}
                    </Text>
                  </View>
                  <Text style={styles.historyMeta}>
                    {item.tipo} • {item.data}, {item.hora}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalInfo}</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A202C',
    lineHeight: 34,
  },
  infoButton: {
    padding: 8,
  },
  infoIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
    padding: 24,
  },
  formSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A202C',
    lineHeight: 26,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A202C',
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A0AEC0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1A202C',
  },
  tiposContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tipoButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A0AEC0',
    borderRadius: 12,
  },
  tipoButtonActive: {
    backgroundColor: '#6B46C1',
    borderColor: '#6B46C1',
  },
  tipoButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A202C',
  },
  tipoButtonTextActive: {
    color: '#FFFFFF',
  },
  button: {
    height: 56,
    backgroundColor: '#6B46C1',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  resultSection: {
    marginBottom: 32,
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    shadowColor: '#1A202C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  glicemiaValueContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  glicemiaValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  resultDescription: {
    fontSize: 16,
    color: '#1A202C',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  resultType: {
    fontSize: 14,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  historySection: {
    marginBottom: 32,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#A0AEC0',
  },
  historyItem: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#1A202C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  historyIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 16,
  },
  historyContent: {
    flex: 1,
  },
  historyMain: {
    marginBottom: 4,
  },
  historyValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1A202C',
    marginBottom: 4,
  },
  historyClassification: {
    fontSize: 14,
    fontWeight: '500',
  },
  historyMeta: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 12,
    margin: 24,
    maxWidth: width - 48,
  },
  modalText: {
    fontSize: 16,
    color: '#1A202C',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});

export default Glicemia;