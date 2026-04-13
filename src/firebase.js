// Firebase disabled for offline mode - provide mock implementations

export const db = null;
export const auth = {
  currentUser: null
};

// Mock Firebase functions for offline mode
export const collection = () => ({});
export const doc = () => ({});
export const query = () => ({});
export const where = () => ({});
export const getDocs = async () => ({ empty: true, docs: [] });
export const getDoc = async () => ({ exists: () => false, data: () => ({}) });
export const addDoc = async () => ({ id: 'mock-id' });
export const updateDoc = async () => ({});
export const onSnapshot = () => () => {};
