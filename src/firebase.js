import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_5Qs2lhzZWAhukYtrvH8Nn3Y1wHNjUrM",
  authDomain: "questme-2b94f.firebaseapp.com",
  projectId: "questme-2b94f",
  storageBucket: "questme-2b94f.firebasestorage.app",
  messagingSenderId: "437421151039",
  appId: "1:437421151039:web:47ae1ecf675ed758ce798a"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
