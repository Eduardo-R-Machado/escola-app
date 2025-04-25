import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold text-red-500 mb-2">403</h1>
        <h2 className="text-2xl font-bold mb-4">Acesso Não Autorizado</h2>
        <p className="text-gray-600 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <Link 
          to="/dashboard" 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Voltar para o Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
