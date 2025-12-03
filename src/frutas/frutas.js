import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; 
import { useNavigation } from '@react-navigation/native';

function FrutasPage() {
  const { user } = useContext(AuthContext); 
  const navigation = useNavigation();

  const [frutas, setFrutas] = useState([]);
  const [frutaSelecionada, setFrutaSelecionada] = useState(null);
  const [modalVisivel, setModalVisivel] = useState(false);
  const [carregando, setCarregando] = useState(true);

  // Banco extenso de frutas com dados nutricionais completos
  const frutasData = [
    {
      id: 1,
      name: 'Maçã',
      family: 'Rosaceae',
      order: 'Rosales',
      nutritions: { 
        calories: 52, protein: 0.3, fat: 0.2, carbohydrates: 14, sugar: 10, fiber: 2.4, 
        vitamin_c: 4.6, vitamin_a: 3, calcium: 6, iron: 0.1, potassium: 107 
      },
      image: '🍎',
      categoria: 'Fruta doce',
      cor: '#FF6B6B',
      estacao: 'Ano todo'
    },
    {
      id: 2,
      name: 'Banana',
      family: 'Musaceae',
      order: 'Zingiberales',
      nutritions: { 
        calories: 89, protein: 1.1, fat: 0.3, carbohydrates: 23, sugar: 12, fiber: 2.6, 
        vitamin_c: 8.7, vitamin_b6: 0.4, potassium: 358, magnesium: 27, folate: 20 
      },
      image: '🍌',
      categoria: 'Fruta tropical',
      cor: '#FFE66D',
      estacao: 'Ano todo'
    },
    {
      id: 3,
      name: 'Laranja',
      family: 'Rutaceae',
      order: 'Sapindales',
      nutritions: { 
        calories: 47, protein: 0.9, fat: 0.1, carbohydrates: 12, sugar: 9, fiber: 2.4, 
        vitamin_c: 53.2, vitamin_a: 11, folate: 30, thiamine: 0.087, potassium: 181 
      },
      image: '🍊',
      categoria: 'Fruta cítrica',
      cor: '#FF8C42',
      estacao: 'Inverno'
    },
    {
      id: 4,
      name: 'Morango',
      family: 'Rosaceae',
      order: 'Rosales',
      nutritions: { 
        calories: 32, protein: 0.7, fat: 0.3, carbohydrates: 8, sugar: 5, fiber: 2, 
        vitamin_c: 58.8, vitamin_a: 1, folate: 24, manganese: 0.386, potassium: 153 
      },
      image: '🍓',
      categoria: 'Fruta vermelha',
      cor: '#FF1744',
      estacao: 'Primavera'
    },
    {
      id: 5,
      name: 'Uva',
      family: 'Vitaceae',
      order: 'Vitales',
      nutritions: { 
        calories: 62, protein: 0.6, fat: 0.2, carbohydrates: 16, sugar: 15, fiber: 0.9, 
        vitamin_c: 10.8, vitamin_k: 14.6, copper: 0.127, potassium: 191, manganese: 0.071 
      },
      image: '🍇',
      categoria: 'Fruta doce',
      cor: '#8E44AD',
      estacao: 'Outono'
    },
    {
      id: 6,
      name: 'Abacate',
      family: 'Lauraceae',
      order: 'Laurales',
      nutritions: { 
        calories: 160, protein: 2, fat: 15, carbohydrates: 9, sugar: 0.7, fiber: 7, 
        vitamin_k: 21, vitamin_e: 2.07, vitamin_c: 10, folate: 81, potassium: 485 
      },
      image: '🥑',
      categoria: 'Fruta oleaginosa',
      cor: '#27AE60',
      estacao: 'Ano todo'
    },
    {
      id: 7,
      name: 'Manga',
      family: 'Anacardiaceae',
      order: 'Sapindales',
      nutritions: { 
        calories: 60, protein: 0.8, fat: 0.4, carbohydrates: 15, sugar: 14, fiber: 1.6, 
        vitamin_a: 54, vitamin_c: 36, vitamin_e: 0.9, folate: 43, potassium: 168 
      },
      image: '🥭',
      categoria: 'Fruta tropical',
      cor: '#FF9500',
      estacao: 'Verão'
    },
    {
      id: 8,
      name: 'Kiwi',
      family: 'Actinidiaceae',
      order: 'Ericales',
      nutritions: { 
        calories: 61, protein: 1.1, fat: 0.5, carbohydrates: 15, sugar: 9, fiber: 3, 
        vitamin_c: 92.7, vitamin_k: 40.3, vitamin_e: 1.46, folate: 25, potassium: 312 
      },
      image: '🥝',
      categoria: 'Fruta exótica',
      cor: '#8BC34A',
      estacao: 'Inverno'
    },
    {
      id: 9,
      name: 'Abacaxi',
      family: 'Bromeliaceae',
      order: 'Poales',
      nutritions: { 
        calories: 50, protein: 0.5, fat: 0.1, carbohydrates: 13, sugar: 9, fiber: 1.4, 
        vitamin_c: 47.8, manganese: 0.927, vitamin_b1: 0.079, folate: 18, potassium: 109 
      },
      image: '🍍',
      categoria: 'Fruta tropical',
      cor: '#FFC107',
      estacao: 'Verão'
    },
    {
      id: 10,
      name: 'Cereja',
      family: 'Rosaceae',
      order: 'Rosales',
      nutritions: { 
        calories: 63, protein: 1.1, fat: 0.2, carbohydrates: 16, sugar: 12, fiber: 2.1, 
        vitamin_c: 10, vitamin_a: 16, potassium: 222, copper: 0.1, manganese: 0.05 
      },
      image: '🍒',
      categoria: 'Fruta vermelha',
      cor: '#D32F2F',
      estacao: 'Verão'
    },
    {
      id: 11,
      name: 'Pera',
      family: 'Rosaceae',
      order: 'Rosales',
      nutritions: { 
        calories: 57, protein: 0.4, fat: 0.1, carbohydrates: 15, sugar: 10, fiber: 3.1, 
        vitamin_c: 4.3, vitamin_k: 4.4, copper: 0.08, potassium: 116, folate: 7 
      },
      image: '🍐',
      categoria: 'Fruta doce',
      cor: '#66BB6A',
      estacao: 'Outono'
    },
    {
      id: 12,
      name: 'Pêssego',
      family: 'Rosaceae',
      order: 'Rosales',
      nutritions: { 
        calories: 39, protein: 0.9, fat: 0.3, carbohydrates: 10, sugar: 8, fiber: 1.5, 
        vitamin_a: 326, vitamin_c: 6.6, vitamin_e: 0.73, folate: 4, potassium: 190 
      },
      image: '🍑',
      categoria: 'Fruta doce',
      cor: '#FF9800',
      estacao: 'Verão'
    },
    {
      id: 13,
      name: 'Limão',
      family: 'Rutaceae',
      order: 'Sapindales',
      nutritions: { 
        calories: 29, protein: 1.1, fat: 0.3, carbohydrates: 9, sugar: 2.5, fiber: 2.8, 
        vitamin_c: 53, vitamin_a: 1, calcium: 26, iron: 0.6, potassium: 103 
      },
      image: '🍋',
      categoria: 'Fruta cítrica',
      cor: '#FFEB3B',
      estacao: 'Ano todo'
    },
    {
      id: 14,
      name: 'Amora',
      family: 'Rosaceae',
      order: 'Rosales',
      nutritions: { 
        calories: 43, protein: 1.4, fat: 0.5, carbohydrates: 10, sugar: 4.9, fiber: 5.3, 
        vitamin_c: 21, vitamin_k: 19.8, manganese: 0.646, folate: 25, copper: 0.165 
      },
      image: '🫐',
      categoria: 'Fruta vermelha',
      cor: '#3F51B5',
      estacao: 'Verão'
    },
    {
      id: 15,
      name: 'Coco',
      family: 'Arecaceae',
      order: 'Arecales',
      nutritions: { 
        calories: 354, protein: 3.3, fat: 33, carbohydrates: 15, sugar: 6, fiber: 9, 
        manganese: 2.6, copper: 0.435, selenium: 10.1, potassium: 356, magnesium: 32 
      },
      image: '🥥',
      categoria: 'Fruta tropical',
      cor: '#8D6E63',
      estacao: 'Ano todo'
    },
    {
      id: 16,
      name: 'Melancia',
      family: 'Cucurbitaceae',
      order: 'Cucurbitales',
      nutritions: { 
        calories: 30, protein: 0.6, fat: 0.2, carbohydrates: 8, sugar: 6, fiber: 0.4, 
        vitamin_a: 569, vitamin_c: 8.1, lycopene: 4532, potassium: 112, thiamine: 0.033 
      },
      image: '🍉',
      categoria: 'Fruta tropical',
      cor: '#F44336',
      estacao: 'Verão'
    },
    {
      id: 17,
      name: 'Tangerina',
      family: 'Rutaceae',
      order: 'Sapindales',
      nutritions: { 
        calories: 53, protein: 0.8, fat: 0.3, carbohydrates: 13, sugar: 9, fiber: 1.8, 
        vitamin_c: 26.7, vitamin_a: 681, thiamine: 0.087, folate: 16, potassium: 166 
      },
      image: '🍊',
      categoria: 'Fruta cítrica',
      cor: '#FF5722',
      estacao: 'Inverno'
    },
    {
      id: 18,
      name: 'Romã',
      family: 'Lythraceae',
      order: 'Myrtales',
      nutritions: { 
        calories: 83, protein: 1.7, fat: 1.2, carbohydrates: 19, sugar: 14, fiber: 4, 
        vitamin_c: 10.2, vitamin_k: 16.4, folate: 38, potassium: 236, copper: 0.158 
      },
      image: '🍎',
      categoria: 'Fruta exótica',
      cor: '#E91E63',
      estacao: 'Outono'
    },
    {
      id: 19,
      name: 'Nectarina',
      family: 'Rosaceae',
      order: 'Rosales',
      nutritions: { 
        calories: 60, protein: 1.2, fat: 0.4, carbohydrates: 14, sugar: 11, fiber: 2.4, 
        vitamin_a: 332, vitamin_c: 5.4, vitamin_e: 0.77, folate: 5, potassium: 201 
      },
      image: '🍑',
      categoria: 'Fruta doce',
      cor: '#FF5722',
      estacao: 'Verão'
    },
    {
      id: 20,
      name: 'Figo',
      family: 'Moraceae',
      order: 'Rosales',
      nutritions: { 
        calories: 74, protein: 0.7, fat: 0.3, carbohydrates: 19, sugar: 16, fiber: 2.9, 
        calcium: 35, iron: 0.4, potassium: 232, magnesium: 17, folate: 6 
      },
      image: '🫐',
      categoria: 'Fruta doce',
      cor: '#8E44AD',
      estacao: 'Outono'
    }
  ];

  const carregarFrutas = async () => {
    setCarregando(true);
    try {
      // Simula uma chamada de API com delay para mostrar loading
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFrutas(frutasData);
    } catch (error) {
      console.error('Erro ao carregar frutas:', error);
    } finally {
      setCarregando(false);
    }
  };

  const obterBeneficios = (fruit) => {
    const beneficios = {
      'Maçã': 'Fortalece o sistema imunológico, melhora a digestão, rico em fibras e antioxidantes.',
      'Banana': 'Fornece energia rápida, rico em potássio, melhora o humor e combate a TPM.',
      'Laranja': 'Fortalece o sistema imunológico, rico em vitamina C, anti-inflamatório natural.',
      'Morango': 'Antioxidante poderoso, rico em vitamina C, bom para a pele e coração.',
      'Uva': 'Antioxidante natural, melhora a circulação, rico em resveratrol e vitaminas.',
      'Abacate': 'Rico em gorduras saudáveis, bom para o coração, pele e absorção de nutrientes.',
      'Manga': 'Rico em vitaminas A e C, melhora a visão, anti-inflamatório e antioxidante.',
      'Kiwi': 'Rico em vitamina C, melhora a digestão, fortalece imunidade e auxilia no sono.',
      'Abacaxi': 'Rico em bromelina, digestão facilitada, anti-inflamatório natural.',
      'Cereja': 'Anti-inflamatório natural, rica em antocianinas, auxilia no sono.',
      'Pera': 'Rica em fibras, facilita digestão, rica em potássio para pressão arterial.',
      'Pêssego': 'Rico em vitamina A e C, antioxidantes naturais, boa para a pele.',
      'Limão': 'Detoxificante natural, rico em vitamina C, alcaliniza o organismo.',
      'Amora': 'Rica em antioxidantes, anti-inflamatória, rico em fibras.',
      'Coco': 'Rico em gorduras MCT, hidratação, elektrolitos naturais.',
      'Melancia': 'Hidratante natural, rico em licopeno, diurético leve.',
      'Tangerina': 'Rica em vitamina C, facilidade de digestão, saboroso.',
      'Romã': 'Rica em antioxidantes, anti-inflamatória, rica em ferro.',
      'Nectarina': 'Rica em fibras, antioxidantes, vitaminas A e C.',
      'Figo': 'Rico em fibras, cálcio, ajuda no controle da glicemia.'
    };
    return beneficios[fruit.name] || 'Fruta rica em vitaminas e minerais essenciais para uma alimentação saudável.';
  };

  const obterRecomendacao = (fruit) => {
    const recomendacoes = {
      'Maçã': 'Ideal para lanches, excelente fonte de fibras, perfeita para prevenção de doenças.',
      'Banana': 'Perfeita pré ou pós-treino, rica em potássio, ótima para energia rápida.',
      'Laranja': 'Perfeita para fortalecer imunidade, ideal para sucos matinais.',
      'Morango': 'Ótima para sobremesas saudáveis, smoothies, saladas de frutas.',
      'Uva': 'Ideal para lanches, sobremesas, produção de sucos naturais.',
      'Abacate': 'Perfeita para saladas, tostas, smoothies, rica em gorduras boas.',
      'Manga': 'Perfeita para vitaminas, saladas, sucos naturais e sobremesas.',
      'Kiwi': 'Perfeita para vitaminas, sucos, saladas de frutas, consumo ao natural.',
      'Abacaxi': 'Ideal para sucos, saladas,churrascos, marinados.',
      'Cereja': 'Perfeita para sobremesas, geleias, consumo ao natural.',
      'Pera': 'Ideal para lanches, sobremesas, compotas saudáveis.',
      'Pêssego': 'Perfeita para sobremesas, saladas, consumo ao natural.',
      'Limão': 'Ideal para temperos, sucos detox, drinks sem álcool.',
      'Amora': 'Perfeita para sobremesas, iogurtes, smoothies.',
      'Coco': 'Ideal para sobremesas, receitas veganas, águas geladas.',
      'Melancia': 'Perfeita para hidratação, sobremesas leves, snacks refrescantes.',
      'Tangerina': 'Ideal para lanches, sucos, receitas de confeitaria.',
      'Romã': 'Perfeita para saladas, sucos, sobremesas saudáveis.',
      'Nectarina': 'Ideal para lanches, sobremesas, consumo ao natural.',
      'Figo': 'Perfeito para queijos, sobremesas, torradas com mel.'
    };
    return recomendacoes[fruit.name] || 'Ótima opção para uma alimentação saudável e equilibrada.';
  };

  const obterIndiceGlicemico = (fruit) => {
    const acucares = fruit.nutritions.sugar;
    if (acucares <= 5) return 'Baixo';
    if (acucares <= 12) return 'Médio';
    return 'Alto';
  };

  const obterVitaminas = (fruit) => {
    const vitaminas = [];
    if (fruit.nutritions.vitamin_c >= 30) vitaminas.push('Vitamina C');
    if (fruit.nutritions.vitamin_a >= 50) vitaminas.push('Vitamina A');
    if (fruit.nutritions.vitamin_e) vitaminas.push('Vitamina E');
    if (fruit.nutritions.vitamin_k) vitaminas.push('Vitamina K');
    if (fruit.nutritions.folate >= 15) vitaminas.push('Folato');
    if (fruit.nutritions.vitamin_b6) vitaminas.push('Vitamina B6');
    return vitaminas.length > 0 ? vitaminas.join(', ') : 'Rica em vitaminas essenciais';
  };

  const renderFruta = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.frutaCard, { borderColor: item.cor }]}
        onPress={() => {
          setFrutaSelecionada(item);
          setModalVisivel(true);
        }}
      >
        <View style={[styles.frutaEmojiContainer, { backgroundColor: `${item.cor}20` }]}>
          <Text style={styles.frutaEmoji}>{item.image}</Text>
        </View>
        <Text style={styles.frutaNome}>{item.name}</Text>
        <Text style={styles.frutaCalorias}>{item.nutritions.calories} kcal/100g</Text>
        <View style={[styles.categoriaTag, { backgroundColor: `${item.cor}20` }]}>
          <Text style={[styles.categoriaText, { color: item.cor }]}>{item.categoria}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const fecharModal = () => {
    setModalVisivel(false);
    setFrutaSelecionada(null);
  };

  useEffect(() => {
    carregarFrutas();
  }, []);

  if (carregando) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🍎 Frutas</Text>
          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>🍎</Text>
          </View>
        </View>
        
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingEmoji}>🍎🍌🍊🍓🍇</Text>
          <Text style={styles.loadingText}>Carregando frutas...</Text>
          <Text style={styles.loadingSubtext}>Carregando um mundo de sabores saudáveis!</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🍎 Frutas</Text>
        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>🍎</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          📊 {frutas.length} frutas disponíveis
        </Text>
        <Text style={styles.statsSubtext}>
          Clique em qualquer fruta para ver informações detalhadas
        </Text>
      </View>

      <FlatList
        data={frutas}
        renderItem={renderFruta}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listaFrutas}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={fecharModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={[styles.modalHeader, { backgroundColor: frutaSelecionada?.cor || '#0077B6' }]}>
              <Text style={styles.modalHeaderText}>INFORMAÇÕES</Text>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {frutaSelecionada && (
                <>
                  <View style={styles.modalHeaderInfo}>
                    <Text style={styles.modalFrutaNome}>{frutaSelecionada.name}</Text>
                    
                    <View style={[styles.modalImageContainer, { backgroundColor: `${frutaSelecionada.cor}20` }]}>
                      <Text style={styles.modalFrutaEmoji}>{frutaSelecionada.image}</Text>
                    </View>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Categoria:</Text>
                    <Text style={[styles.infoValue, { color: frutaSelecionada.cor }]}>{frutaSelecionada.categoria}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Época:</Text>
                    <Text style={styles.infoValue}>{frutaSelecionada.estacao}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Família:</Text>
                    <Text style={styles.infoValue}>{frutaSelecionada.family}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Caloria:</Text>
                    <Text style={styles.infoValue}>{frutaSelecionada.nutritions.calories} kcal por 100g</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Vitamina:</Text>
                    <Text style={styles.infoValue}>{obterVitaminas(frutaSelecionada)}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Índice glicêmico:</Text>
                    <Text style={styles.infoValue}>{obterIndiceGlicemico(frutaSelecionada)}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Açúcares:</Text>
                    <Text style={styles.infoValue}>{frutaSelecionada.nutritions.sugar}g por 100g</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fibras:</Text>
                    <Text style={styles.infoValue}>{frutaSelecionada.nutritions.fiber}g por 100g</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Potássio:</Text>
                    <Text style={styles.infoValue}>{frutaSelecionada.nutritions.potassium}mg por 100g</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Benefício:</Text>
                    <Text style={styles.infoValue}>{obterBeneficios(frutaSelecionada)}</Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Recomendado:</Text>
                    <Text style={styles.infoValue}>{obterRecomendacao(frutaSelecionada)}</Text>
                  </View>

                  <View style={styles.nutricionalBreakdown}>
                    <Text style={styles.nutricionalTitle}>Composição Nutricional (por 100g):</Text>
                    
                    <View style={styles.nutriRow}>
                      <Text style={styles.nutriLabel}>Proteínas:</Text>
                      <Text style={styles.nutriValue}>{frutaSelecionada.nutritions.protein}g</Text>
                    </View>
                    
                    <View style={styles.nutriRow}>
                      <Text style={styles.nutriLabel}>Gorduras:</Text>
                      <Text style={styles.nutriValue}>{frutaSelecionada.nutritions.fat}g</Text>
                    </View>
                    
                    <View style={styles.nutriRow}>
                      <Text style={styles.nutriLabel}>Carboidratos:</Text>
                      <Text style={styles.nutriValue}>{frutaSelecionada.nutritions.carbohydrates}g</Text>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            <TouchableOpacity style={[styles.modalButton, { backgroundColor: frutaSelecionada?.cor || '#0077B6' }]} onPress={fecharModal}>
              <Text style={styles.modalButtonText}>Sair</Text>
            </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#0077B6',
    paddingTop: 48,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  headerIcon: {
    padding: 8,
  },
  headerIconText: {
    fontSize: 20,
  },
  statsContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  statsSubtext: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingEmoji: {
    fontSize: 32,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  listaFrutas: {
    padding: 16,
    paddingTop: 8,
  },
  frutaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    margin: 8,
    flex: 1,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderTopWidth: 4,
  },
  frutaEmojiContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  frutaEmoji: {
    fontSize: 32,
  },
  frutaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
  },
  frutaCalorias: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoriaTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoriaText: {
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    margin: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    maxWidth: '90%',
    maxHeight: '85%',
  },
  modalHeader: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1,
  },
  modalBody: {
    padding: 20,
    maxHeight: 400,
  },
  modalHeaderInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalFrutaNome: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalFrutaEmoji: {
    fontSize: 48,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0077B6',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  nutricionalBreakdown: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  nutricionalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  nutriRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  nutriLabel: {
    fontSize: 12,
    color: '#666',
  },
  nutriValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  modalButton: {
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FrutasPage;