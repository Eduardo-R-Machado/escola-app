import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Criar nova matéria
export const createMateria = async (materiaData, userId) => {
  try {
    const docRef = await addDoc(collection(db, 'materias'), {
      ...materiaData,
      criado_por: userId,
      data_criacao: new Date()
    });
    
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Buscar todas as matérias
export const getAllMaterias = async () => {
  try {
    const materiasRef = collection(db, 'materias');
    const materiasSnap = await getDocs(materiasRef);
    
    const materias = [];
    materiasSnap.forEach(doc => {
      materias.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { materias, error: null };
  } catch (error) {
    return { materias: [], error: error.message };
  }
};

// Obter matéria por ID
export const getMateriaById = async (materiaId) => {
  try {
    const materiaRef = doc(db, 'materias', materiaId);
    const materiaSnap = await getDoc(materiaRef);
    
    if (materiaSnap.exists()) {
      return { 
        materia: { id: materiaSnap.id, ...materiaSnap.data() }, 
        error: null 
      };
    } else {
      return { materia: null, error: 'Matéria não encontrada' };
    }
  } catch (error) {
    return { materia: null, error: error.message };
  }
};

// Atualizar matéria
export const updateMateria = async (materiaId, materiaData) => {
  try {
    const materiaRef = doc(db, 'materias', materiaId);
    await updateDoc(materiaRef, materiaData);
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Deletar matéria
export const deleteMateria = async (materiaId) => {
  try {
    await deleteDoc(doc(db, 'materias', materiaId));
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
