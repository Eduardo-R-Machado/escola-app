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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

// Criar novo trabalho
export const criarTrabalho = async (trabalhoData, arquivos = []) => {
  try {
    // Upload de arquivos primeiro (se houver)
    const arquivosUrls = [];
    
    if (arquivos && arquivos.length > 0) {
      for (const arquivo of arquivos) {
        const storageRef = ref(storage, `trabalhos/${Date.now()}_${arquivo.name}`);
        await uploadBytes(storageRef, arquivo);
        const downloadUrl = await getDownloadURL(storageRef);
        arquivosUrls.push(downloadUrl);
      }
    }
    
    // Criar o trabalho no Firestore
    const docRef = await addDoc(collection(db, 'trabalhos'), {
      ...trabalhoData,
      arquivos_anexos: arquivosUrls,
      data_criacao: new Date()
    });
    
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Buscar trabalhos por turma e matéria
export const getTrabalhosByTurmaMateria = async (turmaId, materiaId) => {
  try {
    const trabalhosRef = collection(db, 'trabalhos');
    const q = query(
      trabalhosRef,
      where('turma_id', '==', turmaId),
      where('materia_id', '==', materiaId),
      orderBy('data_entrega', 'desc')
    );
    
    const trabalhosSnap = await getDocs(q);
    const trabalhos = [];
    
    trabalhosSnap.forEach(doc => {
      trabalhos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { trabalhos, error: null };
  } catch (error) {
    return { trabalhos: [], error: error.message };
  }
};

// Entregar trabalho (aluno)
export const entregarTrabalho = async (entregaData, arquivos = []) => {
  try {
    // Upload de arquivos primeiro
    const arquivosUrls = [];
    
    if (arquivos && arquivos.length > 0) {
      for (const arquivo of arquivos) {
        const storageRef = ref(storage, `entregas/${Date.now()}_${arquivo.name}`);
        await uploadBytes(storageRef, arquivo);
        const downloadUrl = await getDownloadURL(storageRef);
        arquivosUrls.push(downloadUrl);
      }
    }
    
    // Criar a entrega no Firestore
    const docRef = await addDoc(collection(db, 'entregas_trabalhos'), {
      ...entregaData,
      arquivos: arquivosUrls,
      data_entrega: new Date(),
      status: 'entregue',
      nota: null,
      comentario_professor: ''
    });
    
    return { id: docRef.id, error: null };
  } catch (error) {
    return { id: null, error: error.message };
  }
};

// Avaliar entrega de trabalho (professor)
export const avaliarEntregaTrabalho = async (entregaId, nota, comentario) => {
  try {
    const entregaRef = doc(db, 'entregas_trabalhos', entregaId);
    await updateDoc(entregaRef, {
      nota,
      comentario_professor: comentario,
      status: 'avaliado',
      data_avaliacao: new Date()
    });
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
