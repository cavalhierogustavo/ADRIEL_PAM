  import React, { useState, useEffect, useContext } from 'react';
  import { View, Text, StyleSheet, TouchableOpacity, TextInput, Dimensions, Alert, Modal, ScrollView } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { AuthContext } from '../../context/AuthContext'; 

  const { width, height } = Dimensions.get('window');

  function Aguinha() {
    const { user } = useContext(AuthContext); 

    
    const [consumido, setConsumido] = useState(0);
    const [meta, setMeta] = useState(0);
    const [peso, setPeso] = useState('');
    const [altura, setAltura] = useState('');
    const [modalVisivel, setModalVisivel] = useState(false);
    const [historicoConsumo, setHistoricoConsumo] = useState([]);
    const [quantidadeSelecionada, setQuantidadeSelecionada] = useState(250);
    const [telaAtiva, setTelaAtiva] = useState('hoje');

    
    const storageKey = user ? `waterTrackerData_${user.id}` : null;

    const recipientes = [
      { id: 'pequeno', amount: 150, label: '150ml', icon: '🥃' },
      { id: 'medio', amount: 250, label: '250ml', icon: '🥤' },
      { id: 'grande', amount: 500, label: '500ml', icon: '🍼' },
      { id: 'garrafa', amount: 750, label: '750ml', icon: '🍾' }
    ];

    const porcentagem = meta > 0 ? Math.min((consumido / meta) * 100, 100) : 0;

    
    useEffect(() => {
      const loadWaterData = async () => {
        if (!storageKey) { 
          setConsumido(0);
          setMeta(0);
          setPeso('');
          setAltura('');
          setHistoricoConsumo([]);
          return;
        }
        try {
          const dadosSalvos = await AsyncStorage.getItem(storageKey);
          if (dadosSalvos) {
            const dados = JSON.parse(dadosSalvos);
            setConsumido(dados.consumido || 0);
            setMeta(dados.meta || 0);
            setPeso(dados.peso || '');
            setAltura(dados.altura || '');
            setHistoricoConsumo(dados.historico || []);
            
            if (!dados.meta || dados.meta === 0) {
              setModalVisivel(true);
            }
          } else {
            
            setConsumido(0);
            setMeta(0);
            setHistoricoConsumo([]);
            setModalVisivel(true);
          }
        } catch (e) {
          console.error("Falha ao carregar dados de água.", e);
        }
      };
      loadWaterData();
    }, [storageKey]); 
    useEffect(() => {
      const saveWaterData = async () => {
        if (!storageKey) return; 

        try {
          const dados = {
            consumido,
            meta,
            peso,
            altura,
            historico: historicoConsumo
          };
          await AsyncStorage.setItem(storageKey, JSON.stringify(dados));
        } catch (e) {
          console.error("Falha ao salvar dados de água.", e);
        }
      };

      if (storageKey) {
          saveWaterData();
      }
    }, [consumido, meta, peso, altura, historicoConsumo, storageKey]);

    
    const calcularMeta = () => {
      const pesoNum = parseFloat(peso);
      
      if (!pesoNum || pesoNum <= 0) {
        Alert.alert('Atenção', 'Por favor, insira um peso válido.');
        return;
      }
      
      const metaCalculada = Math.round(pesoNum * 35);
      setMeta(metaCalculada);
      setModalVisivel(false);
    };

    
    const adicionarAgua = () => {
      if (meta === 0) {
        setModalVisivel(true);
        return;
      }
      
      const novoConsumo = Math.min(consumido + quantidadeSelecionada, meta);
      setConsumido(novoConsumo);
      
      const novoRegistro = {
        id: Date.now(),
        quantidade: quantidadeSelecionada,
        timestamp: new Date().toLocaleString('pt-BR')
      };
      
      setHistoricoConsumo([novoRegistro, ...historicoConsumo]);
    };

    
    const resetarConsumo = () => {
      Alert.alert(
        'Confirmar Reset',
        'Tem certeza que deseja resetar o consumo de hoje?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Resetar', onPress: () => {
              setConsumido(0);
              setHistoricoConsumo([]);
            }
          },
        ],
        { cancelable: false }
      );
    };

    
    const TelaHoje = () => (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.aguinhaHeader}>
          <View style={styles.aguinhaTitleGroup}>
            <Text style={styles.aguinhaIcon}>💧</Text>
            <Text style={styles.aguinhaTitle}>Hidratação</Text>
          </View>
          <Text style={styles.aguinhaSubtitle}>Atinja seu objetivo diário</Text>
        </View>

        <View style={styles.aguinhaCard}>
          <View style={styles.aguinhaCardHeader}>
            <TouchableOpacity style={styles.aguinhaButtonOutline} onPress={() => setModalVisivel(true)}>
              <Text style={styles.aguinhaButtonOutlineText}>⚙️ Configurar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.aguinhaButtonOutline, styles.aguinhaResetButton]} onPress={resetarConsumo}>
              <Text style={styles.aguinhaButtonOutlineText}>🔄 Reset</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.aguinhaCardContent}>
            <View style={styles.aguinhaDisplay}>
              <Text style={styles.aguinhaAmount}>{consumido}</Text>
              <Text style={styles.aguinhaUnit}>ml</Text>
            </View>
            <Text style={styles.aguinhaProgressText}>
              de {meta}ml ({Math.round(porcentagem)}% concluído)
            </Text>

            <View style={styles.aguinhaProgressBarContainer}>
              <View style={[styles.aguinhaProgressBar, { width: `${porcentagem}%` }]}></View>
            </View>
            <View style={styles.aguinhaProgressLabels}>
              <Text style={styles.aguinhaLabel}>0ml</Text>
              <Text style={styles.aguinhaLabel}>{meta}ml</Text>
            </View>

            <View style={styles.aguinhaSelector}>
              <Text style={styles.aguinhaLabel}>Quantidade a adicionar:</Text>
              <View style={styles.aguinhaGrid}>
                {recipientes.map((recipiente) => (
                  <TouchableOpacity
                    key={recipiente.id}
                    style={[
                      styles.aguinhaSelectorButton,
                      quantidadeSelecionada === recipiente.amount && styles.aguinhaSelectorButtonSelected
                    ]}
                    onPress={() => setQuantidadeSelecionada(recipiente.amount)}
                  >
                    <Text style={styles.aguinhaSelectorIcon}>{recipiente.icon}</Text>
                    <Text style={styles.aguinhaSelectorLabel}>{recipiente.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity 
              onPress={adicionarAgua}
              style={[styles.aguinhaMainButton, meta === 0 && styles.disabledButton]}
              disabled={meta === 0}
            >
              <Text style={styles.aguinhaMainButtonText}>➕ Beber {quantidadeSelecionada}ml</Text>
            </TouchableOpacity>
          </View>
        </View>

        {meta > 0 && (
          <View style={styles.aguinhaMetaInfo}>
            <Text style={styles.aguinhaIcon}>🎯</Text>
            <View>
              <Text style={styles.aguinhaMetaText}>Meta diária: {meta}ml</Text>
              {peso && (
                <Text style={styles.aguinhaMetaSubtext}>
                  Baseado no seu peso de {peso}kg
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    );

    
    const TelaHistorico = () => (
      <View style={styles.aguinhaContainer}>
        <View style={styles.aguinhaHeader}>
          <Text style={styles.aguinhaTitle}>Histórico de Consumo</Text>
          <Text style={styles.aguinhaSubtitle}>Registros de hoje</Text>
        </View>

        <View style={styles.aguinhaCard}>
          <View style={styles.aguinhaCardContent}>
            {historicoConsumo.length === 0 ? (
              <View style={styles.aguinhaEmptyHistory}>
                <Text style={styles.aguinhaIcon}>💧</Text>
                <Text style={styles.emptyHistoryText}>Nenhum registro hoje</Text>
                <Text style={styles.aguinhaEmptyHistorySubtext}>Comece a beber água!</Text>
              </View>
            ) : (
              <ScrollView style={styles.aguinhaHistoryList}>
                {historicoConsumo.map((registro) => (
                  <View 
                    key={registro.id}
                    style={styles.aguinhaHistoryItem}
                  >
                    <View style={styles.aguinhaHistoryItemDetails}>
                      <Text style={styles.aguinhaIcon}>💧</Text>
                      <View>
                        <Text style={styles.aguinhaHistoryQuantity}>
                          {registro.quantidade}ml
                        </Text>
                        <Text style={styles.aguinhaHistoryTimestamp}>
                          {registro.timestamp}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    );

    return (
      <View style={styles.aguinhaApp}>
        
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisivel}
          onRequestClose={() => { if (meta > 0) setModalVisivel(false) }}
        >
          <View style={styles.aguinhaModalOverlay}>
            <View style={styles.aguinhaModalContent}>
              <Text style={styles.aguinhaModalTitle}>👤 Configure sua Meta</Text>
              <View style={styles.aguinhaFormGroup}>
                <Text style={styles.aguinhaLabel}>Peso (kg)</Text>
                <TextInput
                  id="peso"
                  keyboardType="numeric"
                  placeholder="Ex: 70"
                  value={peso}
                  onChangeText={setPeso}
                  style={styles.aguinhaInput}
                />
              </View>
              <View style={styles.aguinhaFormGroup}>
                <Text style={styles.aguinhaLabel}>Altura (cm) - opcional</Text>
                <TextInput
                  id="altura"
                  keyboardType="numeric"
                  placeholder="Ex: 175"
                  value={altura}
                  onChangeText={setAltura} 
                  style={styles.aguinhaInput}
                />
              </View>
              <View style={styles.aguinhaInfoBox}>
                <Text style={styles.aguinhaInfoBoxText}>💡 Sua meta será calculada como 35ml por kg de peso corporal.</Text>
              </View>
              <TouchableOpacity 
                onPress={calcularMeta} 
                style={[styles.aguinhaMainButton, !peso && styles.disabledButton]}
                disabled={!peso}
              >
                <Text style={styles.aguinhaMainButtonText}>Calcular Minha Meta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        
        <View style={styles.aguinhaMainView}>
          {telaAtiva === 'hoje' ? <TelaHoje /> : <TelaHistorico />}
        </View>

        
        <View style={styles.aguinhaNavbar}>
          <TouchableOpacity 
            style={[
              styles.aguinhaNavButton,
              telaAtiva === 'hoje' && styles.aguinhaNavButtonActive
            ]}
            onPress={() => setTelaAtiva('hoje')}
          >
            <Text style={styles.aguinhaIcon}>💧</Text>
            <Text style={[styles.aguinhaNavText, telaAtiva === 'hoje' && styles.aguinhaNavButtonActiveText]}>Hoje</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.aguinhaNavButton,
              telaAtiva === 'historico' && styles.aguinhaNavButtonActive
            ]}
            onPress={() => setTelaAtiva('historico')}
          >
            <Text style={styles.aguinhaIcon}>🎯</Text>
            <Text style={[styles.aguinhaNavText, telaAtiva === 'historico' && styles.aguinhaNavButtonActiveText]}>Histórico</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    aguinhaApp: {
      flex: 1,
      backgroundColor: '#e3f2fd',
    },
    scrollContainer: {
      paddingHorizontal: 16,
      paddingBottom: 80,
    },
    aguinhaMainView: {
      flex: 1,
      paddingBottom: 60,
    },
    aguinhaContainer: {
      flex: 1,
      maxWidth: 480,
      alignSelf: 'center',
      width: '100%',
    },
    aguinhaHeader: {
      alignItems: 'center',
      paddingTop: 32,
      paddingBottom: 16,
    },
    aguinhaTitleGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    aguinhaIcon: {
      fontSize: 28,
      marginRight: 8,
    },
    aguinhaTitle: {
      fontSize: 32,
      fontWeight: '700',
      color: '#0d47a1',
    },
    aguinhaSubtitle: {
      color: '#1976d2',
      fontSize: 16,
    },
    aguinhaCard: {
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
    aguinhaCardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
      paddingBottom: 12,
      marginBottom: 12,
    },
    aguinhaButtonOutline: {
      backgroundColor: '#e3f2fd',
      borderColor: '#bbdefb',
      borderWidth: 1,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    aguinhaButtonOutlineText: {
      color: '#1976d2',
      fontSize: 14,
      fontWeight: '500',
    },
    aguinhaResetButton: {
      borderColor: '#ffcdd2',
      backgroundColor: '#ffebee',
    },
    aguinhaCardContent: {
      paddingTop: 8,
      gap: 16,
    },
    aguinhaDisplay: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: 4,
    },
    aguinhaAmount: {
      fontSize: 56,
      fontWeight: '700',
      color: '#0d47a1',
    },
    aguinhaUnit: {
      fontSize: 20,
      fontWeight: '500',
      color: '#1976d2',
      marginLeft: 4,
    },
    aguinhaProgressText: {
      textAlign: 'center',
      fontSize: 14,
      color: '#1976d2',
    },
    aguinhaProgressBarContainer: {
      width: '100%',
      height: 16,
      backgroundColor: '#bbdefb',
      borderRadius: 8,
      overflow: 'hidden',
    },
    aguinhaProgressBar: {
      height: '100%',
      backgroundColor: '#2196f3',
    },
    aguinhaProgressLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    aguinhaSelector: {
      marginTop: 16,
    },
    aguinhaLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#0d47a1',
      marginBottom: 8,
    },
    aguinhaGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
    },
    aguinhaSelectorButton: {
      minWidth: (width - 32 - 24) / 2 - 8,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f8ff',
      borderWidth: 2,
      borderColor: '#bbdefb',
      borderRadius: 12,
      paddingVertical: 12,
    },
    aguinhaSelectorButtonSelected: {
      borderColor: '#2196f3',
      backgroundColor: '#bbdefb',
      transform: [{ scale: 1.05 }],
    },
    aguinhaSelectorIcon: {
      fontSize: 24,
    },
    aguinhaSelectorLabel: {
      fontSize: 14,
      fontWeight: '500',
      color: '#0d47a1',
      marginTop: 4,
    },
    aguinhaMainButton: {
      width: '100%',
      paddingVertical: 16,
      backgroundColor: '#2196f3',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 16,
    },
    disabledButton: {
      backgroundColor: '#a0a0a0',
    },
    aguinhaMainButtonText: {
      fontSize: 18,
      fontWeight: '600',
      color: 'white',
    },
    aguinhaMetaInfo: {
      backgroundColor: '#e8f5e9',
      borderColor: '#c8e6c9',
      borderWidth: 1,
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginTop: 16,
    },
    aguinhaMetaText: {
      fontWeight: '600',
      color: '#2e7d32',
      fontSize: 16,
    },
    aguinhaMetaSubtext: {
      fontSize: 14,
      color: '#43a047',
    },
    aguinhaEmptyHistory: {
      alignItems: 'center',
      paddingVertical: 48,
      gap: 8,
    },
    emptyHistoryText: {
      fontSize: 16,
      color: '#555',
    },
    aguinhaEmptyHistorySubtext: {
      fontSize: 14,
      color: '#1976d2',
    },
    aguinhaHistoryList: {
      maxHeight: height * 0.5,
    },
    aguinhaHistoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#e3f2fd',
      padding: 12,
      borderRadius: 12,
      marginBottom: 12,
    },
    aguinhaHistoryItemDetails: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    aguinhaHistoryQuantity: {
      fontWeight: '600',
      fontSize: 16,
      color: '#0d47a1',
    },
    aguinhaHistoryTimestamp: {
      fontSize: 12,
      color: '#424242',
    },
    aguinhaModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    aguinhaModalContent: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
      gap: 16,
    },
    aguinhaModalTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: '#0d47a1',
      textAlign: 'center',
      marginBottom: 8,
    },
    aguinhaFormGroup: {
      gap: 8,
    },
    aguinhaInput: {
      width: '100%',
      padding: 12,
      borderColor: '#bbdefb',
      borderWidth: 1,
      borderRadius: 8,
      fontSize: 16,
      color: '#424242',
      backgroundColor: '#f9f9f9',
    },
    aguinhaInfoBox: {
      backgroundColor: '#e3f2fd',
      borderLeftColor: '#2196f3',
      borderLeftWidth: 4,
      padding: 12,
      borderRadius: 8,
    },
    aguinhaInfoBoxText: {
      fontSize: 14,
      color: '#1976d2',
      lineHeight: 20,
    },
    aguinhaNavbar: {
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
    aguinhaNavButton: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    aguinhaNavButtonActive: {
      borderTopWidth: 3,
      borderTopColor: '#2196f3',
    },
    aguinhaNavText: {
      fontSize: 12,
      color: '#757575',
      marginTop: 2,
    },
    aguinhaNavButtonActiveText: {
      color: '#2196f3',
      fontWeight: '700',
    },
  });


  export default Aguinha;
