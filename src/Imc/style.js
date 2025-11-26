import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Alert, Modal, ScrollView } from 'react-native';

const { width, height } = Dimensions.get('window');

function CalculadoraIMC() {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState(0);
  const [categoria, setCategoria] = useState('');
  const [modalVisivel, setModalVisivel] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [historiaIMC, setHistoriaIMC] = useState([]);
  const [telaAtiva, setTelaAtiva] = useState('calculadora');

  const categorias = [
    { 
      id: 'magreza-grave', 
      nome: 'Magreza Grave', 
      min: 0, 
      max: 16.0, 
      cor: '#7B1FA2',
      corBg: 'rgba(123, 31, 162, 0.1)',
      emoji: '⚠️',
      recomenda: 'Procure um médico ou nutricionista urgentemente'
    },
    { 
      id: 'magreza-moderada', 
      nome: 'Magreza Moderada', 
      min: 16.0, 
      max: 16.99, 
      cor: '#E91E63',
      corBg: 'rgba(233, 30, 99, 0.1)',
      emoji: '⚠️',
      recomenda: 'Aumente a ingestão calórica com orientação nutricional'
    },
    { 
      id: 'magreza-leve', 
      nome: 'Magreza Leve', 
      min: 17.0, 
      max: 18.49, 
      cor: '#FF5722',
      corBg: 'rgba(255, 87, 34, 0.1)',
      emoji: '⚠️',
      recomenda: 'Mantenha uma dieta equilibrada e pratique exercícios'
    },
    { 
      id: 'saudavel', 
      nome: 'Saudável', 
      min: 18.5, 
      max: 24.9, 
      cor: '#4CAF50',
      corBg: 'rgba(76, 175, 80, 0.1)',
      emoji: '✅',
      recomenda: 'Parabéns! Continue mantendo hábitos saudáveis'
    },
    { 
      id: 'sobrepeso', 
      nome: 'Sobrepeso', 
      min: 25.0, 
      max: 29.9, 
      cor: '#FF9800',
      corBg: 'rgba(255, 152, 0, 0.1)',
      emoji: '⚠️',
      recomenda: 'Considere reduzir peso com dieta e exercícios'
    },
    { 
      id: 'obesidade-1', 
      nome: 'Obesidade Grau I', 
      min: 30.0, 
      max: 34.9, 
      cor: '#F44336',
      corBg: 'rgba(244, 67, 54, 0.1)',
      emoji: '🚨',
      recomenda: 'Busque orientação médica para plano de emagrecimento'
    },
    { 
      id: 'obesidade-2', 
      nome: 'Obesidade Grau II', 
      min: 35.0, 
      max: 39.9, 
      cor: '#D32F2F',
      corBg: 'rgba(211, 47, 47, 0.1)',
      emoji: '🚨',
      recomenda: 'Acompanhamento médico é essencial para sua saúde'
    },
    { 
      id: 'obesidade-3', 
      nome: 'Obesidade Grau III', 
      min: 40.0, 
      max: 999, 
      cor: '#B71C1C',
      corBg: 'rgba(183, 28, 28, 0.1)',
      emoji: '🚨',
      recomenda: 'Atenção médica urgente é necessária imediatamente'
    }
  ];

  const calcularIMC = () => {
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

    // Encontrar categoria
    const categoriaEncontrada = categorias.find(cat => 
      imcCalculado >= cat.min && imcCalculado <= cat.max
    );

    setImc(imcArredondado);
    setCategoria(categoriaEncontrada.nome);
    setCategoriaSelecionada(categoriaEncontrada);

    // Adicionar ao histórico
    const novoRegistro = {
      id: Date.now(),
      peso: pesoNum,
      altura: alturaNum,
      imc: imcArredondado,
      categoria: categoriaEncontrada.nome,
      timestamp: new Date().toLocaleString('pt-BR')
    };

    setHistoriaIMC([novoRegistro, ...historiaIMC.slice(0, 9)]); // Manter apenas 10 últimos
  };

  const limparCampos = () => {
    setPeso('');
    setAltura('');
    setImc(0);
    setCategoria('');
    setCategoriaSelecionada(null);
  };

  const TelaCalculadora = () => (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.imcHeader}>
        <View style={styles.imcTitleGroup}>
          <Text style={styles.imcIcon}>⚖️</Text>
          <Text style={styles.imcTitle}>Calculadora IMC</Text>
        </View>
        <Text style={styles.imcSubtitle}>Índice de Massa Corporal</Text>
      </View>

      <View style={styles.imcCard}>
        <View style={styles.imcCardHeader}>
          <TouchableOpacity style={styles.imcButtonOutline} onPress={limparCampos}>
            <Text style={styles.imcButtonOutlineText}>🗑️ Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.imcButtonOutline} onPress={() => setModalVisivel(true)}>
            <Text style={styles.imcButtonOutlineText}>📊 Info</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imcCardContent}>
          <View style={styles.imcInputGroup}>
            <Text style={styles.imcLabel}>Peso (kg)</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Ex: 70.5"
              value={peso}
              onChangeText={setPeso}
              style={styles.imcInput}
            />
          </View>

          <View style={styles.imcInputGroup}>
            <Text style={styles.imcLabel}>Altura (cm)</Text>
            <TextInput
              keyboardType="numeric"
              placeholder="Ex: 175"
              value={altura}
              onChangeText={setAltura}
              style={styles.imcInput}
            />
          </View>

          <TouchableOpacity 
            onPress={calcularIMC}
            style={[styles.imcMainButton, (!peso || !altura) && styles.disabledButton]}
            disabled={!peso || !altura}
          >
            <Text style={styles.imcMainButtonText}>🧮 Calcular IMC</Text>
          </TouchableOpacity>

          {imc > 0 && (
            <View style={styles.imcResultCard}>
              <View style={styles.imcResultDisplay}>
                <Text style={styles.imcResultValue}>{imc}</Text>
                <Text style={styles.imcResultUnit}>kg/m²</Text>
              </View>
              <Text style={[styles.imcResultCategory, { color: categoriaSelecionada?.cor }]}>
                {categoria}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Categorias */}
      <View style={styles.imcCategoriesContainer}>
        <Text style={styles.imcCategoriesTitle}>📈 Classificação do IMC</Text>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.imcCategoryItem,
              categoriaSelecionada?.id === cat.id && { borderColor: cat.cor, backgroundColor: cat.corBg },
              categoriaSelecionada?.id === cat.id && styles.imcCategoryItemSelected
            ]}
            onPress={() => setCategoriaSelecionada(cat)}
          >
            <Text style={styles.imcCategoryEmoji}>{cat.emoji}</Text>
            <View style={styles.imcCategoryContent}>
              <Text style={[styles.imcCategoryName, { color: cat.cor }]}>{cat.nome}</Text>
              <Text style={styles.imcCategoryRange}>
                {cat.max >= 999 ? `${cat.min}+` : `${cat.min} - ${cat.max}`}
              </Text>
            </View>
            {categoriaSelecionada?.id === cat.id && (
              <Text style={[styles.imcCategoryCheck, { color: cat.cor }]}>✓</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const TelaHistorico = () => (
    <View style={styles.imcContainer}>
      <View style={styles.imcHeader}>
        <Text style={styles.imcTitle}>Histórico de IMC</Text>
        <Text style={styles.imcSubtitle}>Seus últimos cálculos</Text>
      </View>

      <View style={styles.imcCard}>
        <View style={styles.imcCardContent}>
          {historiaIMC.length === 0 ? (
            <View style={styles.imcEmptyHistory}>
              <Text style={styles.imcIcon}>📊</Text>
              <Text style={styles.emptyHistoryText}>Nenhum cálculo ainda</Text>
              <Text style={styles.imcEmptyHistorySubtext}>Comece calculando seu IMC!</Text>
            </View>
          ) : (
            <ScrollView style={styles.imcHistoryList}>
              {historiaIMC.map((registro) => {
                const cat = categorias.find(c => c.nome === registro.categoria);
                return (
                  <View 
                    key={registro.id}
                    style={[styles.imcHistoryItem, { borderLeftColor: cat?.cor || '#2196F3' }]}
                  >
                    <View style={styles.imcHistoryItemDetails}>
                      <Text style={styles.imcHistoryEmoji}>📊</Text>
                      <View>
                        <Text style={styles.imcHistoryIMC}>
                          IMC: {registro.imc} kg/m²
                        </Text>
                        <Text style={[styles.imcHistoryCategory, { color: cat?.cor }]}>
                          {registro.categoria}
                        </Text>
                        <Text style={styles.imcHistoryDetails}>
                          {registro.peso}kg • {Math.round(registro.altura * 100)}cm
                        </Text>
                        <Text style={styles.imcHistoryTimestamp}>
                          {registro.timestamp}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.imcApp}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.imcModalOverlay}>
          <View style={styles.imcModalContent}>
            <Text style={styles.imcModalTitle}>📊 Sobre o IMC</Text>
            <View style={styles.imcInfoBox}>
              <Text style={styles.imcInfoBoxText}>
                💡 O Índice de Massa Corporal (IMC) é uma medida que relaciona o peso e a altura de uma pessoa.
              </Text>
            </View>
            <View style={styles.imcInfoBox}>
              <Text style={styles.imcInfoBoxText}>
                🔍 Fórmula: IMC = peso ÷ (altura × altura)
              </Text>
            </View>
            <View style={styles.imcInfoBox}>
              <Text style={styles.imcInfoBoxText}>
                ⚠️ Importante: Este é um indicador geral. Para uma avaliação completa da sua saúde, consulte sempre um profissional médico.
              </Text>
            </View>
            <TouchableOpacity 
              onPress={() => setModalVisivel(false)}
              style={styles.imcModalButton}
            >
              <Text style={styles.imcModalButtonText}>Entendi</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.imcMainView}>
        {telaAtiva === 'calculadora' ? <TelaCalculadora /> : <TelaHistorico />}
      </View>

      <View style={styles.imcNavbar}>
        <TouchableOpacity 
          style={[
            styles.imcNavButton,
            telaAtiva === 'calculadora' && styles.imcNavButtonActive
          ]}
          onPress={() => setTelaAtiva('calculadora')}
        >
          <Text style={styles.imcIcon}>⚖️</Text>
          <Text style={[styles.imcNavText, telaAtiva === 'calculadora' && styles.imcNavButtonActiveText]}>
            IMC
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.imcNavButton,
            telaAtiva === 'historico' && styles.imcNavButtonActive
          ]}
          onPress={() => setTelaAtiva('historico')}
        >
          <Text style={styles.imcIcon}>📊</Text>
          <Text style={[styles.imcNavText, telaAtiva === 'historico' && styles.imcNavButtonActiveText]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imcApp: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  imcMainView: {
    flex: 1,
    paddingBottom: 60,
  },
  imcContainer: {
    flex: 1,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  imcHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  imcTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  imcIcon: {
    fontSize: 28,
    marginRight: 8,
  },
  imcTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0d47a1',
  },
  imcSubtitle: {
    color: '#1976d2',
    fontSize: 16,
  },
  imcCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 16,
    marginBottom: 16,
  },
  imcCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 12,
    marginBottom: 12,
  },
  imcButtonOutline: {
    backgroundColor: '#e3f2fd',
    borderColor: '#bbdefb',
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imcButtonOutlineText: {
    color: '#1976d2',
    fontSize: 14,
    fontWeight: '500',
  },
  imcCardContent: {
    paddingTop: 8,
    gap: 16,
  },
  imcInputGroup: {
    gap: 8,
  },
  imcLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0d47a1',
  },
  imcInput: {
    width: '100%',
    padding: 12,
    borderColor: '#bbdefb',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    color: '#424242',
    backgroundColor: '#f9f9f9',
  },
  imcMainButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#2196f3',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  imcMainButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  imcResultCard: {
    backgroundColor: '#f0f8ff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#bbdefb',
  },
  imcResultDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 8,
  },
  imcResultValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#0d47a1',
  },
  imcResultUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1976d2',
  },
  imcResultCategory: {
    fontSize: 18,
    fontWeight: '600',
  },
  imcCategoriesContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  imcCategoriesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0d47a1',
    textAlign: 'center',
    marginBottom: 16,
  },
  imcCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  imcCategoryItemSelected: {
    transform: [{ scale: 1.02 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imcCategoryEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  imcCategoryContent: {
    flex: 1,
  },
  imcCategoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  imcCategoryRange: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  imcCategoryCheck: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imcEmptyHistory: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 8,
  },
  emptyHistoryText: {
    fontSize: 16,
    color: '#555',
  },
  imcEmptyHistorySubtext: {
    fontSize: 14,
    color: '#1976d2',
  },
  imcHistoryList: {
    maxHeight: height * 0.5,
  },
  imcHistoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  imcHistoryItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  imcHistoryEmoji: {
    fontSize: 20,
  },
  imcHistoryIMC: {
    fontWeight: '600',
    fontSize: 16,
    color: '#0d47a1',
  },
  imcHistoryCategory: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  imcHistoryDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  imcHistoryTimestamp: {
    fontSize: 12,
    color: '#424242',
    marginTop: 2,
  },
  imcModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  imcModalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    gap: 16,
  },
  imcModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0d47a1',
    textAlign: 'center',
    marginBottom: 8,
  },
  imcInfoBox: {
    backgroundColor: '#e3f2fd',
    borderLeftColor: '#2196f3',
    borderLeftWidth: 4,
    padding: 12,
    borderRadius: 8,
  },
  imcInfoBoxText: {
    fontSize: 14,
    color: '#1976d2',
    lineHeight: 20,
  },
  imcModalButton: {
    backgroundColor: '#2196f3',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  imcModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  imcNavbar: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 5,
  },
  imcNavButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imcNavButtonActive: {
    borderTopWidth: 3,
    borderTopColor: '#2196f3',
  },
  imcNavText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  imcNavButtonActiveText: {
    color: '#2196f3',
    fontWeight: '700',
  },
});

export default CalculadoraIMC;