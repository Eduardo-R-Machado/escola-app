import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getTrabalhosByTurmaMateria } from '../../services/trabalhoService';
import { getTurmaById } from '../../services/turmaService';
import { getMateriaById } from '../../services/materiaService';

const GerenciarTrabalhos = () => {
  const { turmaId, materiaId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [trabalhos, setTrabalhos] = useState([]);
  const [turma, setTurma] = useState(null);
  const [materia, setMateria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!turmaId || !materiaId) {
          setLoading(false);
          return;
        }
        
        // Buscar dados da turma
        const { turma: turmaData, error: turmaError } = await getTurmaById(turmaId);
        
        if (turmaError) {
          setError(turmaError);
          setLoading(false);
          return;
        }
        
        setTurma(turmaData);
        
        // Buscar dados da matéria
        const { materia: materiaData, error: materiaError } = await getMateriaById(materiaId);
        
        if (materiaError) {
          setError(materiaError);
          setLoading(false);
          return;
        }
        
        setMateria(materiaData);
        
        // Buscar trabalhos
        const { trabalhos: trabalhosData, error: trabalhosError } = await getTrabalhosByTurmaMateria(
          turmaId,
          materiaId
        );
        
        if (trabalhosError) {
          setError(trabalhosError);
        } else {
          setTrabalhos(trabalhosData);
        }
      } catch (err) {
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [turmaId, materiaId, currentUser.uid]);
  
  // Se não há turmaId ou materiaId, mostrar seletor de turmas
  if (!turmaId || !materiaId) {
    return <SeletorTurmaMateria />;
  }
  
  if (loading) {
    return <div className="text-center py-4">Carregando trabalhos...</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Gerenciar Trabalhos</h2>
          {turma && materia && (
            <p className="text-gray-600">
              Turma: {turma.nome} | Matéria: {materia.nome}
            </p>
          )}
        </div>
        <Link
          to={`/dashboard/professor/criar-trabalho/${turmaId}/${materiaId}`}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Novo Trabalho
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {trabalhos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum trabalho cadastrado ainda.
        </div>
      ) : (
        <div className="space-y-4">
          {trabalhos.map((trabalho) => {
            const dataEntrega = new Date(trabalho.data_entrega.seconds * 1000);
            const hoje = new Date();
            const prazoExpirado = dataEntrega < hoje;
            
            return (
              <div 
                key={trabalho.id} 
                className={`border rounded-lg p-4 ${
                  prazoExpirado ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="text-lg font-medium mb-1">{trabalho.titulo}</h3>
                    <p className="text-gray-600 mb-2">{trabalho.descricao}</p>
                    
                    <div className="flex flex-wrap text-sm mb-3">
                      <span className={`px-2 py-1 rounded mr-2 ${
                        prazoExpirado 
                          ? 'bg-red-200 text-red-800' 
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {prazoExpirado 
                          ? 'Prazo encerrado' 
                          : `Entrega até ${dataEntrega.toLocaleDateString()}`}
                      </span>
                    </div>
                    
                    {trabalho.arquivos_anexos && trabalho.arquivos_anexos.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium mb-1">Arquivos anexados:</p>
                        <div className="space-y-1">
                          {trabalho.arquivos_anexos.map((url, index) => (
                            <a 
                              key={index} 
                              href={url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-sm block"
                            >
                              Arquivo {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Link
                      to={`/dashboard/professor/avaliar-trabalho/${trabalho.id}`}
                      className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600"
                    >
                      Avaliar Entregas
                    </Link>
                    <button
                      className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                      onClick={() => navigate(`/dashboard/professor/editar-trabalho/${trabalho.id}`)}
                    >
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Componente para selecionar turma e matéria
const SeletorTurmaMateria = () => {
  const { currentUser } = useAuth();
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        // Aqui você buscaria as turmas associadas ao professor
        // Por enquanto, vamos usar um array vazio
        setTurmas([]);
      } catch (err) {
        setError('Erro ao carregar turmas.');
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
      <h1 className="text-2xl font-bold mb-6">Gerenciar Trabalhos</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {turmas.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Você ainda não possui turmas atribuídas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {turmas.map(turma => (
            <div key={turma.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">{turma.nome}</h2>
              <p className="text-gray-600 mb-4">Ano Letivo: {turma.ano_letivo}</p>
              
              <h3 className="text-md font-medium mb-2">Matérias:</h3>
              <div className="space-y-2">
                {/* Aqui você listaria as matérias do professor nesta turma */}
                {/* Por enquanto, usaremos placeholders */}
                <Link
                  to={`/dashboard/professor/trabalhos/${turma.id}/matematica`}
                  className="block p-2 bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Matemática
                </Link>
                <Link
                  to={`/dashboard/professor/trabalhos/${turma.id}/portugues`}
                  className="block p-2 bg-gray-50 hover:bg-gray-100 rounded"
                >
                  Português
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GerenciarTrabalhos;
              