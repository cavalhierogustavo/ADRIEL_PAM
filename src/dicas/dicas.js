import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; 
import { useNavigation } from '@react-navigation/native';

function DicasPage() {
  const { user } = useContext(AuthContext); 
  const navigation = useNavigation();

  const [dica, setDica] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const tagsDeBemEstar = [
    'wisdom',
    'life',
    'happiness', 
    'mindfulness',
    'inspiration',
    'motivation',
    'peace',
    'gratitude',
    'self-improvement',
    'health'
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

  const buscarDicaDaApi = async () => {
    try {
      // Escolhe uma tag aleatória para variedade
      const tagAleatoria = tagsDeBemEstar[Math.floor(Math.random() * tagsDeBemEstar.length)];
      
      const response = await fetch(`https://api.quotable.io/quotes/random?tags=${tagAleatoria}&minLength=50&maxLength=200`);
      
      if (!response.ok) {
        throw new Error('Erro na resposta da API');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const novaDica = {
          content: data[0].content,
          author: data[0].author,
          categoria: tagAleatoria
        };
        setDica(novaDica);
      }
    } catch (error) {
      console.error('Erro ao buscar dica da API:', error);
      // Fallback para frases personalizadas
      const fraseAleatoria = frasesPersonalizadas[Math.floor(Math.random() * frasesPersonalizadas.length)];
      setDica(fraseAleatoria);
    }
  };

  const carregarNovaDica = async () => {
    setCarregando(true);
    await buscarDicaDaApi();
    setCarregando(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await buscarDicaDaApi();
    setRefreshing(false);
  };

  useEffect(() => {
    carregarNovaDica();
  }, []);

  const renderIconeCategoria = (categoria) => {
    const icones = {
      'wisdom': '🌟',
      'life': '🌱',
      'happiness': '😊',
      'mindfulness': '🧘',
      'inspiration': '✨',
      'motivation': '💪',
      'peace': '☮️',
      'gratitude': '🙏',
      'self-improvement': '📈',
      'health': '💚',
      'Meditação': '🧘‍♀️',
      'Motivação': '💪',
      'Saúde': '💚',
      'Gratidão': '🙏',
      'Inspiração': '✨',
      'Bem-estar': '🌸',
      'Crescimento Pessoal': '🌱',
      'Autocuidado': '💝',
      'Persistência': '🎯',
      'Saúde Mental': '🧠',
      'Equilíbrio': '⚖️'
    };
    return icones[categoria] || '💡';
  };

  if (carregando && !dica) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
          <Text style={styles.title}>💡 Dica do Dia</Text>
          <TouchableOpacity style={styles.supportButton}>
            <Text style={styles.supportButtonText}>💬</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0077B6" />
          <Text style={styles.loadingText}>Carregando sua dica inspiracional...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
<TouchableOpacity style={styles.voltarbtn} onPress={() => navigation.goBack()}>
          <Text style={styles.voltarbtnTxt}> VOLTAR </Text>
        </TouchableOpacity>
        <Text style={styles.title}>💡 Dica</Text>
        <TouchableOpacity style={styles.supportButton}>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.dicaCard}>
          <View style={styles.categoriaContainer}>
            <Text style={styles.categoriaIcon}>
              {dica ? renderIconeCategoria(dica.categoria) : '💡'}
            </Text>
            <Text style={styles.categoriaText}>
              {dica?.categoria || 'Bem-estar'}
            </Text>
          </View>

          {dica && (
            <>
              <View style={styles.florContainer}>
                <Text style={styles.florIcon}>🌸</Text>
              </View>

              <Text style={styles.dicaText}>{dica.content}</Text>
              
              {dica.author && (
                <Text style={styles.dicaAuthor}>— {dica.author}</Text>
              )}
            </>
          )}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={styles.novaDicaButton}
            onPress={carregarNovaDica}
            disabled={carregando}
          >
            {carregando ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Text style={styles.novaDicaButtonIcon}>🔄</Text>
                <Text style={styles.novaDicaButtonText}>Nova Dica</Text>
              </>
            )}
          </TouchableOpacity>

         
        </View>
      </View>

      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        colors={['#0077B6']}
        tintColor="#0077B6"
      />
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
  supportButton: {
    padding: 8,
  },
  supportButtonText: {
    fontSize: 20,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  dicaCard: {
    backgroundColor: '#F0F4F8',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
    minHeight: 300,
    justifyContent: 'center',
  },
  categoriaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoriaIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  categoriaText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0077B6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  florContainer: {
    marginBottom: 20,
  },
  florIcon: {
    fontSize: 48,
    opacity: 0.3,
  },
  dicaText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2C3E50',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  dicaAuthor: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#7F8C8D',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  novaDicaButton: {
    backgroundColor: '#0077B6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minWidth: 120,
    justifyContent: 'center',
  },
  novoDicaButtonDisabled: {
    opacity: 0.6,
  },
  novaDicaButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  novaDicaButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  favoritoButton: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#0077B6',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    minWidth: 120,
    justifyContent: 'center',
  },
  favoritoButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  favoritoButtonText: {
    color: '#0077B6',
    fontSize: 16,
    fontWeight: '600',
  },
  voltarbtn:{
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

export default DicasPage;