import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const useFirestore = () => {
  const getDocument = async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
      } else {
        return { data: null, error: 'Documento não encontrado' };
      }
    } catch (error) {
      return { data: null, error: error.message };
    }
  };
  
  const getDocuments = async (collectionName, conditions = [], orderByField = null, orderDirection = 'asc', limitCount = 0) => {
    try {
      let q = collection(db, collectionName);
      
      // Aplicar condições de filtro
      if (conditions && conditions.length > 0) {
        conditions.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }
      
      // Aplicar ordenação
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }
      
      // Aplicar limite
      if (limitCount > 0) {
        q = query(q, limit(limitCount));
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return { data: documents, error: null };
    } catch (error) {
      return { data: [], error: error.message };
    }
  };
  
  const addDocument = async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      return { id: docRef.id, error: null };
    } catch (error) {
      return { id: null, error: error.message };
    }
  };
  
  const updateDocument = async (collectionName, id, data) => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const deleteDocument = async (collectionName, id) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const useDocument = (collectionName, id) => {
    const [document, setDocument] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const docRef = doc(db, collectionName, id);
      
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setDocument({ id: snapshot.id, ...snapshot.data() });
            setError(null);
          } else {
            setDocument(null);
            setError('Documento não encontrado');
          }
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
      
      return () => unsubscribe();
    }, [collectionName, id]);
    
    return { document, error, loading };
  };
  
  const useCollection = (collectionName, conditions = [], orderByField = null, orderDirection = 'asc') => {
    const [documents, setDocuments] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      let q = collection(db, collectionName);
      
      if (conditions && conditions.length > 0) {
        conditions.forEach(condition => {
          q = query(q, where(condition.field, condition.operator, condition.value));
        });
      }
      
      if (orderByField) {
        q = query(q, orderBy(orderByField, orderDirection));
      }
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const results = [];
          snapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
          });
          
          setDocuments(results);
          setError(null);
          setLoading(false);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );
      
      return () => unsubscribe();
    }, [collectionName, JSON.stringify(conditions), orderByField, orderDirection]);
    
    return { documents, error, loading };
  };
  
  return {
    getDocument,
    getDocuments,
    addDocument,
    updateDocument,
    deleteDocument,
    useDocument,
    useCollection
  };
};
