import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { userRole, userDetails } = useAuth();
  const location = useLocation();
  
  // Menu items based on user role
  const menuItems = {
    aluno: [
      { path: '/dashboard/aluno', label: 'Dashboard' },
      { path: '/dashboard/aluno/notas', label: 'Minhas Notas' },
      { path: '/dashboard/aluno/presencas', label: 'Minhas Presenças' },
      { path: '/dashboard/aluno/trabalhos', label: 'Trabalhos' },
    ],
    professor: [
      { path: '/dashboard/professor', label: 'Dashboard' },
      { path: '/dashboard/professor/turmas', label: 'Minhas Turmas' },
      { path: '/dashboard/professor/presencas', label: 'Registrar Presenças' },
      { path: '/dashboard/professor/notas', label: 'Registrar Notas' },
      { path: '/dashboard/professor/trabalhos', label: 'Trabalhos' },
    ],
    coordenador: [
      { path: '/dashboard/coordenador', label: 'Dashboard' },
      { path: '/dashboard/coordenador/matriculas', label: 'Matrículas' },
      { path: '/dashboard/coordenador/turmas', label: 'Turmas' },
      { path: '/dashboard/coordenador/professores', label: 'Professores' },
      { path: '/dashboard/coordenador/materias', label: 'Matérias' },
      { path: '/dashboard/coordenador/alunos', label: 'Alunos' },
    ],
    responsavel: [
      { path: '/dashboard/responsavel', label: 'Dashboard' },
      { path: '/dashboard/responsavel/alunos', label: 'Meus Alunos' },
      { path: '/dashboard/responsavel/vincular-aluno', label: 'Vincular Aluno' },
    ],
  };
  
  // If no role is defined yet, show a placeholder
  if (!userRole || !menuItems[userRole]) {
    return (
      <div className="w-64 bg-white shadow-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Carregando...</h2>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-64 bg-white shadow-md">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold">
          {userRole === 'aluno' && 'Painel do Aluno'}
          {userRole === 'professor' && 'Painel do Professor'}
          {userRole === 'coordenador' && 'Painel do Coordenador'}
          {userRole === 'responsavel' && 'Painel do Responsável'}
        </h2>
        <p className="text-gray-600 text-sm mt-1">Olá, {userDetails?.nome || 'Usuário'}</p>
      </div>
      
      <nav className="p-4">
        <ul>
          {menuItems[userRole].map((item) => (
            <li key={item.path} className="mb-2">
              <Link
                to={item.path}
                className={`block p-2 rounded ${
                  location.pathname === item.path
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;