import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext'; 
import { useNavigation } from '@react-navigation/native';

function AlergiasSimples() {
  const { user } = useContext(AuthContext); 
  const navigation = useNavigation();

  const [nomeAlergia, setNomeAlergia] = useState('');
  const [nivelSelecionado, setNivelSelecionado] = useState('');
  const [listaAlergias, setListaAlergias] = useState([]);
  const [modalConfirmacao, setModalConfirmacao] = useState(false);
  const [alergiaParaExcluir, setAlergiaParaExcluir] = useState(null);

  const storageKey = user ? `alergias_${user.id}` : null;

  const niveis = [
    { id: 'leve', nome: 'Leve', cor: '#4CAF50', emoji: '🟢' },
    { id: 'moderada', nome: 'Moderada', cor: '#FF9800', emoji: '🟡' },
    { id: 'grave', nome: 'Grave', cor: '#F44336', emoji: '🔴' }
  ];

  // Carregar alergias salvas
  useEffect(() => {
    const carregarAlergias = async () => {
      if (!storageKey) return;
      
      try {
        const dadosSalvos = await AsyncStorage.getItem(storageKey);
        if (dadosSalvos) {
          setListaAlergias(JSON.parse(dadosSalvos));
        }
      } catch (e) {
        console.error("Erro ao carregar alergias:", e);
      }
    };
    
    carregarAlergias();
  }, [storageKey]);

  // Salvar alergias
  useEffect(() => {
    const salvarAlergias = async () => {
      if (!storageKey) return;
      
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(listaAlergias));
      } catch (e) {
        console.error("Erro ao salvar alergias:", e);
      }
    };

    if (storageKey) {
      salvarAlergias();
    }
  }, [listaAlergias, storageKey]);

  const adicionarAlergia = () => {
    if (!nomeAlergia.trim() || !nivelSelecionado) {
      Alert.alert('Atenção', 'Preencha todos os campos');
      return;
    }

    const nivelInfo = niveis.find(n => n.id === nivelSelecionado);
    
    const novaAlergia = {
      id: Date.now().toString(),
      nome: nomeAlergia.trim(),
      nivel: nivelSelecionado,
      nivelNome: nivelInfo.nome,
      nivelCor: nivelInfo.cor,
      nivelEmoji: nivelInfo.emoji,
      data: new Date().toLocaleString('pt-BR')
    };

    setListaAlergias([novaAlergia, ...listaAlergias]);
    setNomeAlergia('');
    setNivelSelecionado('');
  };

  const confirmarExclusao = (alergia) => {
    setAlergiaParaExcluir(alergia);
    setModalConfirmacao(true);
  };

  const excluirAlergia = () => {
    if (alergiaParaExcluir) {
      setListaAlergias(listaAlergias.filter(a => a.id !== alergiaParaExcluir.id));
      setModalConfirmacao(false);
      setAlergiaParaExcluir(null);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
    

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Formulário */}
        <View style={styles.card}>
              <View style={styles.header}>
        
        <Text style={styles.titulo}>🏥 Alergias</Text>
        <Text style={styles.subtitulo}>Gerencie suas alergias</Text>
      </View>
          <View style={styles.formSection}>
            <Text style={styles.label}>Nome da Alergia</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Amendoim, Pólén..."
              value={nomeAlergia}
              onChangeText={setNomeAlergia}
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formSection}>
            <Text style={styles.label}>Nível de Gravidade</Text>
            <View style={styles.niveisGrid}>
              {niveis.map((nivel) => (
                <TouchableOpacity
                  key={nivel.id}
                  style={[
                    styles.nivelBtn,
                    { borderColor: nivel.cor },
                    nivelSelecionado === nivel.id && styles.nivelBtnSelecionado
                  ]}
                  onPress={() => setNivelSelecionado(nivel.id)}
                >
                  <Text style={styles.nivelEmoji}>{nivel.emoji}</Text>
                  <Text style={[styles.nivelNome, { color: nivel.cor }]}>
                    {nivel.nome}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.adicionarBtn,
              (!nomeAlergia.trim() || !nivelSelecionado) && styles.btnDisabled
            ]}
            onPress={adicionarAlergia}
            disabled={!nomeAlergia.trim() || !nivelSelecionado}
          >
            <Text style={styles.adicionarTxt}>➕ Adicionar Alergia</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Alergias */}
        <View style={styles.listaSection}>
          <Text style={styles.listaTitulo}>
            📋 Suas Alergias ({listaAlergias.length})
          </Text>

          {listaAlergias.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTexto}>Nenhuma alergia cadastrada</Text>
              <Text style={styles.emptySubtexto}>
                Adicione sua primeira alergia acima
              </Text>
            </View>
          ) : (
            <View style={styles.lista}>
              {listaAlergias.map((alergia) => (
                <View key={alergia.id} style={styles.alergiaItem}>
                  <View style={styles.alergiaInfo}>
                    <Text style={styles.alergiaNome}>{alergia.nome}</Text>
                    <View style={[styles.gravidadeBadge, { backgroundColor: `${alergia.nivelCor}15` }]}>
                      <Text style={styles.gravidadeEmoji}>{alergia.nivelEmoji}</Text>
                      <Text style={[styles.gravidadeTexto, { color: alergia.nivelCor }]}>
                        {alergia.nivelNome}
                      </Text>
                    </View>
                    <Text style={styles.alergiaData}>{alergia.data}</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.excluirBtn}
                    onPress={() => confirmarExclusao(alergia)}
                  >
                    <Text style={styles.excluirTxt}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Confirmação */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalConfirmacao}
        onRequestClose={() => setModalConfirmacao(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Exclusão</Text>
            <Text style={styles.modalMessage}>
              Deseja remover a alergia "{alergiaParaExcluir?.nome}"?
            </Text>
            <View style={styles.modalBtns}>
              <TouchableOpacity 
                style={styles.modalCancel}
                onPress={() => setModalConfirmacao(false)}
              >
                <Text style={styles.modalCancelTxt}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalConfirm}
                onPress={excluirAlergia}
              >
                <Text style={styles.modalConfirmTxt}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  
  // Header
  header: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e3f2fd',
  },
  voltarBtn: {
    position: 'absolute',
    top: 20,
    left: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
  },
  voltarTxt: {
    color: '#1976d2',
    fontSize: 12,
    fontWeight: '600',
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0d47a1',
  },
  subtitulo: {
    color: '#1976d2',
    fontSize: 14,
    marginTop: 4,
  },

  // Card principal
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  // Formulário
  formSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d47a1',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbdefb',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#424242',
    backgroundColor: '#f9f9f9',
  },

  // Níveis
  niveisGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  nivelBtn: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  nivelBtnSelecionado: {
    backgroundColor: '#bbdefb',
  },
  nivelEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  nivelNome: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Botão adicionar
  adicionarBtn: {
    backgroundColor: '#2196f3',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  btnDisabled: {
    backgroundColor: '#a0a0a0',
  },
  adicionarTxt: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // Lista
  listaSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  listaTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0d47a1',
    marginBottom: 16,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTexto: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d47a1',
    marginBottom: 8,
  },
  emptySubtexto: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  // Lista de alergias
  lista: {
    gap: 12,
  },
  alergiaItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alergiaInfo: {
    flex: 1,
  },
  alergiaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d47a1',
    marginBottom: 8,
  },
  gravidadeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 4,
  },
  gravidadeEmoji: {
    fontSize: 14,
  },
  gravidadeTexto: {
    fontSize: 12,
    fontWeight: '600',
  },
  alergiaData: {
    fontSize: 11,
    color: '#666',
  },
  excluirBtn: {
    padding: 8,
  },
  excluirTxt: {
    fontSize: 18,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0d47a1',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancel: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelTxt: {
    color: '#1976d2',
    fontWeight: '600',
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: '#f44336',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalConfirmTxt: {
    color: 'white',
    fontWeight: '600',
  },
});

export default AlergiasSimples;