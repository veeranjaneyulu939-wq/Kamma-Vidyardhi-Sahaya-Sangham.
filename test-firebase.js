import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwo7rCZ9DmYERCQjx70wtGpbld6GNLunE",
  authDomain: "kamma-vidyardi.firebaseapp.com",
  projectId: "kamma-vidyardi",
  storageBucket: "kamma-vidyardi.appspot.com",
  messagingSenderId: "186775728553",
  appId: "1:186775728553:web:c846d9f4eed01ddff194b8",
  measurementId: "G-TPP7SPV5EP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testRead() {
  try {
    const querySnapshot = await getDocs(collection(db, 'gallery_photos'));
    console.log(`Found ${querySnapshot.size} photos in gallery_photos.`);
    querySnapshot.forEach(doc => {
      console.log(doc.id, " => ", doc.data().title);
    });
    
    const pagesSnapshot = await getDocs(collection(db, 'pages'));
    console.log(`Found ${pagesSnapshot.size} documents in pages.`);
    pagesSnapshot.forEach(doc => {
      console.log(doc.id, " => ", Object.keys(doc.data()));
    });
    
    process.exit(0);
  } catch (error) {
    console.error(error);
  }
}

testRead();
