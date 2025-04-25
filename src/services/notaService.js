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

// Registrar nova nota
export const registrarNota = async (notaData) => {
  try {
    const docRef = await addDoc(collection(db, 'notas'), {
      ...notaData,
      data_registro: new Date()
    });
    
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Atualizar nota existente
export const atualizarNota = async (notaId, notaData) => {
  try {
    const notaRef = doc(db, 'notas', notaId);
    await updateDoc(notaRef, notaData);
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Buscar notas por aluno, turma e matéria
export const getNotasByAlunoTurmaMateria = async (alunoId, turmaId, materiaId) => {
  try {
    const notasRef = collection(db, 'notas');
    const q = query(
      notasRef,
      where('aluno_id', '==', alunoId),
      where('turma_id', '==', turmaId),
      where('materia_id', '==', materiaId)
    );
    
    const notasSnap = await getDocs(q);
    const notas = [];
    
    notasSnap.forEach(doc => {
      notas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { notas, error: null };
  } catch (error) {
    return { notas: [], error: error.message };
  }
};

// Buscar notas por turma e matéria (para o professor)
export const getNotasByTurmaMateria = async (turmaId, materiaId) => {
  try {
    const notasRef = collection(db, 'notas');
    const q = query(
      notasRef,
      where('turma_id', '==', turmaId),
      where('materia_id', '==', materiaId)
    );
    
    const notasSnap = await getDocs(q);
    const notas = [];
    
    notasSnap.forEach(doc => {
      notas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { notas, error: null };
  } catch (error) {
    return { notas: [], error: error.message };
  }
};