import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getTurmaById } from '../../services/turmaService';
import { getNotasByTurmaMateria, registrarNota, atualizarNota } from '../../services/notaService';
import { useFirestore } from '../../hooks/useFirestore';

const RegistrarNotas = ({ turmaId, materiaId }) => {
  const { currentUser } = useAuth();
  const { getDocuments } = useFirestore();
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [notas, setNotas] = useState({});
  const [tipoAvaliacao, setTipoAvaliacao] = useState('prova');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notasExistentes, setNotasExistentes] = useState([]);
  const [observacao, setObservacao] = useState('');

  // Carregar dados da turma, alunos e notas existentes
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
          const alunosArray = [];
          
          for (const alunoId of turmaData.alunos) {
            const { data: alunoData, error: alunoError } = await getDocuments('users', [
              { field: 'id', operator: '==', value: alunoId }
            ]);
            
            if (!alunoError && alunoData.length > 0) {
              alunosArray.push(alunoData[0]);
            }
          }
          
          setAlunos(alunosArray);
          
          // Inicializar o objeto de notas
          const notasObj = {};
          alunosArray.forEach(aluno => {
            notasObj[aluno.id] = '';
          });
          
          setNotas(notasObj);
        }
        
        // Buscar notas existentes
        const { notas: notasData, error: notasError } = await getNotasByTurmaMateria(turmaId, materiaId);
        
        if (!notasError) {
          setNotasExistentes(notasData);
        }
      } catch (err) {
        setError('Erro ao carregar dados. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [turmaId, materiaId, getDocuments]);

  const handleNotaChange = (alunoId, valor) => {
    setNotas(prev => ({
      ...prev,
      [alunoId]: valor
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    
    try {
      // Validar notas (entre 0 e 10)
      for (const alunoId in notas) {
        const nota = parseFloat(notas[alunoId]);
        if (isNaN(nota) || nota < 0 || nota > 10) {
          setError(`Nota inválida para um ou mais alunos. As notas devem estar entre 0 e 10.`);
          setSubmitting(false);
          return;
        }
      }
      
      // Registrar notas para cada aluno
      for (const alunoId in notas) {
        // Verificar se já existe uma nota para este aluno, matéria e tipo de avaliação
        const notaExistente = notasExistentes.find(
          nota => nota.aluno_id === alunoId && 
                 nota.tipo_avaliacao === tipoAvaliacao
        );
        
        if (notaExistente) {
          // Atualizar nota existente
          await atualizarNota(notaExistente.id, {
            valor: parseFloat(notas[alunoId]),
            observacao,
            data: new Date()
          });
        } else {
          // Criar nova nota
          await registrarNota({
            aluno_id: alunoId,
            turma_id: turmaId,
            materia_id: materiaId,
            professor_id: currentUser.uid,
            tipo_avaliacao: tipoAvaliacao,
            valor: parseFloat(notas[alunoId]),
            observacao,
            data: new Date()
          });
        }
      }
      
      setSuccess('Notas registradas com sucesso!');
      setObservacao('');
    } catch (err) {
      setError('Erro ao registrar notas. Por favor, tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Carregando dados...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Registrar Notas</h2>
      
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
          <label className="block text-gray-700 mb-2" htmlFor="tipoAvaliacao">
            Tipo de Avaliação
          </label>
          <select
            id="tipoAvaliacao"
            value={tipoAvaliacao}
            onChange={(e) => setTipoAvaliacao(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="prova">Prova</option>
            <option value="trabalho">Trabalho</option>
            <option value="participacao">Participação</option>
            <option value="outro">Outro</option>
          </select>
        </div>
        
        <div className="mb-6">
          <h4 className="text-md font-medium mb-2">Lista de Alunos</h4>
          
          {alunos.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              Nenhum aluno cadastrado nesta turma.
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded">
              {alunos.map(aluno => {
                // Buscar nota existente para pré-preencher o campo
                const notaExistente = notasExistentes.find(
                  nota => nota.aluno_id === aluno.id && 
                        nota.tipo_avaliacao === tipoAvaliacao
                );
                
                // Inicializar o valor do campo com a nota existente, se houver
                if (notaExistente && notas[aluno.id] === '') {
                  handleNotaChange(aluno.id, notaExistente.valor.toString());
                }
                
                return (
                  <div key={aluno.id} className="flex items-center py-2 border-b border-gray-200">
                    <div className="flex-1">
                      <p className="font-medium">{aluno.nome}</p>
                      <p className="text-sm text-gray-600">Matrícula: {aluno.matricula}</p>
                    </div>
                    <div className="w-24">
                      <input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={notas[aluno.id]}
                        onChange={(e) => handleNotaChange(aluno.id, e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Nota"
                        required
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="observacao">
            Observação
          </label>
          <textarea
            id="observacao"
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
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
            {submitting ? 'Salvando...' : 'Registrar Notas'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarNotas;