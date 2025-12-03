import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

// Ícones
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

function DicasPage() {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [dica, setDica] = useState(null);
  const [carregando, setCarregando] = useState(true);

  const tagsDeBemEstar = [
    'wisdom', 'life', 'happiness', 'mindfulness', 'inspiration',
    'motivation', 'peace', 'gratitude', 'self-improvement', 'health'
  ];

  const frasesPersonalizadas = [
    {
      content: "A meditação é um treino para a mente, trazendo foco e tranquilidade.",
      author: "Sabedoria Mindfulness",
      categoria: "Meditação"
    },
    {
      content: "Respire fundo e lembre-se de que você é muito mais forte do que imagina.",
      author: "Força Interior",
      categoria: "Motivação"
    },
    {
      content: "Seu corpo é seu templo. Cuide dele com amor e respeito.",
      author: "Bem-estar",
      categoria: "Saúde"
    },
    {
      content: "A gratidão transforma o que temos em suficiente.",
      author: "Mindfulness",
      categoria: "Gratidão"
    },
    {
      content: "Cada dia é uma nova oportunidade para ser a melhor versão de si mesmo.",
      author: "Crescimento Pessoal",
      categoria: "Inspiração"
    },
    {
      content: "O autocuidado não é egoísmo, é necessidade.",
      author: "Autocuidado",
      categoria: "Bem-estar"
    },
    {
      content: "Pequenos passos levam a grandes mudanças.",
      author: "Persistência",
      categoria: "Motivação"
    },
    {
      content: "Sua saúde mental é tão importante quanto sua saúde física.",
      author: "Equilíbrio",
      categoria: "Saúde Mental"
    }
  ];

  // Mapeamento de categorias para ícones
  const getIconForCategory = (categoria) => {
    const iconMap = {
      'wisdom': 'lightbulb-on-outline',
      'life': 'leaf',
      'happiness': 'emoticon-happy-outline',
      'mindfulness': 'yoga',
      'inspiration': 'sparkles',
      'motivation': 'arm-flex-outline',
      'peace': 'peace',
      'gratitude': 'hand-heart-outline',
      'self-improvement': 'chart-line',
      'health': 'heart-plus-outline',
      'Meditação': 'yoga',
      'Motivação': 'arm-flex-outline',
      'Saúde': 'heart-plus-outline',
      'Gratidão': 'hand-heart-outline',
      'Inspiração': 'sparkles',
      'Bem-estar': 'spa',
      'Crescimento Pessoal': 'chart-line',
      'Autocuidado': 'account-heart-outline',
      'Persistência': 'target-account',
      'Saúde Mental': 'brain',
      'Equilíbrio': 'scale-balance'
    };
    return iconMap[categoria] || 'lightbulb-outline';
  };

  const buscarDicaDaApi = async () => {
    try {
      const tagAleatoria = tagsDeBemEstar[Math.floor(Math.random() * tagsDeBemEstar.length)];
      const response = await fetch(`https://api.quotable.io/quotes/random?tags=${tagAleatoria}&minLength=50&maxLength=200`);
      
      if (!response.ok) throw new Error('Erro na API');
      
      const data = await response.json();
      if (data && data.length > 0) {
        setDica({
          content: data[0].content,
          author: data[0].author,
          categoria: tagAleatoria
        });
      }
    } catch (error) {
      console.error('Erro ao buscar dica:', error);
      const frase = frasesPersonalizadas[Math.floor(Math.random() * frasesPersonalizadas.length)];
      setDica(frase);
    } finally {
      setCarregando(false);
    }
  };

  const carregarNovaDica = () => {
    setCarregando(true);
    setTimeout(() => buscarDicaDaApi(), 300); // pequena pausa para UX
  };

  useEffect(() => {
    buscarDicaDaApi();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* BOTÃO VOLTAR — 100% IGUAL ÀS OUTRAS TELAS */}
        <TouchableOpacity style={styles.voltarbtn} onPress={() => navigation.goBack()}>
          <Text style={styles.voltarbtnTxt}> VOLTAR </Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.titleGroup}>
            <MaterialCommunityIcons name="lightbulb-on" size={32} color="#0D47A1" />
            <Text style={styles.title}>Dica do Dia</Text>
          </View>
          <Text style={styles.subtitle}>Inspiração para seu bem-estar</Text>
        </View>

        <View style={styles.card}>
          {carregando ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0077B6" />
              <Text style={styles.loadingText}>Buscando sua dica inspiracional...</Text>
            </View>
          ) : dica ? (
            <View style={styles.dicaContent}>
              <View style={styles.categoriaBadge}>
                <MaterialCommunityIcons
                  name={getIconForCategory(dica.categoria)}
                  size={18}
                  color="#0D47A1"
                />
                <Text style={styles.categoriaText}>
                  {dica.categoria}
                </Text>
              </View>

              <View style={styles.florContainer}>
                <MaterialCommunityIcons name="flower" size={48} color="rgba(25, 118, 210, 0.2)" />
              </View>

              <Text style={styles.dicaText}>{dica.content}</Text>

              {dica.author && (
                <Text style={styles.dicaAuthor}>— {dica.author}</Text>
              )}
            </View>
          ) : null}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, carregando && styles.buttonDisabled]}
            onPress={carregarNovaDica}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons name="refresh" size={16} color="#fff" style={styles.buttonIcon} />
                <Text style={styles.primaryButtonText}>Nova Dica</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#0D47A1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 24,
    padding: 24,
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1976D2',
    textAlign: 'center',
  },
  dicaContent: {
    alignItems: 'center',
    width: '100%',
  },
  categoriaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#B0BEC5',
  },
  categoriaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0D47A1',
    marginLeft: 6,
  },
  florContainer: {
    marginBottom: 20,
  },
  dicaText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#0D47A1',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  dicaAuthor: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#1976D2',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  primaryButton: {
    height: 52,
    backgroundColor: '#0077B6',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
    minWidth: 140,
  },
  buttonDisabled: {
    backgroundColor: '#B0BEC5',
  },
  buttonIcon: {
    marginRight: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default DicasPage;