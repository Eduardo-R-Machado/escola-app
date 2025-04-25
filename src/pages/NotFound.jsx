import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        <h1 className="text-4xl font-bold text-red-500 mb-2">404</h1>
        <h2 className="text-2xl font-bold mb-4">Página Não Encontrada</h2>
        <p className="text-gray-600 mb-6">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link 
          to="/" 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;