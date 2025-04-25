import { useState, useEffect } from 'react';
import { getAulasByTurma } from '../../services/aulaService';

const VerPresencaAluno = ({ alunoId, turmaId }) => {
  const [aulas, setAulas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const { aulas: aulasData, error: aulasError } = await getAulasByTurma(turmaId);
        
        if (aulasError) {
          setError(aulasError);
        } else {
          // Filtrar apenas aulas com presença registrada para este aluno
          const aulasComPresenca = aulasData.filter(aula => 
            aula.presencas && aula.presencas.some(p => p.aluno_id === alunoId)
          );
          
          setAulas(aulasComPresenca);
        }
      } catch (err) {
        setError('Erro ao carregar presenças. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAulas();
  }, [alunoId, turmaId]);
  
  if (loading) {
    return <div className="text-center py-4">Carregando presenças...</div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Registro de Presenças</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {aulas.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          Nenhuma presença registrada ainda.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Data</th>
                <th className="py-3 px-6 text-left">Matéria</th>
                <th className="py-3 px-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {aulas.map((aula) => {
                const presencaAluno = aula.presencas.find(p => p.aluno_id === alunoId);
                const presente = presencaAluno ? presencaAluno.presente : false;
                
                return (
                  <tr key={aula.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left">
                      {new Date(aula.data.seconds * 1000).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {aula.materia_id} {/* Aqui você buscaria o nome da matéria */}
                    </td>
                    <td className="py-3 px-6 text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        presente 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-red-200 text-red-800'
                      }`}>
                        {presente ? 'Presente' : 'Ausente'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VerPresencaAluno;