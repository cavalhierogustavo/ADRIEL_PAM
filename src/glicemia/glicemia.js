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
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const AnalisadorGlicemico = () => {
  const navigation = useNavigation();
  const [glicemia, setGlicemia] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [resultado, setResultado] = useState(null);
  const [historicoGlicemia, setHistoricoGlicemia] = useState([]);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);
  const { user } = useContext(AuthContext);

  const storageKey = user ? `glicemicoData_${user.id}` : null;

  useEffect(() => {
    const loadGlicemicoData = async () => {
      if (storageKey) {
        try {
          const dadosSalvos = await AsyncStorage.getItem(storageKey);
          if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            setHistoricoGlicemia(dados.historicoGlicemia || []);
          }
        } catch (error) {
          console.log('Erro ao carregar dados do analisador:', error);
        }
      }
    };
    loadGlicemicoData();
  }, [storageKey]);

  useEffect(() => {
    const saveGlicemicoData = async () => {
      if (storageKey) {
        try {
          const dados = { historicoGlicemia };
          await AsyncStorage.setItem(storageKey, JSON.stringify(dados));
        } catch (error) {
          console.log('Erro ao salvar dados do analisador:', error);
        }
      }
    };
    saveGlicemicoData();
  }, [historicoGlicemia, storageKey]);

  const getClassificacaoGlicemica = (valor, modalidadeSelecionada) => {
    const val = parseFloat(valor);
    
    if (isNaN(val)) return null;
    
    switch (modalidadeSelecionada) {
      case 'Jejum':
        if (val < 70) {
          return {
            classificacao: 'Hipoglicemia Severa',
            cor: '#7B1FA2',
            recomendacao: 'Valor crítico baixo. Busque assistência médica imediatamente.',
            icone: '🆘',
            gravidade: 'critica'
          };
        } else if (val >= 70 && val <= 99) {
          return {
            classificacao: 'Normal Ideal',
            cor: '#4CAF50',
            recomendacao: 'Excelente! Mantenha hábitos alimentares saudáveis.',
            icone: '✅',
            gravidade: 'ideal'
          };
        } else if (val >= 100 && val <= 125) {
          return {
            classificacao: 'Pré-diabetes',
            cor: '#FF9800',
            recomendacao: 'Consulte endocrinologista para avaliação detalhada.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else {
          return {
            classificacao: 'Diabetes Mellitus',
            cor: '#D32F2F',
            recomendacao: 'Acompanhamento médico urgente é necessário.',
            icone: '🚨',
            gravidade: 'alerta'
          };
        }
        
      case '2h pós-refeição':
        if (val < 70) {
          return {
            classificacao: 'Hipoglicemia',
            cor: '#7B1FA2',
            recomendacao: 'Valor baixo após refeição. Procure ajuda médica.',
            icone: '🆘',
            gravidade: 'critica'
          };
        } else if (val < 140) {
          return {
            classificacao: 'Normal',
            cor: '#4CAF50',
            recomendacao: 'Valores excelentes para pós-refeição.',
            icone: '✅',
            gravidade: 'ideal'
          };
        } else if (val >= 140 && val <= 199) {
          return {
            classificacao: 'Pré-diabetes',
            cor: '#FF9800',
            recomendacao: 'Controle alimentar é recomendado.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else {
          return {
            classificacao: 'Diabetes Mellitus',
            cor: '#D32F2F',
            recomendacao: 'Ajuste terapêutico pode ser necessário.',
            icone: '🚨',
            gravidade: 'alerta'
          };
        }
        
      case 'Pré-refeição':
        if (val < 80) {
          return {
            classificacao: 'Hipoglicemia',
            cor: '#7B1FA2',
            recomendacao: 'Valor baixo. Consuma carboidrato antes da refeição.',
            icone: '🆘',
            gravidade: 'critica'
          };
        } else if (val >= 80 && val <= 130) {
          return {
            classificacao: 'Normal',
            cor: '#4CAF50',
            recomendacao: 'Valor ideal para início de refeição.',
            icone: '✅',
            gravidade: 'ideal'
          };
        } else if (val > 130 && val <= 180) {
          return {
            classificacao: 'Elevado',
            cor: '#FF9800',
            recomendacao: 'Considere ajuste alimentar antes da refeição.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else {
          return {
            classificacao: 'Muito Elevado',
            cor: '#D32F2F',
            recomendacao: 'Consulte médico urgentemente.',
            icone: '🚨',
            gravidade: 'alerta'
          };
        }
        
      case 'Aleatório':
        if (val < 70) {
          return {
            classificacao: 'Hipoglicemia',
            cor: '#7B1FA2',
            recomendacao: 'Valor baixo. Pode causar desmaios.',
            icone: '🆘',
            gravidade: 'critica'
          };
        } else if (val < 140) {
          return {
            classificacao: 'Normal',
            cor: '#4CAF50',
            recomendacao: 'Valor dentro da faixa normal.',
            icone: '✅',
            gravidade: 'ideal'
          };
        } else if (val >= 140 && val <= 199) {
          return {
            classificacao: 'Elevado',
            cor: '#FF9800',
            recomendacao: 'Valor acima do normal.',
            icone: '⚠️',
            gravidade: 'atencao'
          };
        } else {
          return {
            classificacao: 'Suspeito de Diabetes',
            cor: '#D32F2F',
            recomendacao: 'Triagem para diabetes necessária.',
            icone: '🚨',
            gravidade: 'alerta'
          };
        }
        
      default:
        return null;
    }
  };

  const analisarGlicemia = () => {
    const valor = parseFloat(glicemia);
    
    if (!valor || valor <= 0 || valor > 600) {
      Alert.alert('Erro', 'Por favor, insira um valor válido (1-600 mg/dL).');
      return;
    }
    
    if (!modalidade) {
      Alert.alert('Erro', 'Selecione o tipo de medição antes de continuar.');
      return;
    }
    
    const classificacao = getClassificacaoGlicemica(valor, modalidade);
    if (!classificacao) {
      Alert.alert('Erro', 'Não foi possível classificar o valor.');
      return;
    }
    
    const novoResultado = {
      id: Date.now().toString(),
      glicemia: valor,
      modalidade: modalidade,
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
      const novoHistorico = [novoResultado, ...prevHistorico].slice(0, 15);
      return novoHistorico;
    });
  };

  const limparDados = () => {
    setGlicemia('');
    setModalidade('');
    setResultado(null);
  };

  const limparHistorico = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja apagar todas as análises?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: () => setHistoricoGlicemia([]) }
      ]
    );
  };

  const modalidadesAnalise = [
    { label: 'Jejum', value: 'Jejum' },
    { label: '2h pós-refeição', value: '2h pós-refeição' },
    { label: 'Pré-refeição', value: 'Pré-refeição' },
    { label: 'Aleatório', value: 'Aleatório' },
  ];

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
            <Text style={styles.modalTitle}>🧬 Sobre Glicemia</Text>
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                💡 O nível de glicemia mede a quantidade de açúcar no sangue em mg/dL.
              </Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                📊 Valores variam conforme o momento da medição (jejum, pós-refeição, etc.).
              </Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                ⚠️ Importante: Para diagnóstico preciso, sempre consulte seu médico.
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <TouchableOpacity style={styles.voltarbtn} onPress={() => navigation.goBack()}>
                <Text style={styles.voltarbtnTxt}> VOLTAR </Text>
              </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <Text style={styles.titleIcon}>🩸</Text>
            <Text style={styles.title}>Glicemia Analyzer</Text>
          </View>
          <Text style={styles.subtitle}>Controle Metabólico Inteligente</Text>
        </View>

        <View style={styles.analysisCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>Nova Análise</Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.secondaryButton} onPress={limparDados}>
                <Text style={styles.secondaryButtonText}>🗑️</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setModalVisivel(true)}>
                <Text style={styles.secondaryButtonText}>❓</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.inputField}>
              <Text style={styles.label}>Glicemia (mg/dL)</Text>
              <TextInput
                style={styles.input}
                value={glicemia}
                onChangeText={setGlicemia}
                placeholder="Ex: 98"
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={styles.inputField}>
              <Text style={styles.label}>Modalidade de Medição</Text>
              <View style={styles.modalidadesContainer}>
                {modalidadesAnalise.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.modalidadeButton,
                      modalidade === item.value && { 
                        backgroundColor: '#7B1FA2',
                        borderColor: '#7B1FA2'
                      }
                    ]}
                    onPress={() => setModalidade(item.value)}
                  >
                    <Text style={[
                      styles.modalidadeButtonText,
                      modalidade === item.value && { 
                        color: 'white',
                        fontWeight: '600'
                      }
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.primaryButton, (!glicemia || !modalidade) && styles.buttonDisabled]}
              onPress={analisarGlicemia}
              disabled={!glicemia || !modalidade}
            >
              <Text style={styles.primaryButtonText}>🔬 Analisar Glicemia</Text>
            </TouchableOpacity>

            {resultado && (
              <View style={[styles.resultBox, { borderColor: resultado.cor }]}>
                <View style={styles.resultHeader}>
                  <Text style={styles.resultIcon}>{resultado.icone}</Text>
                  <Text style={[styles.resultTitle, { color: resultado.cor }]}>
                    {resultado.classificacao}
                  </Text>
                </View>
                
                <View style={styles.glicemiaDisplay}>
                  <Text style={[styles.glicemiaValue, { color: resultado.cor }]}>
                    {resultado.glicemia}
                  </Text>
                  <Text style={styles.glicemiaUnit}>mg/dL</Text>
                </View>
                
                <Text style={styles.resultDescription}>
                  {resultado.recomendacao}
                </Text>
                
                <View style={styles.resultBadge}>
                  <Text style={styles.resultType}>{resultado.modalidade}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity 
          style={styles.toggleSection}
          onPress={() => setMostrarHistorico(!mostrarHistorico)}
        >
          <Text style={styles.toggleIcon}>{mostrarHistorico ? '🔼' : '🔽'}</Text>
          <Text style={styles.toggleText}>
            Histórico de Análises ({historicoGlicemia.length})
          </Text>
          <Text style={styles.toggleAction}>
            {mostrarHistorico ? 'Ocultar' : 'Ver'}
          </Text>
        </TouchableOpacity>

        {mostrarHistorico && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>📋 Registros Metabólicos</Text>
              {historicoGlicemia.length > 0 && (
                <TouchableOpacity onPress={limparHistorico}>
                  <Text style={styles.clearHistoryText}>Limpar</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.historyCard}>
              {historicoGlicemia.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>🩸</Text>
                  <Text style={styles.emptyText}>Nenhuma análise ainda</Text>
                  <Text style={styles.emptySubtext}>Comece analisando sua glicemia!</Text>
                </View>
              ) : (
                <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                  {historicoGlicemia.map((item) => (
                    <View key={item.id} style={[styles.historyItem, { borderLeftColor: item.cor }]}>
                      <View style={styles.historyIndicator} />
                      <View style={styles.historyContent}>
                        <View style={styles.historyHeader}>
                          <Text style={styles.historyEmoji}>{item.icone}</Text>
                          <View style={styles.historyMain}>
                            <Text style={styles.historyValue}>
                              {item.glicemia} mg/dL
                            </Text>
                            <Text style={[styles.historyClassification, { color: item.cor }]}>
                              {item.classificacao}
                            </Text>
                          </View>
                          <Text style={styles.historyTime}>{item.data}, {item.hora}</Text>
                        </View>
                        <Text style={styles.historyType}>{item.modalidade}</Text>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        )}

        <View style={styles.referenceSection}>
          <Text style={styles.referenceTitle}>📊 Valores de Referência</Text>
          <View style={styles.referenceCard}>
            <View style={styles.referenceItem}>
              <View style={styles.referenceHeader}>
                <Text style={styles.referenceIcon}>🏥</Text>
                <Text style={styles.referenceName}>Jejum</Text>
              </View>
              <View style={styles.referenceValues}>
                <Text style={styles.referenceValue}>Normal: 70-99 mg/dL</Text>
                <Text style={styles.referenceValue}>Pré-diabetes: 100-125 mg/dL</Text>
                <Text style={styles.referenceValue}>Diabetes: ≥126 mg/dL</Text>
              </View>
            </View>
            
            <View style={styles.referenceItem}>
              <View style={styles.referenceHeader}>
                <Text style={styles.referenceIcon}>🍽️</Text>
                <Text style={styles.referenceName}>Pós-refeição (2h)</Text>
              </View>
              <View style={styles.referenceValues}>
                <Text style={styles.referenceValue}>Normal: 140 mg/dL</Text>
                <Text style={styles.referenceValue}>Pré-diabetes: 140-199 mg/dL</Text>
                <Text style={styles.referenceValue}>Diabetes: ≥200 mg/dL</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

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
  alignItems: 'center',
  paddingTop: 32,
  paddingBottom: 20,
  marginTop:19
},
titleGroup: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 6,
},
titleIcon: {
  fontSize: 32,
  marginRight: 8,
},
title: {
  fontSize: 28,
  fontWeight: '700',
  color: '#0D47A1',
},
subtitle: {
  color: '#1976D2',
  fontSize: 15,
},
analysisCard: {
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
  paddingHorizontal: 10,
  paddingVertical: 6,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#B0BEC5',
},
secondaryButtonText: {
  fontSize: 16,
  color: '#0D47A1',
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
input: {
  height: 52,
  backgroundColor: '#F0F8FF',
  borderWidth: 1,
  borderColor: '#B0BEC5',
  borderRadius: 10,
  paddingHorizontal: 16,
  fontSize: 16,
  color: '#455A64',
},
modalidadesContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
},
modalidadeButton: {
  paddingHorizontal: 14,
  paddingVertical: 10,
  backgroundColor: '#F0F8FF',
  borderWidth: 1,
  borderColor: '#B0BEC5',
  borderRadius: 10,
  flex: 1,
  minWidth: '45%',
  alignItems: 'center',
},
modalidadeButtonText: {
  fontSize: 13,
  fontWeight: '500',
  color: '#0D47A1',
  textAlign: 'center',
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
  borderColor: '#0077B6',
},
resultHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
  gap: 8,
},
resultIcon: {
  fontSize: 20,
},
resultTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#0D47A1',
},
glicemiaDisplay: {
  flexDirection: 'row',
  alignItems: 'baseline',
  justifyContent: 'center',
  marginVertical: 12,
  gap: 4,
},
glicemiaValue: {
  fontSize: 28,
  fontWeight: '700',
  color: '#0D47A1',
},
glicemiaUnit: {
  fontSize: 14,
  fontWeight: '500',
  color: '#1976D2',
},
resultDescription: {
  fontSize: 14,
  color: '#0D47A1',
  lineHeight: 20,
  textAlign: 'center',
  marginBottom: 8,
},
resultBadge: {
  alignSelf: 'flex-start',
  backgroundColor: '#E3F2FD',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 16,
},
resultType: {
  fontSize: 12,
  color: '#1976D2',
  fontWeight: '500',
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
toggleIcon: {
  fontSize: 16,
  marginRight: 8,
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
emptyIcon: {
  fontSize: 24,
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
  borderLeftColor: '#0077B6',
},
historyIndicator: {
  width: 0,
},
historyContent: {
  flex: 1,
  marginLeft: 4,
},
historyHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  marginBottom: 4,
},
historyEmoji: {
  fontSize: 16,
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
historyType: {
  fontSize: 12,
  color: '#B0BEC5',
  marginLeft: 26,
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
  marginBottom: 8,
  gap: 8,
},
referenceIcon: {
  fontSize: 18,
},
referenceName: {
  fontSize: 15,
  fontWeight: '600',
  color: '#0D47A1',
},
referenceValues: {
  marginLeft: 26,
  gap: 4,
},
referenceValue: {
  fontSize: 13,
  color: '#1976D2',
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
voltarbtn:{
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
  zIndex:10,
  width: 78,
  height: 30,
},

voltarbtnTxt:{
  fontSize: 14,
  fontWeight: 'bold',
  color: '#0D47A1',
},
});

export default AnalisadorGlicemico;