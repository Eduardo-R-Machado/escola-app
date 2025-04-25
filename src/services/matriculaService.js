import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Gerar uma matrícula aleatória
export const generateRandomMatricula = (tipo) => {
  const prefix = tipo === 'professor' ? 'PROF' : 'ALUNO';
  const randomNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  const year = new Date().getFullYear();
  
  return `${prefix}${year}${randomNumber}`;
};

// Criar nova matrícula disponível
export const createMatricula = async (matriculaData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'matriculas_disponiveis'), {
      ...matriculaData,
      usado: false,
      criado_por: userId,
      data_criacao: new Date()
    });
    
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Buscar matrículas disponíveis por tipo
export const getMatriculasDisponiveisByTipo = async (tipo) => {
  try {
    const matriculasRef = collection(db, 'matriculas_disponiveis');
    const q = query(
      matriculasRef,
      where('tipo', '==', tipo),
      where('usado', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    const matriculas = [];
    
    querySnapshot.forEach((doc) => {
      matriculas.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { matriculas, error: null };
  } catch (error) {
    return { matriculas: [], error: error.message };
  }
};

// Deletar uma matrícula
export const deleteMatricula = async (matriculaId) => {
  try {
    await deleteDoc(doc(db, 'matriculas_disponiveis', matriculaId));
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};