import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
    matricula: '',
    telefone: '',
    tipo: 'aluno', // Default: aluno
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validar senha
    if (formData.password !== formData.confirmPassword) {
      return setError('As senhas não conferem');
    }
    
    setLoading(true);

    try {
      const userData = {
        nome: formData.nome,
        telefone: formData.telefone,
        tipo: formData.tipo,
      };
      
      const { user, error } = await registerUser(
        formData.email, 
        formData.password, 
        userData, 
        formData.matricula
      );
      
      if (error) {
        setError(error);
        setLoading(false);
        return;
      }
      
      navigate('/dashboard');
    } catch (err) {
      setError('Falha ao criar conta. Por favor, tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-6">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="nome">
              Nome Completo
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="telefone">
              Telefone
            </label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="matricula">
              Matrícula
            </label>
            <input
              id="matricula"
              name="matricula"
              type="text"
              value={formData.matricula}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="tipo">
              Tipo de Usuário
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="aluno">Aluno</option>
              <option value="responsavel">Responsável</option>
              <option value="professor">Professor</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? 'Criando Conta...' : 'Criar Conta'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;