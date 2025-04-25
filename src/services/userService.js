import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';

// Buscar usuário por ID
export const getUserById = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      return { 
        user: { id: userSnap.id, ...userSnap.data() }, 
        error: null 
      };
    } else {
      return { user: null, error: 'Usuário não encontrado' };
    }
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Buscar usuários por tipo
export const getUsersByTipo = async (tipo) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('tipo', '==', tipo));
    const usersSnap = await getDocs(q);
    
    const users = [];
    usersSnap.forEach(doc => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { users, error: null };
  } catch (error) {
    return { users: [], error: error.message };
  }
};

// Atualizar perfil do usuário
export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, userData);
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Buscar alunos por turma
export const getAlunosByTurma = async (turmaId) => {
  try {
    const turmaRef = doc(db, 'turmas', turmaId);
    const turmaSnap = await getDoc(turmaRef);
    
    if (!turmaSnap.exists()) {
      return { alunos: [], error: 'Turma não encontrada' };
    }
    
    const turmaData = turmaSnap.data();
    const alunosIds = turmaData.alunos || [];
    
    if (alunosIds.length === 0) {
      return { alunos: [], error: null };
    }
    
    const alunos = [];
    
    // Buscar dados de cada aluno
    for (const alunoId of alunosIds) {
      const alunoRef = doc(db, 'users', alunoId);
      const alunoSnap = await getDoc(alunoRef);
      
      if (alunoSnap.exists()) {
        alunos.push({
          id: alunoSnap.id,
          ...alunoSnap.data()
        });
      }
    }
    
    return { alunos, error: null };
  } catch (error) {
    return { alunos: [], error: error.message };
  }
};

// Buscar professores por turma
export const getProfessoresByTurma = async (turmaId) => {
  try {
    const turmaRef = doc(db, 'turmas', turmaId);
    const turmaSnap = await getDoc(turmaRef);
    
    if (!turmaSnap.exists()) {
      return { professores: [], error: 'Turma não encontrada' };
    }
    
    const turmaData = turmaSnap.data();
    const professoresIds = turmaData.professores || [];
    
    if (professoresIds.length === 0) {
      return { professores: [], error: null };
    }
    
    const professores = [];
    
    // Buscar dados de cada professor
    for (const professorId of professoresIds) {
      const professorRef = doc(db, 'users', professorId);
      const professorSnap = await getDoc(professorRef);
      
      if (professorSnap.exists()) {
        professores.push({
          id: professorSnap.id,
          ...professorSnap.data()
        });
      }
    }
    
    return { professores, error: null };
  } catch (error) {
    return { professores: [], error: error.message };
  }
};