import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Registrar nova aula com presenças
export const registrarAula = async (aulaData) => {
  try {
    const docRef = await addDoc(collection(db, 'aulas'), {
      ...aulaData,
      data_registro: new Date()
    });
    
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Buscar aulas por turma e professor
export const getAulasByTurmaAndProfessor = async (turmaId, professorId) => {
  try {
    const aulasRef = collection(db, 'aulas');
    const q = query(
      aulasRef,
      where('turma_id', '==', turmaId),
      where('professor_id', '==', professorId),
      orderBy('data', 'desc')
    );
    
    const aulasSnap = await getDocs(q);
    const aulas = [];
    
    aulasSnap.forEach(doc => {
      aulas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { aulas, error: null };
  } catch (error) {
    return { aulas: [], error: error.message };
  }
};

// Buscar aulas por turma (para alunos e responsáveis)
export const getAulasByTurma = async (turmaId) => {
  try {
    const aulasRef = collection(db, 'aulas');
    const q = query(
      aulasRef,
      where('turma_id', '==', turmaId),
      orderBy('data', 'desc')
    );
    
    const aulasSnap = await getDocs(q);
    const aulas = [];
    
    aulasSnap.forEach(doc => {
      aulas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { aulas, error: null };
  } catch (error) {
    return { aulas: [], error: error.message };
  }
};