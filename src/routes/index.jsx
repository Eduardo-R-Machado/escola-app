import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

// Pages
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';

// Páginas protegidas baseadas em perfil
import CoordenadorHome from '../pages/Coordenador/Home';
import ProfessorHome from '../pages/Professor/Home';
import AlunoHome from '../pages/Aluno/Home';
import ResponsavelHome from '../pages/Responsavel/Home';

const AppRoutes = () => {
  const { currentUser, userRole, userDetails } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (currentUser && userRole) {
      const path = `/dashboard/${userRole.toLowerCase()}`;
      navigate(path);
    }
  }, [currentUser, userRole, navigate]);

  const PrivateRoute = ({ children, allowedRoles = [] }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }

    return children;
  };

  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
      {/* Rota principal de dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      
      {/* Rotas específicas por tipo de usuário */}
      <Route 
        path="/dashboard/coordenador/*" 
        element={
          <PrivateRoute allowedRoles={['coordenador']}>
            <CoordenadorHome />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/dashboard/professor/*" 
        element={
          <PrivateRoute allowedRoles={['professor']}>
            <ProfessorHome />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/dashboard/aluno/*" 
        element={
          <PrivateRoute allowedRoles={['aluno']}>
            <AlunoHome />
          </PrivateRoute>
        } 
      />
      
      <Route 
        path="/dashboard/responsavel/*" 
        element={
          <PrivateRoute allowedRoles={['responsavel']}>
            <ResponsavelHome />
          </PrivateRoute>
        } 
      />
      
      {/* Rota padrão */}
      <Route path="*" element={<Navigate to={currentUser ? "/dashboard" : "/login"} />} />
    </Routes>
  );
};

export default AppRoutes;