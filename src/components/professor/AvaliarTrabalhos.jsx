import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useFirestore } from '../../hooks/useFirestore';
import { avaliarEntregaTrabalho } from '../../services/trabalhoService';

const AvaliarTrabalhos = ({ trabalhoId }) => {
  const { getDocument, getDocuments } = useFirestore();
  const [trabalho, setTrabalho] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [alunos, setAlunos] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estado para avaliação
  const [avaliacaoAtual, setAvaliacaoAtual] = useState({
    entregaId: null,
    nota: '',
    comentario: ''
  });
  
  // Estado para modal de avaliação
  const [showModal, setShowModal] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar dados do trabalho
        const { data: trabalhoData, error: trabalhoError } = await getDocument(
          'trabalhos',
          trabalhoId
        );
        
        if (trabalhoError) {
          setError(trabalhoError);
          setLoading(false);
          return;
        }
        
        setTrabalho(trabalhoData);
        
        // Buscar entregas do trabalho
        const { data: entregasData, error: entregasError } = await getDocuments(
          'entregas_trabalhos',
          [{ field: 'trabalho_id', operator: '==', value: trabalhoId }]
        );
        
        if (entregasError) {
          setError(entregasError);
          setLoading(false);
          return;
        }
        
        setEntregas(entregasData);
        
        // Buscar dados dos alunos que entregaram
        const alunosIds = entregasData.map(entrega => entrega.aluno_id);
        const alunosMap = {};
        
        for (const alunoId of alunosIds) {
          const { data: alunoData } = await getDocument('users', alunoId);
          if (alunoData) {
            alunosMap[alunoId] = alunoData;
          }
        }
        
        setAlunos(alunosMap);
      } catch (err) {
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [trabalhoId, getDocument, getDocuments]);
  
  const openModal = (entrega) => {
    setAvaliacaoAtual({
      entregaId: entrega.id,
      nota: entrega.nota || '',
      comentario: entrega.comentario_professor || ''
    });
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setAvaliacaoAtual({
      entregaId: null,
      nota: '',
      comentario: ''
    });
  };
  
  const handleAvaliacaoChange = (e) => {
    const { name, value } = e.target;
    setAvaliacaoAtual(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAvaliacaoSubmit = async (e) => {
    e.preventDefault();
    
    // Validar nota
    const nota = parseFloat(avaliacaoAtual.nota);
    if (isNaN(nota) || nota < 0 || nota > 10) {
      setError('A nota deve ser um número entre 0 e 10.');
      return;
    }
    
    try {
      const { success, error } = await avaliarEntregaTrabalho(
        avaliacaoAtual.entregaId,
        nota,
        avaliacaoAtual.comentario
      );
      
      if (error) {
        setError(`Erro ao avaliar trabalho: ${error}`);
      } else {
        // Atualizar a entrega na lista
        setEntregas(prev => 
          prev.map(entrega => 
            entrega.id === avaliacaoAtual.entregaId
              ? { 
                  ...entrega, 
                  nota,
                  comentario_professor: avaliacaoAtual.comentario,
                  status: 'avaliado'
                }
              : entrega
          )
        );
        
        setSuccess('Trabalho avaliado com sucesso!');
        closeModal();
      }
    } catch (err) {
      setError('Erro ao avaliar trabalho. Por favor, tente novamente.');
    }
  };
  
  if (loading) {
    return <div className="text-center py-4">Carregando dados...</div>;
  }
  
  if (!trabalho) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Trabalho não encontrado</h2>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Avaliar Trabalhos</h2>
      
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
        <h3 className="text-lg font-medium">{trabalho.titulo}</h3>
        <p className="text-gray-600 mb-2">{trabalho.descricao}</p>
        <p className="text-sm text-gray-500">
          Data de Entrega: {new Date(trabalho.data_entrega.seconds * 1000).toLocaleDateString()}
        </p>
      </div>
      
      {entregas.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Nenhum aluno entregou este trabalho ainda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Aluno</th>
                <th className="py-3 px-6 text-left">Data de Entrega</th>
                <th className="py-3 px-6 text-center">Status</th>
                <th className="py-3 px-6 text-center">Nota</th>
                <th className="py-3 px-6 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {entregas.map((entrega) => {
                const aluno = alunos[entrega.aluno_id];
                const dataEntrega = new Date(entrega.data_entrega.seconds * 1000);
                
                return (
                  <tr key={entrega.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      {aluno ? aluno.nome : 'Aluno não encontrado'}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {dataEntrega.toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-2 py-1 rounded ${
                        entrega.status === 'avaliado' 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {entrega.status === 'avaliado' ? 'Avaliado' : 'Entregue'}
                      </span>
                    </td>
                    <td className="py-3 px-6 text-center">
                      {entrega.nota !== null ? entrega.nota.toFixed(1) : '-'}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button 
                          className="mr-2 transform hover:text-blue-500 hover:scale-110"
                          onClick={() => openModal(entrega)}
                          title={entrega.status === 'avaliado' ? 'Editar avaliação' : 'Avaliar trabalho'}
                        >
                          {entrega.status === 'avaliado' ? 'Editar' : 'Avaliar'}
                        </button>
                        {entrega.arquivos && entrega.arquivos.length > 0 && (
                          <a 
                            href={entrega.arquivos[0]} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="transform hover:text-green-500 hover:scale-110"
                            title="Baixar arquivo"
                          >
                            Baixar
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Modal de Avaliação */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="bg-white rounded-lg w-full max-w-lg mx-auto z-50 p-6">
            <h3 className="text-xl font-semibold mb-4">
              Avaliar Trabalho
            </h3>
            
            <form onSubmit={handleAvaliacaoSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="nota">
                  Nota (0-10)
                </label>
                <input
                  id="nota"
                  name="nota"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  value={avaliacaoAtual.nota}
                  onChange={handleAvaliacaoChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="comentario">
                  Comentário
                </label>
                <textarea
                  id="comentario"
                  name="comentario"
                  value={avaliacaoAtual.comentario}
                  onChange={handleAvaliacaoChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Salvar Avaliação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvaliarTrabalhos;