import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getTurmaById } from '../../services/turmaService';
import { registrarAula } from '../../services/aulaService';
import { useFirestore } from '../../hooks/useFirestore';

const RegistrarPresenca = ({ turmaId, materiaId }) => {
  const { currentUser } = useAuth();
  const { getDocuments } = useFirestore();
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [presencas, setPresencas] = useState({});
  const [observacoes, setObservacoes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dataAula, setDataAula] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Carregar dados da turma e alunos
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
        
        // Buscar alunos da turma
        if (turmaData.alunos && turmaData.alunos.length > 0) {
          const conditions = turmaData.alunos.map(alunoId => ({
            field: 'id', 
            operator: '==', 
            value: alunoId
          }));
          
          const { data: alunosData, error: alunosError } = await getDocuments('users', conditions);
          
          if (alunosError) {
            setError(alunosError);
            setLoading(false);
            return;
          }
          
          setAlunos(alunosData);
          
          // Inicializar o objeto de presenças
          const presencasObj = {};
          alunosData.forEach(aluno => {
            presencasObj[aluno.id] = true; // Por padrão, todos estão presentes
          });
          
          setPresencas(presencasObj);
        }
      } catch (err) {
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [turmaId, getDocuments]);

  const handlePresencaChange = (alunoId, presente) => {
    setPresencas(prev => ({
      ...prev,
      [alunoId]: presente
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      // Formatar as presenças para o formato esperado pelo Firebase
      const presencasArray = Object.keys(presencas).map(alunoId => ({
        aluno_id: alunoId,
        presente: presencas[alunoId]
      }));
      
      const aulaData = {
        data: new Date(dataAula),
        turma_id: turmaId,
        materia_id: materiaId,
        professor_id: currentUser.uid,
        presencas: presencasArray,
        observacoes
      };
      
      const { id, error } = await registrarAula(aulaData);
      
      if (error) {
        setError(`Erro ao registrar aula: ${error}`);
        setSubmitting(false);
        return;
      }
      
      setSuccess('Presenças registradas com sucesso!');
      setObservacoes('');
    } catch (err) {
      setError('Erro ao registrar presenças. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando dados...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Registrar Presenças</h2>
      
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
        <p className="text-gray-600">Ano Letivo: {turma?.ano_letivo}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="dataAula">
            Data da Aula
          </label>
          <input
            id="dataAula"
            type="date"
            value={dataAula}
            onChange={(e) => setDataAula(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">Lista de Alunos</h4>
          
          {alunos.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Nenhum aluno cadastrado nesta turma.
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded">
              {alunos.map(aluno => (
                <div key={aluno.id} className="flex items-center py-2 border-b border-gray-200">
                  <div className="flex-1">
                    <p className="font-medium">{aluno.nome}</p>
                    <p className="text-sm text-gray-600">Matrícula: {aluno.matricula}</p>
                  </div>
                  <div className="flex items-center">
                    <label className="inline-flex items-center mr-4">
                      <input
                        type="radio"
                        name={`presenca_${aluno.id}`}
                        checked={presencas[aluno.id] === true}
                        onChange={() => handlePresencaChange(aluno.id, true)}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="ml-2 text-gray-700">Presente</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name={`presenca_${aluno.id}`}
                        checked={presencas[aluno.id] === false}
                        onChange={() => handlePresencaChange(aluno.id, false)}
                        className="form-radio h-5 w-5 text-red-600"
                      />
                      <span className="ml-2 text-gray-700">Ausente</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="observacoes">
            Observações
          </label>
          <textarea
            id="observacoes"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            className="w-full p-2 border rounded"
            rows="4"
          ></textarea>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || alunos.length === 0}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {submitting ? 'Salvando...' : 'Registrar Presenças'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarPresenca;