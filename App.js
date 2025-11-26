// App.js

import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View,Button } from 'react-native';


// Importando o provedor e o contexto de autenticação
import { AuthProvider, AuthContext } from './context/AuthContext';

// Importando as telas
// ATENÇÃO: Os nomes aqui devem corresponder aos nomes usados nas rotas
import LoginScreen from "./src/Login/login"; // Renomeado para LoginScreen para consistência
import HomeScreen from "./src/home/home"; // Supondo que 'aguinha' seja sua tela Home
import aguinha from "./src/aguinha/aguinha"
import cadastro from "./src/Cadastro/cadastro"
import EditProfileScreen from './src/edição/EditProfileScreen';
import Imc from './src/Imc/imc';
import glice from './src/glicemia/glicemia';
import pressao from './src/pressao/pressao';

const Stack = createNativeStackNavigator();

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  return (
    <Button
      onPress={() => logout()}
      title="Sair"
      color="#e74c3c" // No iOS a cor é aplicada, no Android pode precisar de um estilo customizado
    />
  );
};

// Componente que decide quais rotas mostrar
const AppNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  // 1. Enquanto verifica se o usuário está logado, mostra uma tela de loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // 2. Se o carregamento terminou, retorna o navegador de rotas
  // ===== A CORREÇÃO ESTÁ AQUI: O RETURN ESTÁ DENTRO DA FUNÇÃO =====
  return (
    <Stack.Navigator>
      {user ? (
        // Se o usuário ESTÁ logado, mostra as telas principais
        <>
          <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{
            title: 'Página Inicial', // Título da página
            // Adiciona um componente à direita do cabeçalho
            headerRight: () => <LogoutButton />
          }}
        />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
          <Stack.Screen name="Aguinha" component={aguinha} />
          <Stack.Screen name="IMC" component={Imc} />
          <Stack.Screen name="glise" component={glice} />
          <Stack.Screen name="pressao" component={pressao} />
        </>
      ) : (
        // Se o usuário NÃO ESTÁ logado, mostra apenas a tela de login
     <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="Cadastro" 
            component={cadastro} 
            options={{ headerShown: false }} 
          />
        </>
      )}
    </Stack.Navigator>
  );
}; // <-- A FUNÇÃO AppNavigator TERMINA AQUI AGORA

// Componente principal do App
export default function App() {
  return (
    // Envolvemos tudo com o AuthProvider para que o contexto funcione
    <AuthProvider>
      <NavigationContainer>
        {/* Renderizamos nosso navegador inteligente */}
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
