import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getTrabalhosByTurmaMateria } from '../../services/trabalhoService';
import { Link } from 'react-router-dom';

const VerTrabalhos = ({ turmaId, materiaId }) => {
  const { currentUser } = useAuth();
  const [trabalhos, setTrabalhos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchTrabalhos = async () => {
      try {
        const { trabalhos: trabalhosData, error: trabalhosError } = await getTrabalhosByTurmaMateria(
          turmaId,
          materiaId
        );
        
        if (trabalhosError) {
          setError(trabalhosError);
        } else {
          setTrabalhos(trabalhosData);
        }
      } catch (err) {
        setError('Erro ao carregar trabalhos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrabalhos();
  }, [turmaId, materiaId]);
  
  if (loading) {
    return <div className="text-center py-4">Carregando trabalhos...</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Trabalhos</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {trabalhos.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Nenhum trabalho disponível ainda.
        </div>
      ) : (
        <div className="space-y-4">
          {trabalhos.map((trabalho) => {
            const dataEntrega = new Date(trabalho.data_entrega.seconds * 1000);
            const hoje = new Date();
            const prazoExpirado = dataEntrega < hoje;
            
            return (
              <div 
                key={trabalho.id} 
                className={`border rounded-lg p-4 ${
                  prazoExpirado ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <h3 className="text-lg font-medium mb-1">{trabalho.titulo}</h3>
                <p className="text-gray-600 mb-2">{trabalho.descricao}</p>
                
                <div className="flex flex-wrap text-sm mb-3">
                  <span className={`px-2 py-1 rounded mr-2 ${
                    prazoExpirado 
                      ? 'bg-red-200 text-red-800' 
                      : 'bg-green-200 text-green-800'
                  }`}>
                    {prazoExpirado 
                      ? 'Prazo expirado' 
                      : `Entrega até ${dataEntrega.toLocaleDateString()}`}
                  </span>
                </div>
                
                {trabalho.arquivos_anexos && trabalho.arquivos_anexos.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium mb-1">Arquivos do Professor:</p>
                    <div className="space-y-1">
                      {trabalho.arquivos_anexos.map((url, index) => (
                        <a 
                          key={index} 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline text-sm block"
                        >
                          Arquivo {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <Link
                    to={`/dashboard/aluno/entregar-trabalho/${trabalho.id}`}
                    className={`px-4 py-2 rounded text-white ${
                      prazoExpirado 
                        ? 'bg-gray-500 cursor-not-allowed' 
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                    {...(prazoExpirado && { onClick: (e) => e.preventDefault() })}
                  >
                    {prazoExpirado ? 'Prazo encerrado' : 'Entregar Trabalho'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VerTrabalhos;
