import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext'; 
import { useNavigation } from '@react-navigation/native';

function VacinasComSelecao() {
  const { user } = useContext(AuthContext); 
  const navigation = useNavigation();

  const [categoriaSelecionada, setCategoriaSelecionada] = useState('crianca');
  const [vacinasTomadas, setVacinasTomadas] = useState({});
  const [modalInfoVisivel, setModalInfoVisivel] = useState(false);
  const [vacinaSelecionada, setVacinaSelecionada] = useState(null);

  const storageKey = user ? `vacinas_${user.id}` : null;

  const categorias = [
    {
      id: 'crianca',
      nome: 'Criança/Adolescente',
      emoji: '👶',
      descricao: 'até 19 anos',
      faixa: '0-19 anos'
    },
    {
      id: 'adulto',
      nome: 'Adulto/Idoso',
      emoji: '👴',
      descricao: 'Acima de',
      faixa: '20+ anos'
    },
    {
      id: 'gestante',
      nome: 'Gestante',
      emoji: '🤰',
      descricao: 'Período Gestacional',
      faixa: 'Gravidez'
    }
  ];

  const calendariosVacinas = {
    crianca: [
      {
        periodo: 'Ao Nascer',
        idade: '0 dias',
        vacinas: [
          { nome: 'BCG (Bacilo de Calmette-Guérin)', obrigatoria: true, protecao: 'Tuberculose' },
          { nome: 'Hepatite B', obrigatoria: true, protecao: 'Hepatite B' }
        ]
      },
      {
        periodo: '2 Meses',
        idade: '2 meses',
        vacinas: [
          { nome: 'Pentavalente (DTP+Hib+HB)', obrigatoria: true, protecao: 'Difteria, Tétano, Coqueluche, Meningite, Hepatite B' },
          { nome: 'Vacina Pólio Inativada (VIP)', obrigatoria: true, protecao: 'Poliomielite' },
          { nome: 'Pneumocócica 10-valente', obrigatoria: true, protecao: 'Pneumonia, Meningite, Otite' },
          { nome: 'Rotavirus', obrigatoria: true, protecao: 'Diarréia por rotavirus' }
        ]
      },
      {
        periodo: '4 Meses',
        idade: '4 meses',
        vacinas: [
          { nome: 'Pentavalente (DTP+Hib+HB)', obrigatoria: true, protecao: 'Difteria, Tétano, Coqueluche, Meningite, Hepatite B' },
          { nome: 'Vacina Pólio Inativada (VIP)', obrigatoria: true, protecao: 'Poliomielite' },
          { nome: 'Pneumocócica 10-valente', obrigatoria: true, protecao: 'Pneumonia, Meningite, Otite' },
          { nome: 'Rotavirus', obrigatoria: true, protecao: 'Diarréia por rotavirus' }
        ]
      },
      {
        periodo: '6 Meses',
        idade: '6 meses',
        vacinas: [
          { nome: 'Pentavalente (DTP+Hib+HB)', obrigatoria: true, protecao: 'Difteria, Tétano, Coqueluche, Meningite, Hepatite B' },
          { nome: 'Vacina Pólio Inativada (VIP)', obrigatoria: true, protecao: 'Poliomielite' },
          { nome: 'Influenza (Gripe)', obrigatoria: true, protecao: 'Gripe' }
        ]
      },
      {
        periodo: '12 Meses',
        idade: '12 meses',
        vacinas: [
          { nome: 'Tríplice Viral (MMR)', obrigatoria: true, protecao: 'Sarampo, Caxumba, Rubéola' },
          { nome: 'Pneumocócica 10-valente', obrigatoria: true, protecao: 'Pneumonia, Meningite, Otite' },
          { nome: 'Meningocócica C', obrigatoria: true, protecao: 'Meningite por meningococo C' },
          { nome: 'Hepatite A', obrigatoria: true, protecao: 'Hepatite A' }
        ]
      },
      {
        periodo: '15 Meses',
        idade: '15 meses',
        vacinas: [
          { nome: 'Varicela', obrigatoria: true, protecao: 'Catapora' },
          { nome: 'Tetraviral (MMR+Varicela)', obrigatoria: true, protecao: 'Sarampo, Caxumba, Rubéola, Catapora' }
        ]
      },
      {
        periodo: '4 Anos',
        idade: '4 anos',
        vacinas: [
          { nome: 'DTP (Difteria, Tétano, Coqueluche)', obrigatoria: true, protecao: 'Difteria, Tétano, Coqueluche' },
          { nome: 'Vacina Pólio Oral (VOP)', obrigatoria: true, protecao: 'Poliomielite' }
        ]
      },
      {
        periodo: '9-14 Anos',
        idade: '9-14 anos',
        vacinas: [
          { nome: 'HPV (Papilomavíros Humano)', obrigatoria: true, protecao: 'Câncer de colo do útero, verrugas genitais' },
          { nome: 'Meningocócica ACWY', obrigatoria: true, protecao: 'Meningite por meningococo A,C,W,Y' }
        ]
      }
    ],
    adulto: [
      {
        periodo: 'Atualizar Vacinas',
        idade: '20+ anos',
        vacinas: [
          { nome: 'Difteria e Tétano (dT)', obrigatoria: true, protecao: 'Difteria e Tétano' },
          { nome: 'Febre Amarela', obrigatoria: true, protecao: 'Febre Amarela' },
          { nome: 'Hepatite B', obrigatoria: false, protecao: 'Hepatite B' },
          { nome: 'Tríplice Viral', obrigatoria: false, protecao: 'Sarampo, Caxumba, Rubéola' }
        ]
      },
      {
        periodo: 'Influenza',
        idade: 'Anual',
        vacinas: [
          { nome: 'Vacina da Gripe', obrigatoria: true, protecao: 'Influenza (Gripe)' }
        ]
      },
      {
        periodo: '65+ Anos',
        idade: '65+ anos',
        vacinas: [
          { nome: 'Pneumocócica 23-valente', obrigatoria: true, protecao: 'Pneumonia, Meningite' },
          { nome: 'Herpes Zoster', obrigatoria: false, protecao: 'Cobreiro' }
        ]
      }
    ],
    gestante: [
      {
        periodo: '1º Trimestre',
        idade: '0-12 semanas',
        vacinas: [
          { nome: 'Influenza (Gripe)', obrigatoria: true, protecao: 'Gripe - protege mãe e bebê' },
          { nome: 'dTpa (Tríplice Bacteriana)', obrigatoria: true, protecao: 'Tétano, Difteria, Coqueluche do bebê' }
        ]
      },
      {
        periodo: '2º-3º Trimestre',
        idade: '13-36 semanas',
        vacinas: [
          { nome: 'dTpa (Tríplice Bacteriana)', obrigatoria: true, protecao: 'Tétano, Difteria, Coqueluche do bebê' }
        ]
      },
      {
        periodo: 'Pós-Parto',
        idade: 'Imediatamente',
        vacinas: [
          { nome: 'dTpa (Tríplice Bacteriana)', obrigatoria: true, protecao: 'Tétano, Difteria, Coqueluche do bebê' }
        ]
      }
    ]
  };

  useEffect(() => {
    if (storageKey) {
      const carregarDados = async () => {
        try {
          const dadosSalvos = await AsyncStorage.getItem(storageKey);
          if (dadosSalvos) {
            setVacinasTomadas(JSON.parse(dadosSalvos));
          }
        } catch (error) {
          console.error('Erro ao carregar dados das vacinas:', error);
        }
      };
      carregarDados();
    }
  }, [storageKey]);

  const salvarDados = async (novosDados) => {
    if (storageKey) {
      try {
        await AsyncStorage.setItem(storageKey, JSON.stringify(novosDados));
      } catch (error) {
        console.error('Erro ao salvar dados das vacinas:', error);
      }
    }
  };

  const alternarVacina = (vacina, idade, periodo) => {
    const chave = `${vacina.nome}_${idade}_${periodo}`;
    const novosVacinasTomadas = {
      ...vacinasTomadas,
      [chave]: !vacinasTomadas[chave]
    };
    setVacinasTomadas(novosVacinasTomadas);
    salvarDados(novosVacinasTomadas);
  };

  const abrirInfoVacina = (vacina, idade, periodo) => {
    setVacinaSelecionada({ ...vacina, idade, periodo });
    setModalInfoVisivel(true);
  };

  const renderCategoriaButton = (categoria) => {
    const selecionada = categoriaSelecionada === categoria.id;
    return (
      <TouchableOpacity
        key={categoria.id}
        style={[
          styles.categoriaButton,
          selecionada ? styles.categoriaButtonSelecionada : styles.categoriaButtonNaoSelecionada
        ]}
        onPress={() => setCategoriaSelecionada(categoria.id)}
      >
        <Text style={styles.categoriaEmoji}>{categoria.emoji}</Text>
        <Text style={[
          styles.categoriaNome,
          selecionada ? styles.categoriaNomeSelecionada : styles.categoriaNomeNaoSelecionada
        ]}>
          {categoria.nome}
        </Text>
        <Text style={[
          styles.categoriaFaixa,
          selecionada ? styles.categoriaFaixaSelecionada : styles.categoriaFaixaNaoSelecionada
        ]}>
          {categoria.faixa}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderVacina = (vacina, idade, periodo) => {
    const chave = `${vacina.nome}_${idade}_${periodo}`;
    const tomada = vacinasTomadas[chave] || false;

    return (
      <TouchableOpacity
        key={chave}
        style={[
          styles.vacinaCard,
          tomada ? styles.vacinaCardTomada : styles.vacinaCardNaoTomada
        ]}
        onPress={() => alternarVacina(vacina, idade, periodo)}
        onLongPress={() => abrirInfoVacina(vacina, idade, periodo)}
      >
        <View style={styles.vacinaHeader}>
          <Text style={[
            styles.vacinaNome,
            tomada ? styles.vacinaNomeTomada : styles.vacinaNomeNaoTomada
          ]}>
            {vacina.nome}
          </Text>
          <View style={styles.vacinaIconContainer}>
            {tomada ? (
              <Text style={styles.checkIcon}>✓</Text>
            ) : (
              <Text style={styles.circleIcon}>○</Text>
            )}
          </View>
        </View>
        
        <View style={styles.vacinaFooter}>
          <Text style={[
            styles.vacinaProtecao,
            tomada ? styles.vacinaProtecaoTomada : styles.vacinaProtecaoNaoTomada
          ]}>
            {vacina.protecao}
          </Text>
          <Text style={[
            styles.vacinaObrigatoriedade,
            vacina.obrigatoria ? styles.obrigatoria : styles.opcional
          ]}>
            {vacina.obrigatoria ? 'Obrigatória' : 'Recomendada'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderPeriodo = (periodo) => {
    return (
      <View key={periodo.periodo} style={styles.periodoContainer}>
        <Text style={styles.periodoHeaderText}>{periodo.periodo}</Text>
        <Text style={styles.idadeHeaderText}>{periodo.idade}</Text>
        
        <View style={styles.vacinasContainer}>
          {periodo.vacinas.map((vacina, index) => 
            renderVacina(vacina, periodo.idade, periodo.periodo)
          )}
        </View>
      </View>
    );
  };

  const calendarioAtual = calendariosVacinas[categoriaSelecionada] || [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendário de Vacinação</Text>
      </View>

      <View style={styles.categoriasContainer}>
        <Text style={styles.categoriasTitle}>Selecione a categoria:</Text>
        <View style={styles.categoriasButtons}>
          {categorias.map(renderCategoriaButton)}
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {calendarioAtual.map(renderPeriodo)}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalInfoVisivel}
        onRequestClose={() => setModalInfoVisivel(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>ℹ️ Informações da Vacina</Text>
            
            {vacinaSelecionada && (
              <>
                <Text style={styles.modalVacinaNome}>{vacinaSelecionada.nome}</Text>
                <Text style={styles.modalInfoText}>Período: {vacinaSelecionada.periodo}</Text>
                <Text style={styles.modalInfoText}>Idade: {vacinaSelecionada.idade}</Text>
                <Text style={styles.modalInfoText}>Proteção: {vacinaSelecionada.protecao}</Text>
                <Text style={styles.modalInfoText}>
                  Tipo: {vacinaSelecionada.obrigatoria ? 'Obrigatória' : 'Recomendada'}
                </Text>
                
                <Text style={styles.modalDescription}>
                 -Toque na vacina para marcar como tomada ou não tomada
                  {'\n'}-Toque e segure para ver informações detalhadas
                  {'\n'}-As informações são salvas automaticamente
                </Text>
              </>
            )}
            
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setModalInfoVisivel(false)}
            >
              <Text style={styles.modalCloseButtonText}>Fechar</Text>
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
    padding: 16,
    backgroundColor: '#1976D2',
    paddingTop: 48,
  },
  backButton: {
    marginRight: 16,
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
    flex: 1,
  },
  categoriasContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoriasTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoriasButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoriaButton: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
  },
  categoriaButtonSelecionada: {
    backgroundColor: '#0077B6',
    borderColor: '#0077B6',
  },
  categoriaButtonNaoSelecionada: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
  },
  categoriaEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoriaNome: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  categoriaNomeSelecionada: {
    color: '#fff',
  },
  categoriaNomeNaoSelecionada: {
    color: '#333',
  },
  categoriaFaixa: {
    fontSize: 10,
    textAlign: 'center',
  },
  categoriaFaixaSelecionada: {
    color: '#E3F2FD',
  },
  categoriaFaixaNaoSelecionada: {
    color: '#666',
  },
  scrollView: {
    flex: 1,
    padding: 8,
  },
  periodoContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  periodoHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2196F3',
    marginBottom: 4,
  },
  idadeHeaderText: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
  },
  vacinasContainer: {
    gap: 8,
  },
  vacinaCard: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  vacinaCardTomada: {
    backgroundColor: '#F1F8E9',
    borderColor: '#4CAF50',
    borderLeftColor: '#4CAF50',
  },
  vacinaCardNaoTomada: {
    backgroundColor: '#FAFAFA',
    borderColor: '#E0E0E0',
    borderLeftColor: '#2196F3',
  },
  vacinaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  vacinaNome: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  vaccineNameTomada: {
    color: '#2E7D32',
    textDecorationLine: 'line-through',
  },
  vaccineNameNaoTomada: {
    color: '#333',
  },
  vacinaIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  circleIcon: {
    color: '#2196F3',
    fontSize: 16,
  },
  vacinaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vacinaProtecao: {
    fontSize: 11,
    flex: 1,
    marginRight: 8,
  },
  vacinaProtecaoTomada: {
    color: '#2E7D32',
  },
  vacinaProtecaoNaoTomada: {
    color: '#666',
  },
  vacinaObrigatoriedade: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  obrigatoria: {
    backgroundColor: '#FFEBEE',
    color: '#C62828',
  },
  opcional: {
    backgroundColor: '#E8F5E8',
    color: '#2E7D32',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  modalVacinaNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0077B6',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  modalDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
    lineHeight: 16,
  },
  modalCloseButton: {
    backgroundColor: '#0077B6',
    padding: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  modalCloseButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default VacinasComSelecao;