import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getTurmasByAluno } from '../../services/turmaService';

import VerNotas from '../../components/aluno/VerNotas';
import VerTrabalhos from '../../components/aluno/VerTrabalhos';
import EntregarTrabalho from '../../components/aluno/EntregarTrabalho';

const AlunoHome = () => {
  const { userDetails } = useAuth();
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Painel do Aluno</h2>
          <p className="text-gray-600 text-sm mt-1">Olá, {userDetails?.nome}</p>
        </div>
        
        <nav className="p-4">
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard/aluno"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/aluno'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/aluno/notas"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/aluno/notas'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Minhas Notas
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/aluno/presencas"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/aluno/presencas'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Minhas Presenças
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/aluno/trabalhos"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/aluno/trabalhos'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Trabalhos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<AlunoDashboard />} />
          <Route path="/notas" element={<SelecionarTurmaMateria destino="notas" />} />
          <Route path="/notas/:turmaId/:materiaId" element={<VerNotasWrapper />} />
          <Route path="/presencas" element={<SelecionarTurmaMateria destino="presencas" />} />
          <Route path="/trabalhos" element={<SelecionarTurmaMateria destino="trabalhos" />} />
          <Route path="/trabalhos/:turmaId/:materiaId" element={<VerTrabalhosWrapper />} />
          <Route path="/entregar-trabalho/:trabalhoId" element={<EntregarTrabalho />} />
        </Routes>
      </div>
    </div>
  );
};

// Componente para exibir o dashboard principal do aluno
const AlunoDashboard = () => {
  const { currentUser } = useAuth();
  const [turmas, setTurmas] = useState([]);
  const [trabalhosPendentes, setTrabalhosPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { turmas: turmasData } = await getTurmasByAluno(currentUser.uid);
        setTurmas(turmasData);
        
        // Aqui você buscaria os trabalhos pendentes do aluno
        setTrabalhosPendentes([]);
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser.uid]);
  
  if (loading) {
    return <div className="text-center py-4">Carregando dados...</div>;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card para Turmas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Minhas Turmas</h2>
          <p className="text-3xl font-bold text-blue-500">{turmas.length}</p>
        </div>
        
        {/* Card para Trabalhos Pendentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Trabalhos Pendentes</h2>
          <p className="text-3xl font-bold text-red-500">{trabalhosPendentes.length}</p>
        </div>
        
        {/* Card para Média Geral */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Média Geral</h2>
          <p className="text-3xl font-bold text-green-500">0.0</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Trabalhos Pendentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Trabalhos Pendentes</h2>
          
          {trabalhosPendentes.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Nenhum trabalho pendente.
            </div>
          ) : (
            <div className="space-y-3">
              {trabalhosPendentes.map(trabalho => (
                <div key={trabalho.id} className="border-b pb-3">
                  <h3 className="font-medium">{trabalho.titulo}</h3>
                  <p className="text-sm text-gray-600">
                    Entrega até: {new Date(trabalho.data_entrega).toLocaleDateString()}
                  </p>
                  <div className="mt-2">
                    <Link
                      to={`/dashboard/aluno/entregar-trabalho/${trabalho.id}`}
                      className="text-blue-500 hover:underline text-sm"
                    >
                      Entregar Trabalho
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Últimas Notas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Últimas Notas</h2>
          
          <div className="text-center py-4 text-gray-500">
            Nenhuma nota registrada recentemente.
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para seleção de turma e matéria
const SelecionarTurmaMateria = ({ destino }) => {
  const { currentUser } = useAuth();
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const { turmas: turmasData, error: turmasError } = await getTurmasByAluno(currentUser.uid);
        
        if (turmasError) {
          setError(turmasError);
        } else {
          setTurmas(turmasData);
        }
      } catch (err) {
        setError('Erro ao carregar turmas. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTurmas();
  }, [currentUser.uid]);
  
  if (loading) {
    return <div className="text-center py-4">Carregando turmas...</div>;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {destino === 'notas' && 'Minhas Notas'}
        {destino === 'presencas' && 'Minhas Presenças'}
        {destino === 'trabalhos' && 'Meus Trabalhos'}
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {turmas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Você ainda não está cadastrado em nenhuma turma.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmas.map(turma => (
            <div key={turma.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{turma.nome}</h2>
              <p className="text-gray-600 mb-4">Ano Letivo: {turma.ano_letivo}</p>
              
              <h3 className="text-md font-medium mb-2">Matérias:</h3>
              <div className="space-y-2">
                {/* Aqui você listaria as matérias da turma */}
                {/* Por enquanto, usaremos um placeholder */}
                <Link
                  to={`/dashboard/aluno/${destino}/${turma.id}/matematica`}
                  className="block p-2 bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Matemática
                </Link>
                <Link
                  to={`/dashboard/aluno/${destino}/${turma.id}/portugues`}
                  className="block p-2 bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Português
                </Link>
                <Link
                  to={`/dashboard/aluno/${destino}/${turma.id}/historia`}
                  className="block p-2 bg-gray-50 hover:bg-gray-100 rounded"
                >
                  História
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componentes wrapper para passagem de parâmetros de rota
const VerNotasWrapper = () => {
  const { turmaId, materiaId } = useParams();
  return <VerNotas turmaId={turmaId} materiaId={materiaId} />;
};

const VerTrabalhosWrapper = () => {
  const { turmaId, materiaId } = useParams();
  return <VerTrabalhos turmaId={turmaId} materiaId={materiaId} />;
};

export default AlunoHome;