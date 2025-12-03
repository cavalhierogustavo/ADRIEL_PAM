import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Ícones
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

function FrutasPage() {
  const { user } = useContext(AuthContext); 
  const navigation = useNavigation();

  const [frutas, setFrutas] = useState([]);
  const [frutaSelecionada, setFrutaSelecionada] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [carregando, setCarregando] = useState(true);

  const frutasData = [
    {
      id: 1,
      name: 'Maçã',
      nutritions: { calories: 52, sugar: 10, fiber: 2.4, potassium: 107 },
      categoria: 'Fruta doce',
      cor: '#FF6B6B',
      estacao: 'Ano todo',
      emoji: '🍎'
    },
    {
      id: 2,
      name: 'Banana',
      nutritions: { calories: 89, sugar: 12, fiber: 2.6, potassium: 358 },
      categoria: 'Fruta tropical',
      cor: '#FFE66D',
      estacao: 'Ano todo',
      emoji: '🍌'
    },
    {
      id: 3,
      name: 'Laranja',
      nutritions: { calories: 47, sugar: 9, fiber: 2.4, potassium: 181 },
      categoria: 'Fruta cítrica',
      cor: '#FF8C42',
      estacao: 'Inverno',
      emoji: '🍊'
    },
    {
      id: 4,
      name: 'Morango',
      nutritions: { calories: 32, sugar: 5, fiber: 2, potassium: 153 },
      categoria: 'Fruta vermelha',
      cor: '#FF1744',
      estacao: 'Primavera',
      emoji: '🍓'
    },
    {
      id: 5,
      name: 'Uva',
      nutritions: { calories: 62, sugar: 15, fiber: 0.9, potassium: 191 },
      categoria: 'Fruta doce',
      cor: '#8E44AD',
      estacao: 'Outono',
      emoji: '🍇'
    },
    {
      id: 6,
      name: 'Abacate',
      nutritions: { calories: 160, sugar: 0.7, fiber: 7, potassium: 485 },
      categoria: 'Fruta oleaginosa',
      cor: '#27AE60',
      estacao: 'Ano todo',
      emoji: '🥑'
    },
    {
      id: 7,
      name: 'Manga',
      nutritions: { calories: 60, sugar: 14, fiber: 1.6, potassium: 168 },
      categoria: 'Fruta tropical',
      cor: '#FF9500',
      estacao: 'Verão',
      emoji: '🥭'
    },
    {
      id: 8,
      name: 'Kiwi',
      nutritions: { calories: 61, sugar: 9, fiber: 3, potassium: 312 },
      categoria: 'Fruta exótica',
      cor: '#8BC34A',
      estacao: 'Inverno',
      emoji: '🥝'
    },
    {
      id: 9,
      name: 'Abacaxi',
      nutritions: { calories: 50, sugar: 9, fiber: 1.4, potassium: 109 },
      categoria: 'Fruta tropical',
      cor: '#FFC107',
      estacao: 'Verão',
      emoji: '🍍'
    },
    {
      id: 10,
      name: 'Cereja',
      nutritions: { calories: 63, sugar: 12, fiber: 2.1, potassium: 222 },
      categoria: 'Fruta vermelha',
      cor: '#D32F2F',
      estacao: 'Verão',
      emoji: '🍒'
    }
  ];

  const carregarFrutas = async () => {
    setCarregando(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setFrutas(frutasData);
    } catch (error) {
      console.error('Erro ao carregar frutas:', error);
    } finally {
      setCarregando(false);
    }
  };

  const obterBeneficios = (nome) => {
    const beneficios = {
      'Maçã': 'Fortalece o sistema imunológico e melhora a digestão.',
      'Banana': 'Fonte de energia rápida e rica em potássio.',
      'Laranja': 'Rica em vitamina C, fortalece a imunidade.',
      'Morango': 'Antioxidante poderoso, bom para pele e coração.',
      'Uva': 'Contém resveratrol, ótimo para circulação.',
      'Abacate': 'Rico em gorduras saudáveis e vitamina E.',
      'Manga': 'Excelente para visão e sistema imunológico.',
      'Kiwi': 'Superior à laranja em vitamina C, auxilia no sono.',
      'Abacaxi': 'Contém bromelina, facilita a digestão.',
      'Cereja': 'Anti-inflamatória natural, rica em antocianinas.'
    };
    return beneficios[nome] || 'Fruta rica em nutrientes essenciais.';
  };

  const obterIndiceGlicemico = (sugar) => {
    if (sugar <= 5) return 'Baixo';
    if (sugar <= 12) return 'Médio';
    return 'Alto';
  };

  const renderFruta = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.frutaCard, { borderLeftColor: item.cor }]}
        onPress={() => {
          setFrutaSelecionada(item);
          setModalVisivel(true);
        }}
      >
        <View style={[styles.iconContainer, { backgroundColor: `${item.cor}20` }]}>
          <Text style={styles.emojiText}>{item.emoji}</Text>
        </View>
        <Text style={styles.frutaNome}>{item.name}</Text>
        <Text style={styles.frutaCalorias}>{item.nutritions.calories} kcal</Text>
        <View style={[styles.categoriaTag, { backgroundColor: `${item.cor}15` }]}>
          <Text style={[styles.categoriaText, { color: item.cor }]}>
            {item.categoria}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    carregarFrutas();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* BOTÃO VOLTAR */}
        <TouchableOpacity style={styles.voltarbtn} onPress={() => navigation.goBack()}>
          <Text style={styles.voltarbtnTxt}> VOLTAR </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <MaterialCommunityIcons name="fruit-cherries" size={32} color="#0D47A1" />
            <Text style={styles.title}>Frutas</Text>
          </View>
          <Text style={styles.subtitle}>Alimentação Saudável & Nutrição</Text>
        </View>

        {/* Stats com ÍCONE (não emoji) */}
        <View style={styles.statsCard}>
          <View style={styles.statsIconRow}>
            <MaterialCommunityIcons name="fruit-cherries" size={18} color="#0D47A1" />
            <Text style={styles.statsText}> {frutas.length} frutas catalogadas</Text>
          </View>
          <Text style={styles.statsSubtext}>
            Toque em qualquer fruta para ver detalhes nutricionais
          </Text>
        </View>

        {carregando ? (
          <View style={styles.loadingContainer}>
            <MaterialCommunityIcons name="fruit-cherries" size={48} color="#0077B6" />
            <Text style={styles.loadingText}>Carregando frutas saudáveis...</Text>
          </View>
        ) : (
          <FlatList
            data={frutas}
            renderItem={renderFruta}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={styles.listaFrutas}
            showsVerticalScrollIndicator={false}
          />
        )}
      </ScrollView>

      {/* Modal com EMOJI (não ícone vetorial) */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {frutaSelecionada && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setModalVisivel(false)}>
                    <Ionicons name="close" size={24} color="#757575" />
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.modalBody}>
                    {/* EMOJI NO MODAL */}
                    <Text style={styles.modalEmoji}>{frutaSelecionada.emoji}</Text>

                    <Text style={[styles.modalTitle, { color: frutaSelecionada.cor }]}>
                      {frutaSelecionada.name}
                    </Text>

                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons name="calendar-range" size={16} color="#0D47A1" />
                      <Text style={styles.infoText}>Época: {frutaSelecionada.estacao}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons name="food-apple" size={16} color="#0D47A1" />
                      <Text style={styles.infoText}>Categoria: {frutaSelecionada.categoria}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons name="fire" size={16} color="#0D47A1" />
                      <Text style={styles.infoText}>Calorias: {frutaSelecionada.nutritions.calories} kcal/100g</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons name="water" size={16} color="#0D47A1" />
                      <Text style={styles.infoText}>Açúcar: {frutaSelecionada.nutritions.sugar}g</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons name="leaf" size={16} color="#0D47A1" />
                      <Text style={styles.infoText}>Índice Glicêmico: {obterIndiceGlicemico(frutaSelecionada.nutritions.sugar)}</Text>
                    </View>

                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons name="heart" size={16} color="#0D47A1" />
                      <Text style={styles.infoText}>Benefício: {obterBeneficios(frutaSelecionada.name)}</Text>
                    </View>
                  </View>
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 19,
    paddingBottom: 24,
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
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#0D47A1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  statsIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D47A1',
  },
  statsSubtext: {
    fontSize: 13,
    color: '#1976D2',
    marginTop: 4,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1976D2',
  },
  listaFrutas: {
    paddingBottom: 16,
  },
  frutaCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    width: (width - 64) / 2,
    alignItems: 'center',
    shadowColor: '#0D47A1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  emojiText: {
    fontSize: 28,
    textAlign: 'center',
  },
  frutaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D47A1',
    textAlign: 'center',
    marginBottom: 4,
  },
  frutaCalorias: {
    fontSize: 13,
    color: '#1976D2',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoriaTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoriaText: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  modalBody: {
    padding: 24,
    alignItems: 'center',
  },
  modalEmoji: {
    fontSize: 60,
    textAlign: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#0D47A1',
    flex: 1,
  },
});

export default FrutasPage;