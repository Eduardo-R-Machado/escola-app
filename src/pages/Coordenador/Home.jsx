import { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// Componentes para o coordenador
import CriarMatricula from '../../components/coordenador/CriarMatricula';
import GerenciarTurmas from '../../components/coordenador/GerenciarTurmas';
import GerenciarProfessores from '../../components/coordenador/GerenciarProfessores';

const CoordenadorHome = () => {
  const { userDetails } = useAuth();
  const location = useLocation();
  
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Painel do Coordenador</h2>
          <p className="text-gray-600 text-sm mt-1">Olá, {userDetails?.nome}</p>
        </div>
        
        <nav className="p-4">
          <ul>
            <li className="mb-2">
              <Link
                to="/dashboard/coordenador"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/coordenador'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/coordenador/matriculas"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/coordenador/matriculas'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Matrículas
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/coordenador/turmas"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/coordenador/turmas'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Turmas
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/coordenador/professores"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/coordenador/professores'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Professores
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/coordenador/materias"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/coordenador/materias'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Matérias
              </Link>
            </li>
            <li className="mb-2">
              <Link
                to="/dashboard/coordenador/alunos"
                className={`block p-2 rounded ${
                  location.pathname === '/dashboard/coordenador/alunos'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Alunos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<CoordenadorDashboard />} />
          <Route path="/matriculas" element={<CriarMatricula />} />
          <Route path="/turmas" element={<GerenciarTurmas />} />
          <Route path="/professores" element={<GerenciarProfessores />} />
          {/* Adicione as outras rotas aqui */}
        </Routes>
      </div>
    </div>
  );
};

const CoordenadorDashboard = () => {
  // Aqui você poderia carregar estatísticas, como:
  // - Número de alunos
  // - Número de professores
  // - Número de turmas
  // - Etc.

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card para Total de Alunos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Total de Alunos</h2>
          <p className="text-3xl font-bold text-blue-500">0</p>
        </div>
        
        {/* Card para Total de Professores */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Total de Professores</h2>
          <p className="text-3xl font-bold text-green-500">0</p>
        </div>
        
        {/* Card para Total de Turmas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-2">Total de Turmas</h2>
          <p className="text-3xl font-bold text-purple-500">0</p>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de Atividades Recentes */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Atividades Recentes</h2>
          <div className="text-center text-gray-500 py-4">
            Nenhuma atividade recente.
          </div>
        </div>
        
        {/* Ações Rápidas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
          <div className="space-y-2">
            <Link
              to="/dashboard/coordenador/matriculas"
              className="block p-3 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
            >
              Gerar Novas Matrículas
            </Link>
            <Link
              to="/dashboard/coordenador/turmas"
              className="block p-3 bg-green-50 hover:bg-green-100 rounded border border-green-200"
            >
              Gerenciar Turmas
            </Link>
            <Link
              to="/dashboard/coordenador/materias"
              className="block p-3 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200"
            >
              Gerenciar Matérias
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoordenadorHome;