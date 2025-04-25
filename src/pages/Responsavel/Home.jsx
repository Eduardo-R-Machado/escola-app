import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAlunosByResponsavel, vincularAlunoResponsavel } from '../../services/responsavelService';

// Componentes do responsável
import VerNotasAluno from '../../components/responsavel/VerNotasAluno';
import VerPresencaAluno from '../../components/responsavel/VerPresencaAluno';

const ResponsavelHome = () => {
  const { userDetails } = useAuth();
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Painel do Responsável</h2>
          <p className="text-gray-600 text-sm mt-1">Olá, {userDetails?.nome}</p>
        </div>
        
        <nav className="p-4">
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard/responsavel"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/responsavel'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/responsavel/alunos"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/responsavel/alunos'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Meus Alunos
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/responsavel/vincular-aluno"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/responsavel/vincular-aluno'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Vincular Aluno
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<ResponsavelDashboard />} />
          <Route path="/alunos" element={<MeusAlunos />} />
          <Route path="/vincular-aluno" element={<VincularAluno />} />
          <Route path="/aluno/:alunoId/notas/:turmaId/:materiaId" element={<VerNotasAlunoWrapper />} />
          <Route path="/aluno/:alunoId/presencas/:turmaId" element={<VerPresencaAlunoWrapper />} />
        </Routes>
      </div>
    </div>
  );
};

// Componente para exibir o dashboard principal do responsável
const ResponsavelDashboard = () => {
  const { currentUser } = useAuth();
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { alunos: alunosData } = await getAlunosByResponsavel(currentUser.uid);
        setAlunos(alunosData);
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
        {/* Card para Total de Alunos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Meus Alunos</h2>
          <p className="text-3xl font-bold text-blue-500">{alunos.length}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Alunos Vinculados</h2>
        
        {alunos.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Você ainda não possui alunos vinculados. 
            <Link to="/dashboard/responsavel/vincular-aluno" className="text-blue-500 hover:underline ml-1">
              Vincular agora
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {alunos.map(aluno => (
              <div key={aluno.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-medium">{aluno.nome}</h3>
                <p className="text-gray-600 mb-2">Matrícula: {aluno.matricula}</p>
                <p className="text-gray-600 mb-3">Relação: {aluno.tipo_relacao}</p>
                
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/dashboard/responsavel/aluno/${aluno.id}/notas/turma1/materia1`}
                    className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                  >
                    Ver Notas
                  </Link>
                  <Link
                    to={`/dashboard/responsavel/aluno/${aluno.id}/presencas/turma1`}
                    className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600"
                  >
                    Ver Presenças
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para listar alunos vinculados
const MeusAlunos = () => {
  const { currentUser } = useAuth();
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const { alunos: alunosData, error: alunosError } = await getAlunosByResponsavel(currentUser.uid);
        
        if (alunosError) {
          setError(alunosError);
        } else {
          setAlunos(alunosData);
        }
      } catch (err) {
        setError('Erro ao carregar alunos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlunos();
  }, [currentUser.uid]);
  
  if (loading) {
    return <div className="text-center py-4">Carregando alunos...</div>;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meus Alunos</h1>
        <Link
          to="/dashboard/responsavel/vincular-aluno"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Vincular Novo Aluno
        </Link>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {alunos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Você ainda não possui alunos vinculados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {alunos.map(aluno => (
            <div key={aluno.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium">{aluno.nome}</h3>
                  <p className="text-gray-600 mb-2">Matrícula: {aluno.matricula}</p>
                  <p className="text-gray-600 mb-3">Relação: {aluno.tipo_relacao}</p>
                </div>
                <button 
                  className="text-red-500 hover:text-red-700" 
                  title="Desvincular aluno"
                  onClick={() => handleDesvincular(aluno.relacao_id)}
                >
                  Desvincular
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Link
                  to={`/dashboard/responsavel/aluno/${aluno.id}/notas/turma1/materia1`}
                  className="bg-blue-500 text-white py-1 px-3 rounded text-sm hover:bg-blue-600"
                >
                  Ver Notas
                </Link>
                <Link
                  to={`/dashboard/responsavel/aluno/${aluno.id}/presencas/turma1`}
                  className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600"
                >
                  Ver Presenças
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente para vincular um novo aluno
const VincularAluno = () => {
  const { currentUser } = useAuth();
  const [matricula, setMatricula] = useState('');
  const [tipoRelacao, setTipoRelacao] = useState('pai');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Buscar o aluno pela matrícula
      const alunosRef = collection(db, 'users');
      const q = query(
        alunosRef,
        where('matricula', '==', matricula),
        where('tipo', '==', 'aluno')
      );
      
      const alunoSnap = await getDocs(q);
      
      if (alunoSnap.empty) {
        setError('Nenhum aluno encontrado com esta matrícula.');
        setLoading(false);
        return;
      }
      
      let alunoId = null;
      alunoSnap.forEach(doc => {
        alunoId = doc.id;
      });
      
      // Vincular o aluno ao responsável
      const { success, error } = await vincularAlunoResponsavel(
        alunoId,
        currentUser.uid,
        tipoRelacao
      );
      
      if (error) {
        setError(error);
      } else {
        setSuccess('Aluno vinculado com sucesso!');
        setMatricula('');
        setTipoRelacao('pai');
      }
    } catch (err) {
      setError('Erro ao vincular aluno. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Vincular Aluno</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <p className="text-gray-600">
            Para vincular um aluno à sua conta de responsável, informe a matrícula do aluno e seu tipo de relação.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="matricula">
              Matrícula do Aluno
            </label>
            <input
              id="matricula"
              type="text"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="tipoRelacao">
              Tipo de Relação
            </label>
            <select
              id="tipoRelacao"
              value={tipoRelacao}
              onChange={(e) => setTipoRelacao(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="pai">Pai</option>
              <option value="mae">Mãe</option>
              <option value="avo">Avô/Avó</option>
              <option value="tio">Tio/Tia</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? 'Vinculando...' : 'Vincular Aluno'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componentes wrapper para passagem de parâmetros de rota
const VerNotasAlunoWrapper = () => {
  const { alunoId, turmaId, materiaId } = useParams();
  return <VerNotasAluno alunoId={alunoId} turmaId={turmaId} materiaId={materiaId} />;
};

const VerPresencaAlunoWrapper = () => {
  const { alunoId, turmaId } = useParams();
  return <VerPresencaAluno alunoId={alunoId} turmaId={turmaId} />;
};

export default ResponsavelHome;