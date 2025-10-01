 import React, { useState, useEffect } from 'react';
import {Text,View,SafeAreaView,TouchableOpacity,Dimensions,StatusBar,Modal,TextInput,Keyboard,ScrollView,Image,FlatList,Alert,} from 'react-native';
import Animated, {useSharedValue, useAnimatedStyle,withTiming,}
from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from "@react-navigation/native";
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import styles from './style';

const { width, height } = Dimensions.get('window');
const recipientes = [
  { id: "copoPequeno", amount: 150, img: require("../../assets/copo.png") },
  { id: "copoMedio", amount: 250, img: require("../../assets/copo.png") },
  { id: "garrafa", amount: 500, img: require("../../assets/copo.png") },
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
   const { user } = useContext(AuthContext);

  const porcentagem = meta > 0 ? consumido / meta : 0;

useEffect(() => {
    const loadWaterData = async () => {
      if (!user) return; // Se não há usuário, não faz nada

      try {
        const allWaterDataString = await AsyncStorage.getItem('@water_data');
        const allWaterData = allWaterDataString ? JSON.parse(allWaterDataString) : {};
        
        // Pega os dados específicos deste usuário
        const userData = allWaterData[user.id];

        if (userData) {
          console.log(`Dados de água encontrados para o usuário ${user.id}:`, userData);
          setMeta(userData.meta || 0);
          setConsumido(userData.consumido || 0);
          // Converte as strings de data de volta para objetos Date
          const historicoComDatas = userData.historico.map(item => ({
            ...item,
            timestamp: new Date(item.timestamp),
          }));
          setHistoricoConsumo(historicoComDatas || []);
          
          // Se o usuário já tem uma meta, não precisa abrir o modal
          if (userData.meta > 0) {
            setModalVisivel(false);
          }
        } else {
          console.log(`Nenhum dado de água encontrado para o usuário ${user.id}. Iniciando do zero.`);
          // Se não há dados, reseta tudo e mantém o modal de cálculo aberto
          setMeta(0);
          setConsumido(0);
          setHistoricoConsumo([]);
          setModalVisivel(true);
        }
      } catch (e) {
        console.error("Falha ao carregar dados de água.", e);
      }
    };

    loadWaterData();
  }, [user]); // Roda esta função sempre que o 'user' mudar (login/logout)

useEffect(() => {
    const saveWaterData = async () => {
      if (!user || meta === 0) return; // Não salva se não houver usuário ou meta definida

      try {
        const allWaterDataString = await AsyncStorage.getItem('@water_data');
        const allWaterData = allWaterDataString ? JSON.parse(allWaterDataString) : {};

        // Cria ou atualiza os dados para o usuário atual
        allWaterData[user.id] = {
          meta,
          consumido,
          historico: historicoConsumo,
        };

        await AsyncStorage.setItem('@water_data', JSON.stringify(allWaterData));
        console.log(`Dados de água salvos para o usuário ${user.id}`);
      } catch (e) {
        console.error("Falha ao salvar dados de água.", e);
      }
    };

    saveWaterData();
  }, [consumido, meta, historicoConsumo, user]);


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
                {item.timestamp.toLocaleDateString('pt-BR')} às {item.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.historicoVazio}>Você ainda não bebeu água hoje.</Text>}
      />
    </SafeAreaView>
  );

  const TelaHoje = () => (
    <View style={{flex: 1}}>
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
              <Text style={styles.goalText}>{meta > 0 ? `${meta}ml` : 'Definir Meta'}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.displayContainer}>
            <Text style={styles.consumedAmount}>{consumido}</Text>
            <Text style={styles.consumedUnit}>ml</Text>
          </View>
          <Text style={styles.percentageText}>
            {meta > 0 ? `${Math.round(porcentagem * 100)}% concluído` : 'Calcule sua meta para começar'}
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
                  <Text style={[styles.quickAddText, isSelected && styles.quickAddTextSelected]}>{recipiente.amount} ml</Text>
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
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisivel}
        onRequestClose={() => { if (meta > 0) setModalVisivel(false) }}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Personalize sua Meta</Text>
            <Text style={styles.modalSubtitle}>Insira seus dados para um cálculo preciso.</Text>
            <View style={styles.inputContainer}>
              <Image source={require("../../assets/copo.png")} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Sua altura (cm)" keyboardType="numeric" value={altura} onChangeText={setAltura} />
            </View>
            <View style={styles.inputContainer}>
              <Image source={require("../../assets/copo.png")} style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Seu peso (kg)" keyboardType="numeric" value={peso} onChangeText={setPeso} />
            </View>
            <TouchableOpacity style={styles.modalButton} onPress={calcularMeta}>
              <Text style={styles.modalButtonText}>Calcular Minha Meta</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
      
      <View style={{flex: 1}}>
        {telaAtiva === 'hoje' ? <TelaHoje /> : <TelaHistorico />}
      </View>

      {}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => setTelaAtiva('hoje')}>
          <Image 
            source={require("../../assets/copo.png")} 
            style={[
              styles.navIcon, 
              { tintColor: telaAtiva === 'hoje' ? '#0D47A1' : '#757575' }
            ]} 
          />
          <Text style={[styles.navText, { color: telaAtiva === 'hoje' ? '#0D47A1' : '#757575' }]}>
            Hoje
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => setTelaAtiva('historico')}>
          <Image 
            source={require("../../assets/copo.png")} 
            style={[
              styles.navIcon, 
              { tintColor: telaAtiva === 'historico' ? '#0D47A1' : '#757575' }
            ]} 
          />
          <Text style={[styles.navText, { color: telaAtiva === 'historico' ? '#0D47A1' : '#757575' }]}>
            Histórico
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
