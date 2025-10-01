import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD',
  },

voltarbtn:{
    position: 'absolute',
    top: 20,
    left: 30,
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

  // --- Animação de preenchimento de água ---
  waterFillContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ADD8E6',
    overflow: 'hidden',
  },
  waterFillTop: {
    position: 'absolute',
    top: -50,
    left: -width / 2,
    right: -width / 2,
    height: width * 2,
    width: width * 2,
    backgroundColor: '#ADD8E6',
    borderRadius: width,
  },

  // --- Bolhas animadas ---
  bubblesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height,
    pointerEvents: 'none',
  },
  bubble: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // --- Conteúdo principal ---
  mainContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: height * 0.08,
    paddingHorizontal: 30,
  },
  headerTitle: {
    fontSize: 38,
    color: '#0D47A1',
    fontWeight: '300',
  },
  headerTitleBold: {
    fontSize: 38,
    color: '#0D47A1',
    fontWeight: '700',
  },

  // --- Meta de consumo ---
  goalMarkerContainer: {
    position: 'absolute',
    top: height * 0.25,
    right: 30,
    alignItems: 'flex-end',
  },
  goalLine: {
    width: 60,
    height: 2,
    backgroundColor: '#B0BEC5',
    borderStyle: 'dashed',
  },
  goalFlag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F8E9',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 5,
    borderColor: '#C5E1A5',
    borderWidth: 1,
  },
  goalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#33691E',
  },

  // --- Display de consumo ---
  displayContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginTop: height * 0.05,
  },
  consumedAmount: {
    fontSize: 90,
    fontWeight: '600',
    color: '#0D47A1',
  },
  consumedAmountHighlight: {
    color: '#1976D2',
    textShadowColor: 'rgba(25, 118, 210, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  consumedUnit: {
    fontSize: 30,
    fontWeight: '500',
    color: '#0D47A1',
    marginLeft: 8,
  },
  percentageText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#0D47A1',
    marginTop: 15,
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  // --- Botões de ações rápidas ---
  bottomControls: {
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  quickAddContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  quickAddButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingVertical: 12,
    borderRadius: 20,
    width: width * 0.25,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickAddButtonSelected: {
    borderColor: '#0077B6',
    borderWidth: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    transform: [{ scale: 1.05 }],
    shadowColor: '#0077B6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  quickAddImage: {
    width: 40,
    height: 40,
    marginBottom: 5,
  },
  quickAddText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#0D47A1',
  },
  quickAddTextSelected: {
    color: '#023E8A',
    fontWeight: '700',
  },

  // --- Botão principal ---
  mainButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  mainButtonHighlight: {
    backgroundColor: '#E3F2FD',
    shadowColor: '#1976D2',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 12,
  },
  mainButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0D47A1',
  },

  // --- Barra de navegação inferior ---
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#CFD8DC',
    paddingTop: 10,
    paddingBottom: 15,
  },
  navButton: {
    alignItems: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
  },
  navIcon: {
    width: 26,
    height: 26,
    marginBottom: 2,
    resizeMode: 'contain',
  },

  // --- Modal ---
  modalContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalView: {
    width: width * 0.9,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0D47A1',
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#455A64',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  inputIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 18,
    color: 'grey',
    borderWidth: 1,
    borderColor: '#B0BEC5',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: '#3895D3',
    borderRadius: 10,
    padding: 15,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // --- Histórico ---
  historicoContainer: {
    flex: 1,
    backgroundColor: '#F0F8FF',
  },
  historicoTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0D47A1',
    textAlign: 'center',
    paddingVertical: 40,
  },
  historicoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#B3E5FC',
    elevation: 1,
  },
  historicoItemHighlight: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
    borderWidth: 2,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  historicoImagem: {
    width: 32,
    height: 32,
  },
  historicoDetalhes: {
    marginLeft: 15,
  },
  historicoQuantidade: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  historicoTimestamp: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  historicoVazio: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#757575',
  },
});

