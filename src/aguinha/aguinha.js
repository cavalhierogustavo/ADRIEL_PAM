import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Modal,
  TextInput,
  Keyboard,
  ScrollView,
  Image,
  FlatList,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';

import styles from './style';

const { width, height } = Dimensions.get('window');

const recipientes = [
  { id: 'copoPequeno', amount: 150, img: require('../../assets/copo.png') },
  { id: 'copoMedio', amount: 250, img: require('../../assets/garafa.png') },
  { id: 'garrafa', amount: 500, img: require('../../assets/galao.png') },
];

const AnimatedWaterFill = ({ progress }) => {
  const fillHeight = useSharedValue(0);
  useEffect(() => {
    fillHeight.value = withTiming(progress * height, { duration: 1000 });
  }, [progress]);
  const animatedFillStyle = useAnimatedStyle(() => ({ height: fillHeight.value }));
  return (
    <Animated.View style={[styles.waterFillContainer, animatedFillStyle]}>
      <View style={styles.waterFillTop} />
    </Animated.View>
  );
};

export default function WaterTrackerApp() {
  const navigation = useNavigation();
  const [telaAtiva, setTelaAtiva] = useState('hoje');
  const [consumido, setConsumido] = useState(0);
  const [meta, setMeta] = useState(0);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [modalVisivel, setModalVisivel] = useState(true);
  const [historicoConsumo, setHistoricoConsumo] = useState([]);
  const [selecionado, setSelecionado] = useState(recipientes[1]);

  const porcentagem = meta > 0 ? consumido / meta : 0;

  const calcularMeta = () => {
    Keyboard.dismiss();
    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);
    if (!pesoNum || pesoNum <= 0 || !alturaNum || alturaNum <= 0) {
      Alert.alert('Atenção', 'Por favor, insira valores válidos para peso e altura.');
      return;
    }
    const metaCalculada = Math.round(pesoNum * 35);
    setMeta(metaCalculada);
    setConsumido(0);
    setHistoricoConsumo([]);
    setModalVisivel(false);
  };

  const handleBeber = () => {
    if (meta === 0) {
      setModalVisivel(true);
      return;
    }
    if (!selecionado) {
      Alert.alert('Selecione uma quantidade', 'Clique em um dos recipientes acima antes de beber.');
      return;
    }
    const { amount, img } = selecionado;
    const novoConsumoTotal = Math.min(consumido + amount, meta);
    setConsumido(novoConsumoTotal);
    const novoRegistro = {
      id: Date.now().toString(),
      quantidade: amount,
      imagem: img,
      timestamp: new Date(),
    };
    setHistoricoConsumo([novoRegistro, ...historicoConsumo]);
  };

  const abrirModalRecalculo = () => setModalVisivel(true);

  const TelaHistorico = () => (
    <SafeAreaView style={styles.historicoContainer}>
      <Text style={styles.historicoTitle}>Histórico de Consumo</Text>
      <FlatList
        data={historicoConsumo}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.historicoItem}>
            <Image source={item.imagem} style={styles.historicoImagem} />
            <View style={styles.historicoDetalhes}>
              <Text style={styles.historicoQuantidade}>{item.quantidade} ml</Text>
              <Text style={styles.historicoTimestamp}>
                {item.timestamp.toLocaleDateString('pt-BR')} às{' '}
                {item.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.historicoVazio}>Você ainda não bebeu água hoje.</Text>
        }
      />
    </SafeAreaView>
  );

  const TelaHoje = () => (
    <View style={{ flex: 1 }}>
      <View style={styles.mainContent}>
        <TouchableOpacity style={styles.voltarbtn} onPress={() => navigation.goBack()}>
          <Text style={styles.voltarbtnTxt}> VOLTAR </Text>
        </TouchableOpacity>

        <View>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Atinja o seu</Text>
            <Text style={styles.headerTitleBold}>objetivo diário</Text>
          </View>
          <TouchableOpacity style={styles.goalMarkerContainer} onPress={abrirModalRecalculo}>
            <View style={styles.goalLine} />
            <View style={styles.goalFlag}>
              <Text style={styles.goalText}>
                {meta > 0 ? `${meta}ml` : 'Definir Meta'}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.displayContainer}>
            <Text style={styles.consumedAmount}>{consumido}</Text>
            <Text style={styles.consumedUnit}>ml</Text>
          </View>
          <Text style={styles.percentageText}>
            {meta > 0
              ? `${Math.round(porcentagem * 100)}% concluído`
              : 'Calcule sua meta para começar'}
          </Text>
        </View>
        <View style={styles.bottomControls}>
          <View style={styles.quickAddContainer}>
            {recipientes.map((recipiente) => {
              const isSelected = selecionado && selecionado.id === recipiente.id;
              return (
                <TouchableOpacity
                  key={recipiente.id}
                  style={[styles.quickAddButton, isSelected && styles.quickAddButtonSelected]}
                  onPress={() => setSelecionado(recipiente)}>
                  <Image source={recipiente.img} style={styles.quickAddImage} />
                  <Text
                    style={[
                      styles.quickAddText,
                      isSelected && styles.quickAddTextSelected,
                    ]}>
                    {recipiente.amount} ml
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={styles.mainButton} onPress={handleBeber}>
            <Text style={styles.mainButtonText}>BEBER</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AnimatedWaterFill progress={porcentagem} />

      {/* Modal de Configuração */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => {
          if (meta > 0) setModalVisivel(false);
        }}>
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Personalize sua Meta</Text>
            <Text style={styles.modalSubtitle}>Insira seus dados para um cálculo preciso.</Text>
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/copo.png')} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Sua altura (cm)"
                keyboardType="numeric"
                value={altura}
                onChangeText={setAltura}
              />
            </View>
            <View style={styles.inputContainer}>
              <Image source={require('../../assets/copo.png')} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Seu peso (kg)"
                keyboardType="numeric"
                value={peso}
                onChangeText={setPeso}
              />
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={calcularMeta}>
              <Text style={styles.modalButtonText}>Calcular Minha Meta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>

      {/* Conteúdo principal */}
      <View style={{ flex: 1 }}>
        {telaAtiva === 'hoje' ? <TelaHoje /> : <TelaHistorico />}
      </View>

      {/* Barra de navegação com ícones personalizados */}
      <View style={styles.navBar}>
        {/* Aba Hoje */}
        <TouchableOpacity style={styles.navButton} onPress={() => setTelaAtiva('hoje')}>
          <Image
            source={require('../../assets/glass.png')}
            style={[
              styles.navIcon,
              { opacity: telaAtiva === 'hoje' ? 1 : 0.5 },
            ]}
          />
          <Text
            style={[
              styles.navText,
              { color: telaAtiva === 'hoje' ? '#0D47A1' : '#757575' },
            ]}>
            Hoje
          </Text>
        </TouchableOpacity>

        {/* Aba Histórico */}
        <TouchableOpacity style={styles.navButton} onPress={() => setTelaAtiva('historico')}>
          <Image
            source={require('../../assets/water.png')}
            style={[
              styles.navIcon,
              { opacity: telaAtiva === 'historico' ? 1 : 0.5 },
            ]}
          />
          <Text
            style={[
              styles.navText,
              { color: telaAtiva === 'historico' ? '#0D47A1' : '#757575' },
            ]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}