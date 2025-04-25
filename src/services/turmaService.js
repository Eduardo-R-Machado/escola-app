import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Criar nova turma
export const createTurma = async (turmaData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'turmas'), {
      ...turmaData,
      alunos: [],
      professores: [],
      criado_por: userId,
      criado_em: new Date()
    });
    
    return { turmaId: docRef.id, error: null };
  } catch (error) {
    return { turmaId: null, error: error.message };
  }
};

// Buscar todas as turmas
export const getAllTurmas = async () => {
  try {
    const turmasRef = collection(db, 'turmas');
    const turmasSnap = await getDocs(turmasRef);
    
    const turmas = [];
    turmasSnap.forEach(doc => {
      turmas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { turmas, error: null };
  } catch (error) {
    return { turmas: [], error: error.message };
  }
};

// Obter turma por ID
export const getTurmaById = async (turmaId) => {
  try {
    const turmaRef = doc(db, 'turmas', turmaId);
    const turmaSnap = await getDoc(turmaRef);
    
    if (turmaSnap.exists()) {
      return { 
        turma: { id: turmaSnap.id, ...turmaSnap.data() }, 
        error: null 
      };
    } else {
      return { turma: null, error: 'Turma não encontrada' };
    }
  } catch (error) {
    return { turma: null, error: error.message };
  }
};

// Buscar turmas por aluno
export const getTurmasByAluno = async (alunoId) => {
  try {
    const turmasRef = collection(db, 'turmas');
    const q = query(turmasRef, where('alunos', 'array-contains', alunoId));
    
    const turmasSnap = await getDocs(q);
    const turmas = [];
    
    turmasSnap.forEach(doc => {
      turmas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { turmas, error: null };
  } catch (error) {
    return { turmas: [], error: error.message };
  }
};

// Adicionar aluno à turma
export const addAlunoToTurma = async (turmaId, alunoId) => {
  try {
    const turmaRef = doc(db, 'turmas', turmaId);
    const turmaSnap = await getDoc(turmaRef);
    
    if (!turmaSnap.exists()) {
      return { success: false, error: 'Turma não encontrada' };
    }
    
    const turmaData = turmaSnap.data();
    const alunos = turmaData.alunos || [];
    
    if (alunos.includes(alunoId)) {
      return { success: false, error: 'Aluno já está na turma' };
    }
    
    alunos.push(alunoId);
    
    await updateDoc(turmaRef, { alunos });
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Remover aluno da turma
export const removeAlunoFromTurma = async (turmaId, alunoId) => {
  try {
    const turmaRef = doc(db, 'turmas', turmaId);
    const turmaSnap = await getDoc(turmaRef);
    
    if (!turmaSnap.exists()) {
      return { success: false, error: 'Turma não encontrada' };
    }
    
    const turmaData = turmaSnap.data();
    const alunos = turmaData.alunos || [];
    
    const index = alunos.indexOf(alunoId);
    if (index === -1) {
      return { success: false, error: 'Aluno não está na turma' };
    }
    
    alunos.splice(index, 1);
    
    await updateDoc(turmaRef, { alunos });
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};