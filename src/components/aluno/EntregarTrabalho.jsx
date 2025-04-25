import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { entregarTrabalho } from '../../services/trabalhoService';
import { useFirestore } from '../../hooks/useFirestore';

const EntregarTrabalho = () => {
  const { trabalhoId } = useParams();
  const { currentUser } = useAuth();
  const { getDocument } = useFirestore();
  const navigate = useNavigate();
  
  const [trabalho, setTrabalho] = useState(null);
  const [arquivos, setArquivos] = useState([]);
  const [comentario, setComentario] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    const fetchTrabalho = async () => {
      try {
        const { data: trabalhoData, error: trabalhoError } = await getDocument(
          'trabalhos',
          trabalhoId
        );
        
        if (trabalhoError) {
          setError(trabalhoError);
        } else {
          setTrabalho(trabalhoData);
          
          // Verificar se o prazo já expirou
          const dataEntrega = new Date(trabalhoData.data_entrega.seconds * 1000);
          const hoje = new Date();
          
          if (dataEntrega < hoje) {
            setError('O prazo para entrega deste trabalho já expirou.');
          }
        }
      } catch (err) {
        setError('Erro ao carregar informações do trabalho.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrabalho();
  }, [trabalhoId, getDocument]);
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      setArquivos(Array.from(e.target.files));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (arquivos.length === 0) {
      setError('Você deve anexar pelo menos um arquivo.');
      return;
    }
    
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      const entregaData = {
        trabalho_id: trabalhoId,
        aluno_id: currentUser.uid,
        comentario
      };
      
      const { id, error } = await entregarTrabalho(entregaData, arquivos);
      
      if (error) {
        setError(`Erro ao entregar trabalho: ${error}`);
      } else {
        setSuccess('Trabalho entregue com sucesso!');
        setTimeout(() => {
          navigate('/dashboard/aluno/trabalhos');
        }, 2000);
      }
    } catch (err) {
      setError('Erro ao entregar trabalho. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-4">Carregando...</div>;
  }
  
  if (!trabalho) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Trabalho não encontrado</h2>
        <p className="text-gray-600">O trabalho solicitado não existe ou foi removido.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Entregar Trabalho</h2>
      
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
        <h3 className="text-lg font-medium mb-1">{trabalho.titulo}</h3>
        <p className="text-gray-600 mb-2">{trabalho.descricao}</p>
        <p className="text-sm text-gray-500">
          Data de Entrega: {new Date(trabalho.data_entrega.seconds * 1000).toLocaleDateString()}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="arquivos">
            Arquivos
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
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="comentario">
            Comentário (opcional)
          </label>
          <textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || arquivos.length === 0}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {submitting ? 'Enviando...' : 'Entregar Trabalho'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EntregarTrabalho;
