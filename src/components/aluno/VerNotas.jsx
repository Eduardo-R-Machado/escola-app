import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getNotasByAlunoTurmaMateria } from '../../services/notaService';

const VerNotas = ({ turmaId, materiaId }) => {
  const { currentUser } = useAuth();
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const { notas: notasData, error: notasError } = await getNotasByAlunoTurmaMateria(
          currentUser.uid, 
          turmaId,
          materiaId
        );
        
        if (notasError) {
          setError(notasError);
        } else {
          setNotas(notasData);
        }
      } catch (err) {
        setError('Erro ao carregar notas. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotas();
  }, [currentUser.uid, turmaId, materiaId]);
  
  if (loading) {
    return <div className="text-center py-4">Carregando notas...</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Minhas Notas</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {notas.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Nenhuma nota registrada ainda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Tipo</th>
                <th className="py-3 px-6 text-center">Nota</th>
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-left">Observação</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {notas.map((nota) => (
                <tr key={nota.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-6 text-left">
                    {nota.tipo_avaliacao.charAt(0).toUpperCase() + nota.tipo_avaliacao.slice(1)}
                  </td>
                  <td className="py-3 px-6 text-center font-semibold">
                    {nota.valor.toFixed(1)}
                  </td>
                  <td className="py-3 px-6 text-left">
                    {new Date(nota.data.seconds * 1000).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-left">{nota.observacao || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VerNotas;
