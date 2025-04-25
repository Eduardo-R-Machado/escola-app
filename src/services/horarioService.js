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

// Criar novo horário
export const createHorario = async (horarioData) => {
  try {
    const docRef = await addDoc(collection(db, 'horarios'), horarioData);
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Buscar horários por turma
export const getHorariosByTurma = async (turmaId) => {
  try {
    const horariosRef = collection(db, 'horarios');
    const q = query(horariosRef, where('turma_id', '==', turmaId));
    const horariosSnap = await getDocs(q);
    
    const horarios = [];
    horariosSnap.forEach(doc => {
      horarios.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { horarios, error: null };
  } catch (error) {
    return { horarios: [], error: error.message };
  }
};

// Atualizar horário
export const updateHorario = async (horarioId, horarioData) => {
  try {
    const horarioRef = doc(db, 'horarios', horarioId);
    await updateDoc(horarioRef, horarioData);
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Deletar horário
export const deleteHorario = async (horarioId) => {
  try {
    await deleteDoc(doc(db, 'horarios', horarioId));
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};