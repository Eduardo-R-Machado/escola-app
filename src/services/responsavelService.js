import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Buscar alunos vinculados a um responsável
export const getAlunosByResponsavel = async (responsavelId) => {
  try {
    const relacoesRef = collection(db, 'relacoes_aluno_responsavel');
    const q = query(
      relacoesRef,
      where('responsavel_id', '==', responsavelId)
    );
    
    const relacoesSnap = await getDocs(q);
    const relacoes = [];
    
    relacoesSnap.forEach(doc => {
      relacoes.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    // Buscar detalhes completos dos alunos
    const alunos = [];
    
    for (const relacao of relacoes) {
      const alunosRef = collection(db, 'users');
      const alunoQuery = query(
        alunosRef,
        where('id', '==', relacao.aluno_id),
        where('tipo', '==', 'aluno')
      );
      
      const alunoSnap = await getDocs(alunoQuery);
      
      alunoSnap.forEach(doc => {
        alunos.push({
          id: doc.id,
          ...doc.data(),
          tipo_relacao: relacao.tipo_relacao,
          relacao_id: relacao.id
        });
      });
    }
    
    return { alunos, error: null };
  } catch (error) {
    return { alunos: [], error: error.message };
  }
};

// Adicionar relação entre aluno e responsável
export const vincularAlunoResponsavel = async (alunoId, responsavelId, tipoRelacao) => {
  try {
    // Verificar se a relação já existe
    const relacoesRef = collection(db, 'relacoes_aluno_responsavel');
    const q = query(
      relacoesRef,
      where('aluno_id', '==', alunoId),
      where('responsavel_id', '==', responsavelId)
    );
    
    const relacoesSnap = await getDocs(q);
    
    if (!relacoesSnap.empty) {
      return { 
        success: false, 
        error: 'Este aluno já está vinculado a este responsável.' 
      };
    }
    
    // Criar a relação
    const relacaoData = {
      aluno_id: alunoId,
      responsavel_id: responsavelId,
      tipo_relacao: tipoRelacao,
      eh_principal: true, // Se for o primeiro, definir como principal
      data_criacao: new Date()
    };
    
    const docRef = await addDoc(collection(db, 'relacoes_aluno_responsavel'), relacaoData);
    
    return { success: true, id: docRef.id, error: null };
  } catch (error) {
    return { success: false, id: null, error: error.message };
  }
};

// Remover vínculo entre aluno e responsável
export const desvincularAlunoResponsavel = async (relacaoId) => {
  try {
    await deleteDoc(doc(db, 'relacoes_aluno_responsavel', relacaoId));
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};