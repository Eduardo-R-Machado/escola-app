import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Componentes do professor
import RegistrarPresenca from '../../components/professor/RegistrarPresenca';
import RegistrarNotas from '../../components/professor/RegistrarNotas';
import CriarTrabalho from '../../components/professor/CriarTrabalho';
import GerenciarTrabalhos from '../../components/professor/GerenciarTrabalhos';
import AvaliarTrabalhos from '../../components/professor/AvaliarTrabalhos';


const ProfessorHome = () => {
  const { userDetails } = useAuth();
  const location = useLocation();

  const RegistrarPresencaWrapper = () => {
    const { turmaId, materiaId } = useParams();
    return <RegistrarPresenca turmaId={turmaId} materiaId={materiaId} />;
  };
  
  const RegistrarNotasWrapper = () => {
    const { turmaId, materiaId } = useParams();
    return <RegistrarNotas turmaId={turmaId} materiaId={materiaId} />;
  };
  
  const CriarTrabalhoWrapper = () => {
    const { turmaId, materiaId } = useParams();
    return <CriarTrabalho turmaId={turmaId} materiaId={materiaId} />;
  };
  
  const AvaliarTrabalhosWrapper = () => {
    const { trabalhoId } = useParams();
    return <AvaliarTrabalhos trabalhoId={trabalhoId} />;
  };
  
  const EditarTrabalhoWrapper = () => {
    const { trabalhoId } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
      // Redirecionar para a página de criar trabalho por enquanto
      // No futuro, você pode implementar um componente específico para editar
      navigate(`/dashboard/professor/criar-trabalho/turma_id/materia_id`);
    }, [trabalhoId, navigate]);
    
    return null;
  };
  
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Painel do Professor</h2>
          <p className="text-gray-600 text-sm mt-1">Olá, {userDetails?.nome}</p>
        </div>
        
        <nav className="p-4">
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard/professor"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/professor'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/dashboard/professor/turmas"
              className={`block p-2 rounded ${
                location.pathname === '/dashboard/professor/turmas'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Minhas Turmas
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/dashboard/professor/presencas"
              className={`block p-2 rounded ${
                location.pathname === '/dashboard/professor/presencas'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Registrar Presenças
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/dashboard/professor/notas"
              className={`block p-2 rounded ${
                location.pathname === '/dashboard/professor/notas'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Registrar Notas
            </Link>
          </li>
          <li className="mb-2">
            <Link
              to="/dashboard/professor/trabalhos"
              className={`block p-2 rounded ${
                location.pathname === '/dashboard/professor/trabalhos'
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
        <Route path="/" element={<ProfessorDashboard />} />
        <Route path="/turmas" element={<MinhasTurmas />} />
        <Route path="/presencas" element={<SelecionarTurmaPresencas />} />
        <Route path="/presencas/:turmaId/:materiaId" element={<RegistrarPresencaWrapper />} />
        <Route path="/notas" element={<SelecionarTurmaNotas />} />
        <Route path="/notas/:turmaId/:materiaId" element={<RegistrarNotasWrapper />} />
        <Route path="/trabalhos" element={<GerenciarTrabalhos />} />
        <Route path="/trabalhos/:turmaId/:materiaId" element={<GerenciarTrabalhos />} />
        <Route path="/criar-trabalho/:turmaId/:materiaId" element={<CriarTrabalhoWrapper />} />
        <Route path="/avaliar-trabalho/:trabalhoId" element={<AvaliarTrabalhosWrapper />} />
        <Route path="/editar-trabalho/:trabalhoId" element={<EditarTrabalhoWrapper />} />
      </Routes>
    </div>
  </div>
);
};

// Componente para exibir o dashboard principal do professor
const ProfessorDashboard = () => {
return (
  <div>
    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Card para Total de Turmas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-2">Minhas Turmas</h2>
        <p className="text-3xl font-bold text-blue-500">0</p>
      </div>
      
      {/* Card para Total de Aulas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-2">Aulas Registradas</h2>
        <p className="text-3xl font-bold text-green-500">0</p>
      </div>
      
      {/* Card para Total de Trabalhos */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-2">Trabalhos Ativos</h2>
        <p className="text-3xl font-bold text-purple-500">0</p>
      </div>
    </div>
    
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Lista de Próximas Aulas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Próximas Aulas</h2>
        <div className="text-center text-gray-500 py-4">
          Nenhuma aula agendada.
        </div>
      </div>
      
      {/* Ações Rápidas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="space-y-2">
          <Link
            to="/dashboard/professor/presencas"
            className="block p-3 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
          >
            Registrar Presenças
          </Link>
          <Link
            to="/dashboard/professor/notas"
            className="block p-3 bg-green-50 hover:bg-green-100 rounded border border-green-200"
          >
            Registrar Notas
          </Link>
          <Link
            to="/dashboard/professor/trabalhos"
            className="block p-3 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200"
          >
            Criar Novo Trabalho
          </Link>
        </div>
      </div>
    </div>
  </div>
);
};

export default ProfessorHome;