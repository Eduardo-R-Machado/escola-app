import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

// Login de usuário
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
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

// Cadastro de usuário com matrícula
export const registerUser = async (email, password, userData, matricula) => {
  try {
    // Verificar se a matrícula existe e está disponível
    const matriculasRef = collection(db, 'matriculas_disponiveis');
    const q = query(
      matriculasRef, 
      where('matricula', '==', matricula),
      where('usado', '==', false),
      where('tipo', '==', userData.tipo)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return { 
        user: null, 
        error: 'Matrícula inválida ou já utilizada'
      };
    }
    
    // Matrícula válida, cadastrar usuário
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Salvar dados do usuário no Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      email,
      matricula,
      data_cadastro: new Date(),
      status: true
    });
    
    // Marcar a matrícula como usada
    const matriculaDoc = querySnapshot.docs[0];
    await setDoc(doc(db, 'matriculas_disponiveis', matriculaDoc.id), {
      ...matriculaDoc.data(),
      usado: true
    });
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

// Reset de senha
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Verificar se o usuário tem acesso a uma turma específica
export const hasAccessToTurma = async (turmaId, alunoId) => {
  try {
    const turmaRef = doc(db, 'turmas', turmaId);
    const turmaSnap = await getDoc(turmaRef);
    
    if (!turmaSnap.exists()) {
      return false;
    }
    
    const alunos = turmaSnap.data().alunos;
    return alunos.includes(alunoId);
  } catch (error) {
    return false;
  }
};

