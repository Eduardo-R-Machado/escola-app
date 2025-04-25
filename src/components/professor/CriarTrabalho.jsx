import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { criarTrabalho } from '../../services/trabalhoService';
import { getTurmaById } from '../../services/turmaService';
import { getMateriaById } from '../../services/materiaService';

const CriarTrabalho = ({ turmaId, materiaId }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_entrega: '',
  });
  
  const [arquivos, setArquivos] = useState([]);
  const [turma, setTurma] = useState(null);
  const [materia, setMateria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carregar dados da turma e matéria
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados da turma
        const { turma: turmaData, error: turmaError } = await getTurmaById(turmaId);
        
        if (turmaError) {
          setError(turmaError);
          setLoading(false);
          return;
        }
        
        setTurma(turmaData);
        
        // Buscar dados da matéria
        const { materia: materiaData, error: materiaError } = await getMateriaById(materiaId);
        
        if (materiaError) {
          setError(materiaError);
          setLoading(false);
          return;
        }
        
        setMateria(materiaData);
      } catch (err) {
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [turmaId, materiaId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setArquivos(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      // Verificar data de entrega
      const dataEntrega = new Date(formData.data_entrega);
      const hoje = new Date();
      
      if (dataEntrega <= hoje) {
        setError('A data de entrega deve ser posterior à data atual.');
        setSubmitting(false);
        return;
      }
      
      const trabalhoData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        data_entrega: dataEntrega,
        turma_id: turmaId,
        materia_id: materiaId,
        professor_id: currentUser.uid
      };
      
      const { id, error } = await criarTrabalho(trabalhoData, arquivos);
      
      if (error) {
        setError(`Erro ao criar trabalho: ${error}`);
      } else {
        setSuccess('Trabalho criado com sucesso!');
        // Limpar formulário
        setFormData({
          titulo: '',
          descricao: '',
          data_entrega: ''
        });
        setArquivos([]);
        
        // Redirecionar após um tempo
        setTimeout(() => {
          navigate(`/dashboard/professor/trabalhos/${turmaId}/${materiaId}`);
        }, 2000);
      }
    } catch (err) {
      setError('Erro ao criar trabalho. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando dados...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Criar Novo Trabalho</h2>
      
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
      
      <div className="mb-6">
        <h3 className="text-lg font-medium">Turma: {turma?.nome}</h3>
        <p className="text-gray-600">Matéria: {materia?.nome}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="titulo">
            Título do Trabalho
          </label>
          <input
            id="titulo"
            name="titulo"
            type="text"
            value={formData.titulo}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="descricao">
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="6"
            required
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="data_entrega">
            Data de Entrega
          </label>
          <input
            id="data_entrega"
            name="data_entrega"
            type="date"
            value={formData.data_entrega}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="arquivos">
            Arquivos (opcional)
          </label>
          <input
            id="arquivos"
            type="file"
            onChange={handleFileChange}
            className="w-full border rounded p-2"
            multiple
          />
          <p className="text-sm text-gray-500 mt-1">
            Você pode selecionar múltiplos arquivos.
          </p>
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate(`/dashboard/professor/trabalhos/${turmaId}/${materiaId}`)}
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-2"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {submitting ? 'Criando...' : 'Criar Trabalho'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CriarTrabalho;