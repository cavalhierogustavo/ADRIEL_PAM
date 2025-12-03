import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Alert, Modal, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext'; 
import { useNavigation } from '@react-navigation/native';
const { width, height } = Dimensions.get('window');

function CalculadoraMetabolica() {
  const { user } = useContext(AuthContext); 
  const navigation = useNavigation();
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState(0);
  const [nivel, setNivel] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nivelSelecionado, setNivelSelecionado] = useState(null);
  const [historicoCalculos, setHistoricoCalculos] = useState([]);
  const [mostrarHistorico, setMostrarHistorico] = useState(false);

  const storageKey = user ? `metabolicaData_${user.id}` : null;

  const niveisMetabolicos = [
    { 
      id: 'baixo', 
      nome: 'Baixo Metabolismo', 
      min: 0, 
      max: 18.4, 
      cor: '#7B1FA2',
      corBg: 'rgba(123, 31, 162, 0.12)',
      emoji: '🐌',
      recomendacao: 'Considere aumentar atividade física gradual'
    },
    { 
      id: 'normal-minimo', 
      nome: 'Metabolismo Normal', 
      min: 18.5, 
      max: 24.9, 
      cor: '#4CAF50',
      corBg: 'rgba(76, 175, 80, 0.12)',
      emoji: '⚖️',
      recomendacao: 'Excelente! Mantenha hábitos saudáveis'
    },
    { 
      id: 'moderado', 
      nome: 'Metabolismo Moderado', 
      min: 25.0, 
      max: 29.9, 
      cor: '#FF9800',
      corBg: 'rgba(255, 152, 0, 0.12)',
      emoji: '⚡',
      recomendacao: 'Considere ajustes na dieta e exercícios'
    },
    { 
      id: 'alto', 
      nome: 'Metabolismo Alto', 
      min: 30.0, 
      max: 34.9, 
      cor: '#F44336',
      corBg: 'rgba(244, 67, 54, 0.12)',
      emoji: '🔥',
      recomendacao: 'Consulte profissional para orientação'
    },
    { 
      id: 'muito-alto', 
      nome: 'Metabolismo Muito Alto', 
      min: 35.0, 
      max: 39.9, 
      cor: '#D32F2F',
      corBg: 'rgba(211, 47, 47, 0.12)',
      emoji: '🚨',
      recomendacao: 'Acompanhamento médico recomendado'
    },
    { 
      id: 'critico', 
      nome: 'Nível Crítico', 
      min: 40.0, 
      max: 999, 
      cor: '#B71C1C',
      corBg: 'rgba(183, 28, 28, 0.12)',
      emoji: '⚠️',
      recomendacao: 'Buscar assistência médica urgente'
    }
  ];

  useEffect(() => {
    const loadMetabolicaData = async () => {
      if (!storageKey) { 
        setPeso('');
        setAltura('');
        setImc(0);
        setNivel('');
        setNivelSelecionado(null);
        setHistoricoCalculos([]);
        return;
      }
      try {
        const dadosSalvos = await AsyncStorage.getItem(storageKey);
        if (dadosSalvos) {
          const dados = JSON.parse(dadosSalvos);
          setPeso(dados.peso || '');
          setAltura(dados.altura || '');
          setImc(dados.imc || 0);
          setNivel(dados.nivel || '');
          setHistoricoCalculos(dados.historico || []);
          
          if (dados.nivel) {
            const nivelEncontrado = niveisMetabolicos.find(niv => niv.nome === dados.nivel);
            if (nivelEncontrado) {
              setNivelSelecionado(nivelEncontrado);
            }
          }
        }
      } catch (e) {
        console.error("Falha ao carregar dados metabólicos.", e);
      }
    };
    loadMetabolicaData();
  }, [storageKey]); 

  useEffect(() => {
    const saveMetabolicaData = async () => {
      if (!storageKey) return; 

      try {
        const dados = {
          peso,
          altura,
          imc,
          nivel,
          historico: historicoCalculos
        };
        await AsyncStorage.setItem(storageKey, JSON.stringify(dados));
      } catch (e) {
        console.error("Falha ao salvar dados metabólicos.", e);
      }
    };

    if (storageKey) {
        saveMetabolicaData();
    }
  }, [peso, altura, imc, nivel, historicoCalculos, storageKey]);

  const calcularMetabolismo = () => {
    const pesoNum = parseFloat(peso.replace(',', '.'));
    const alturaNum = parseFloat(altura.replace(',', '.')) / 100;

    if (!pesoNum || !alturaNum) {
      Alert.alert('Erro', 'Por favor, preencha peso e altura corretamente');
      return;
    }

    if (pesoNum <= 0 || pesoNum > 500) {
      Alert.alert('Erro', 'Peso deve estar entre 1 e 500 kg');
      return;
    }

    if (alturaNum <= 0 || alturaNum > 3) {
      Alert.alert('Erro', 'Altura deve estar entre 1 cm e 3 m');
      return;
    }

    const imcCalculado = pesoNum / (alturaNum * alturaNum);
    const imcArredondado = Math.round(imcCalculado * 10) / 10;

    const nivelEncontrado = niveisMetabolicos.find(niv => 
      imcCalculado >= niv.min && imcCalculado <= niv.max
    );

    setImc(imcArredondado);
    setNivel(nivelEncontrado.nome);
    setNivelSelecionado(nivelEncontrado);

    const novoRegistro = {
      id: Date.now(),
      peso: pesoNum,
      altura: alturaNum,
      imc: imcArredondado,
      nivel: nivelEncontrado.nome,
      timestamp: new Date().toLocaleString('pt-BR')
    };

    setHistoricoCalculos([novoRegistro, ...historicoCalculos.slice(0, 7)]);
  };

  const limparDados = () => {
    setPeso('');
    setAltura('');
    setImc(0);
    setNivel('');
    setNivelSelecionado(null);
  };

  const limparHistorico = () => {
    Alert.alert(
      'Limpar Histórico',
      'Tem certeza que deseja apagar todos os registros?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Limpar', style: 'destructive', onPress: () => setHistoricoCalculos([]) }
      ]
    );
  };

  const TelaPrincipal = () => (
    <ScrollView contentContainerStyle={styles.container}>
<TouchableOpacity style={styles.voltarbtn} onPress={() => navigation.goBack()}>
          <Text style={styles.voltarbtnTxt}> VOLTAR </Text>
        </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.titleGroup}>
          <Text style={styles.titleIcon}>🧬</Text>
          <Text style={styles.title}>Metabolismo</Text>
        </View>
        <Text style={styles.subtitle}>Índice Metabólico Corporal</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardHeaderText}>Calculadora</Text>
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
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Ex: 65.5"
              value={peso}
              onChangeText={setPeso}
              style={styles.input}
            />
          </View>

          <View style={styles.inputField}>
            <Text style={styles.label}>Altura (cm)</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Ex: 168"
              value={altura}
              onChangeText={setAltura}
              style={styles.input}
            />
          </View>

          <TouchableOpacity 
            onPress={calcularMetabolismo}
            style={[styles.primaryButton, (!peso || !altura) && styles.buttonDisabled]}
            disabled={!peso || !altura}
          >
            <Text style={styles.primaryButtonText}>🔬 Analisar Metabolismo</Text>
          </TouchableOpacity>

          {imc > 0 && (
            <View style={[styles.resultBox, { borderColor: nivelSelecionado?.cor }]}>
              <View style={styles.resultDisplay}>
                <Text style={[styles.resultValue, { color: nivelSelecionado?.cor }]}>{imc}</Text>
                <Text style={styles.resultUnit}>kg/m²</Text>
              </View>
              <View style={[styles.levelBadge, { backgroundColor: nivelSelecionado?.corBg }]}>
                <Text style={[styles.levelEmoji]}>{nivelSelecionado?.emoji}</Text>
                <Text style={[styles.levelName, { color: nivelSelecionado?.cor }]}>{nivel}</Text>
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
          Histórico de Análises ({historicoCalculos.length})
        </Text>
        <Text style={styles.toggleAction}>
          {mostrarHistorico ? 'Ocultar' : 'Ver'}
        </Text>
      </TouchableOpacity>

      {mostrarHistorico && (
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>📋 Registros Anteriores</Text>
            {historicoCalculos.length > 0 && (
              <TouchableOpacity onPress={limparHistorico}>
                <Text style={styles.clearHistoryText}>Limpar</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.historyCard}>
            {historicoCalculos.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>📊</Text>
                <Text style={styles.emptyText}>Nenhuma análise ainda</Text>
                <Text style={styles.emptySubtext}>Comece calculando seu metabolismo!</Text>
              </View>
            ) : (
              <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
                {historicoCalculos.map((registro) => {
                  const nivel = niveisMetabolicos.find(n => n.nome === registro.nivel);
                  return (
                    <View 
                      key={registro.id}
                      style={[styles.historyItem, { borderLeftColor: nivel?.cor || '#4CAF50' }]}
                    >
                      <View style={styles.historyContent}>
                        <View style={styles.historyHeader}>
                          <Text style={styles.historyEmoji}>{nivel?.emoji || '📊'}</Text>
                          <View style={styles.historyMain}>
                            <Text style={styles.historyValue}>
                              IMC: {registro.imc} kg/m²
                            </Text>
                            <Text style={[styles.historyLevel, { color: nivel?.cor }]}>
                              {registro.nivel}
                            </Text>
                          </View>
                          <Text style={styles.historyTime}>{registro.timestamp}</Text>
                        </View>
                        <Text style={styles.historyDetails}>
                          {registro.peso}kg • {Math.round(registro.altura * 100)}cm
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      )}

      <View style={styles.levelsSection}>
        <Text style={styles.levelsTitle}>📈 Classificação Metabólica</Text>
        <View style={styles.levelsGrid}>
          {niveisMetabolicos.map((nivel) => (
            <TouchableOpacity
              key={nivel.id}
              style={[
                styles.levelItem,
                nivelSelecionado?.id === nivel.id && { 
                  borderColor: nivel.cor, 
                  backgroundColor: nivel.corBg 
                }
              ]}
              onPress={() => setNivelSelecionado(nivel)}
            >
              <Text style={styles.levelItemEmoji}>{nivel.emoji}</Text>
              <View style={styles.levelItemContent}>
                <Text style={[styles.levelItemName, { color: nivel.cor }]}>{nivel.nome}</Text>
                <Text style={styles.levelItemRange}>
                  {nivel.max >= 999 ? `${nivel.min}+` : `${nivel.min} - ${nivel.max}`}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.mainContainer}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>🧬 Sobre o Metabolismo</Text>
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                💡 O Índice Metabólico Corporal (IMC) relaciona peso e altura para avaliar o metabolismo.
              </Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                🔬 Fórmula: IMC = peso ÷ (altura × altura)
              </Text>
            </View>
            <View style={styles.infoSection}>
              <Text style={styles.infoText}>
                ⚠️ Importante: Este é um indicador geral. Para avaliação completa, consulte um profissional de saúde.
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setModalVisivel(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TelaPrincipal />
    </View>
  );
}

const styles = StyleSheet.create({
 mainContainer: {
  flex: 1,
  backgroundColor: '#E3F2FD',
},
container: {
  paddingHorizontal: 16,
  paddingBottom: 24,
},
header: {
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
card: {
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
  width: '100%',
  padding: 12,
  borderWidth: 1,
  borderColor: '#B0BEC5',
  borderRadius: 10,
  fontSize: 16,
  color: '#455A64',
  backgroundColor: '#F0F8FF',
},
primaryButton: {
  width: '100%',
  paddingVertical: 16,
  backgroundColor: '#0077B6',
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 4,
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
  alignItems: 'center',
  borderWidth: 2,
  borderColor: '#0077B6',
},
resultDisplay: {
  flexDirection: 'row',
  alignItems: 'baseline',
  gap: 6,
  marginBottom: 8,
},
resultValue: {
  fontSize: 36,
  fontWeight: '700',
  color: '#0D47A1',
},
resultUnit: {
  fontSize: 16,
  fontWeight: '500',
  color: '#1976D2',
},
levelBadge: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 20,
  gap: 6,
  backgroundColor: '#F1F8E9',
},
levelEmoji: {
  fontSize: 18,
},
levelName: {
  fontSize: 14,
  fontWeight: '600',
  color: '#33691E',
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
  maxHeight: height * 0.35,
},
historyItem: {
  backgroundColor: '#E3F2FD',
  padding: 12,
  borderRadius: 10,
  marginBottom: 8,
  borderLeftWidth: 4,
  borderLeftColor: '#0077B6',
},
historyContent: {
  gap: 4,
},
historyHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
},
historyEmoji: {
  fontSize: 18,
},
historyMain: {
  flex: 1,
},
historyValue: {
  fontWeight: '600',
  fontSize: 15,
  color: '#0D47A1',
},
historyLevel: {
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
historyDetails: {
  fontSize: 12,
  color: '#B0BEC5',
  marginLeft: 28,
},
levelsSection: {
  marginBottom: 16,
},
levelsTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#0D47A1',
  textAlign: 'center',
  marginBottom: 16,
},
levelsGrid: {
  backgroundColor: 'white',
  borderRadius: 16,
  padding: 16,
},
levelItem: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#E3F2FD',
  borderRadius: 12,
  padding: 12,
  marginBottom: 8,
  borderWidth: 2,
  borderColor: 'transparent',
},
levelItemEmoji: {
  fontSize: 20,
  marginRight: 12,
},
levelItemContent: {
  flex: 1,
},
levelItemName: {
  fontSize: 15,
  fontWeight: '600',
  color: '#0D47A1',
},
levelItemRange: {
  fontSize: 13,
  color: '#1976D2',
  marginTop: 2,
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

export default CalculadoraMetabolica;