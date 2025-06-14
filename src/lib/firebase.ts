
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// ADVERTENCIA: En un proyecto real, estas claves deben estar en variables de entorno
// y no directamente en el código fuente, especialmente si el repositorio es público.
const firebaseConfig: FirebaseOptions = {
  apiKey: "TU_API_KEY", // Reemplaza con tu API Key
  authDomain: "TU_PROJECT_ID.firebaseapp.com", // Reemplaza con tu Auth Domain
  projectId: "TU_PROJECT_ID", // Reemplaza con tu Project ID
  storageBucket: "TU_PROJECT_ID.appspot.com", // Reemplaza con tu Storage Bucket
  messagingSenderId: "TU_MESSAGING_SENDER_ID", // Reemplaza con tu Messaging Sender ID
  appId: "TU_APP_ID" // Reemplaza con tu App ID
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const db = getFirestore(app);

export { db, app };
