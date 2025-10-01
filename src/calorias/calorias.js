import React, { useState } from 'react';
import axios from 'axios';

// ============================================================================
// Componente: Buscador de Frutas (com API Fruityvice - sem chave)
// ============================================================================
function Caloria() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null); // Armazena um único resultado
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query) {
      setError('Por favor, digite o nome de uma fruta em inglês (ex: apple).');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // A API Fruityvice é aberta e não precisa de chave!
      const apiUrl = `https://www.fruityvice.com/api/fruit/${query.toLowerCase()}`;
      
      // Como a API não tem CORS configurado, usamos um proxy para evitar erros no navegador.
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/';

      const response = await axios.get(proxyUrl + apiUrl);
      
      setResult(response.data);

    } catch (searchError) {
      console.error("Erro ao buscar dados:", searchError);
      if (searchError.response && searchError.response.status === 404) {
        setError(`Fruta "${query}" não encontrada. Tente o nome em inglês.`);
      } else {
        setError('Não foi possível buscar os dados. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center font-sans p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-1">Buscador de Frutas</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Powered by Fruityvice API</p>

        <form onSubmit={handleSearch} className="mb-5">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Digite uma fruta em inglês (ex: banana)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className={`w-full text-white p-3 rounded-lg font-semibold flex items-center justify-center transition-colors ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <span>Buscar</span>
            )}
          </button>
        </form>

        <div className="mt-4 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Ocorreu um Erro: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {result && (
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800">{result.name} <span className="text-lg">({result.family})</span></h2>
              <p className="text-sm text-gray-500 mb-4">Informações nutricionais por 100g</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-3 rounded-md shadow-sm text-center"><span className="text-xs text-gray-500">Calorias</span><p className="text-lg font-bold text-blue-600">{result.nutritions.calories} kcal</p></div>
                <div className="bg-white p-3 rounded-md shadow-sm text-center"><span className="text-xs text-gray-500">Proteínas</span><p className="text-lg font-bold text-green-600">{result.nutritions.protein} g</p></div>
                <div className="bg-white p-3 rounded-md shadow-sm text-center"><span className="text-xs text-gray-500">Gorduras</span><p className="text-lg font-bold text-orange-600">{result.nutritions.fat} g</p></div>
                <div className="bg-white p-3 rounded-md shadow-sm text-center"><span className="text-xs text-gray-500">Açúcares</span><p className="text-lg font-bold text-purple-600">{result.nutritions.sugar} g</p></div>
              </div>
            </div>
          )}
          
          {!result && !isLoading && !error && (
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-center">
              <p>Digite o nome de uma fruta (em inglês) para começar a busca.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Componente: Login
// ============================================================================
const LoaderIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
    <path d="M12 2.99982V5.99982" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18V21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.63604 5.63603L7.75736 7.75735" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.2426 16.2426L18.364 18.364" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12H6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 12H21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.63604 18.364L7.75736 16.2426" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.2426 7.75735L18.364 5.63603" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function Login({ onLoginSuccess }) { 
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) {
      alert('Erro: Por favor, preencha o e-mail e a senha.');
      return;
    }
    setIsSubmitting(true);
    const apiUrl = 'http://127.0.0.1:8000/api/login';

    try {
      await axios.post(apiUrl, { email, senha });
      alert('Sucesso! Login realizado com sucesso!');
      onLoginSuccess();
    } catch (error) {
      console.error('--- ERRO NO LOGIN ---', error);
      if (error.response) {
        alert(`Erro no Login: ${error.response.data.message || 'Credenciais inválidas.'}`);
      } else if (error.request) {
        alert('Erro de Conexão: Não foi possível se comunicar com o servidor.');
      } else {
        alert('Erro: Ocorreu um erro inesperado.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 justify-center items-center p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">Bem-vindo!</h1>
        <p className="text-gray-500 text-center mb-8">Faça login para continuar.</p>
        
        <form onSubmit={handleLogin}>
          <label className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="exemplo@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
          <label className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
          <input
            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            type="password"
          />
          <button
            type="submit"
            className={`w-full text-white p-3 mt-4 rounded-lg font-semibold flex items-center justify-center transition-colors ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoaderIcon /> : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// Componente Principal: App (Gerenciador de Telas)
// ============================================================================
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Se o usuário estiver logado, mostra o FruitFinder.
  // Senão, mostra a tela de Login.
  if (isLoggedIn) {
    return <FruitFinder />;
  }

  return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
}

