import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { createMatricula, generateRandomMatricula } from '../../services/matriculaService';

const CriarMatricula = () => {
  const { currentUser } = useAuth();
  const [tipo, setTipo] = useState('aluno');
  const [quantidade, setQuantidade] = useState(1);
  const [matriculas, setMatriculas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const novasMatriculas = [];
      
      for (let i = 0; i < quantidade; i++) {
        const matricula = generateRandomMatricula(tipo);
        
        const { id, error } = await createMatricula({
          matricula,
          tipo
        }, currentUser.uid);
        
        if (error) {
          setError(`Erro ao criar matrícula: ${error}`);
          setLoading(false);
          return;
        }
        
        novasMatriculas.push({ id, matricula });
      }
      
      setMatriculas(novasMatriculas);
      setSuccess(`${quantidade} matrícula(s) criada(s) com sucesso!`);
    } catch (err) {
      setError('Erro ao criar matrículas. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Criar Matrículas</h2>
      
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
          <label className="block text-gray-700 mb-2" htmlFor="tipo">
            Tipo de Usuário
          </label>
          <select
            id="tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="aluno">Aluno</option>
            <option value="professor">Professor</option>
            <option value="responsavel">Responsável</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="quantidade">
            Quantidade
          </label>
          <input
            id="quantidade"
            type="number"
            min="1"
            max="50"
            value={quantidade}
            onChange={(e) => setQuantidade(parseInt(e.target.value))}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {loading ? 'Gerando...' : 'Gerar Matrículas'}
        </button>
      </form>
      
      {matriculas.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Matrículas Geradas:</h3>
          <div className="bg-gray-100 p-4 rounded">
            <ul>
              {matriculas.map((item, index) => (
                <li key={item.id} className="mb-1">
                  {index + 1}. {item.matricula}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CriarMatricula;