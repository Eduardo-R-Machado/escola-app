import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Dashboard = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirecionar com base no tipo de usuário
    if (userRole) {
      navigate(`/dashboard/${userRole.toLowerCase()}`);
    }
  }, [userRole, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h2 className="text-2xl font-bold mb-4">Carregando seu painel...</h2>
        <p className="text-gray-600">
          Você será redirecionado para o painel apropriado em instantes.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;