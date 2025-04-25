import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getAllTurmas, createTurma } from '../../services/turmaService';

const GerenciarTurmas = () => {
  const { currentUser } = useAuth();
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Formulário para nova turma
  const [formData, setFormData] = useState({
    nome: '',
    ano_letivo: new Date().getFullYear().toString()
  });
  const [formVisible, setFormVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Carregar turmas ao iniciar
  useEffect(() => {
    const fetchTurmas = async () => {
      try {
        const { turmas, error } = await getAllTurmas();
        
        if (error) {
          setError(error);
        } else {
          setTurmas(turmas);
        }
      } catch (err) {
        setError('Erro ao carregar turmas.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTurmas();
  }, []);

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
    setSuccess('');
    setSubmitting(true);
    
    try {
      const { turmaId, error } = await createTurma(formData, currentUser.uid);
      
      if (error) {
        setError(`Erro ao criar turma: ${error}`);
      } else {
        // Adicionar a nova turma à lista
        setTurmas(prev => [
          ...prev,
          {
            id: turmaId,
            ...formData,
            alunos: [],
            criado_por: currentUser.uid,
            criado_em: new Date()
          }
        ]);
        
        setSuccess('Turma criada com sucesso!');
        setFormData({
          nome: '',
          ano_letivo: new Date().getFullYear().toString()
        });
        setFormVisible(false);
      }
    } catch (err) {
      setError('Erro ao criar turma. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando turmas...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gerenciar Turmas</h2>
        <button
          onClick={() => setFormVisible(!formVisible)}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {formVisible ? 'Cancelar' : 'Nova Turma'}
        </button>
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
      
      {formVisible && (
        <div className="bg-gray-100 p-4 rounded mb-6">
          <h3 className="text-lg font-medium mb-4">Nova Turma</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="nome">
                Nome da Turma
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Ex: 7º Ano A"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="ano_letivo">
                Ano Letivo
              </label>
              <input
                id="ano_letivo"
                name="ano_letivo"
                type="text"
                value={formData.ano_letivo}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-green-300"
              >
                {submitting ? 'Salvando...' : 'Salvar Turma'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {turmas.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma turma cadastrada ainda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nome</th>
                <th className="py-3 px-6 text-left">Ano Letivo</th>
                <th className="py-3 px-6 text-center">Alunos</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {turmas.map((turma) => (
                <tr key={turma.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">{turma.nome}</td>
                  <td className="py-3 px-6 text-left">{turma.ano_letivo}</td>
                  <td className="py-3 px-6 text-center">
                    {turma.alunos ? turma.alunos.length : 0}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button 
                        className="mr-2 transform hover:text-blue-500 hover:scale-110"
                        title="Editar turma"
                      >
                        Editar
                      </button>
                      <button 
                        className="mr-2 transform hover:text-green-500 hover:scale-110"
                        title="Gerenciar alunos"
                      >
                        Alunos
                      </button>
                      <button 
                        className="transform hover:text-blue-500 hover:scale-110"
                        title="Gerenciar horários"
                      >
                        Horários
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GerenciarTurmas;