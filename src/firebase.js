import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBwo7rCZ9DmYERCQjx70wtGpbld6GNLunE",
  authDomain: "kamma-vidyardi.firebaseapp.com",
  projectId: "kamma-vidyardi",
  storageBucket: "kamma-vidyardi.firebasestorage.app",
  messagingSenderId: "186775728553",
  appId: "1:186775728553:web:c846d9f4eed01ddff194b8",
  measurementId: "G-TPP7SPV5EP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const provider = new GoogleAuthProvider();

export { auth, db, storage, provider, signInWithPopup, signInWithEmailAndPassword, signOut };
