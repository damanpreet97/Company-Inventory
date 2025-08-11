
// Lightweight Firebase push helper - use only in renderer if needed.
// NOTE: For production, consider secure server or admin SDK.
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "FIREBASE_API_KEY",
  authDomain: "FIREBASE_AUTH_DOMAIN",
  projectId: "FIREBASE_PROJECT_ID",
  storageBucket: "FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "FIREBASE_MESSAGING_SENDER_ID",
  appId: "FIREBASE_APP_ID"
};

let app;
let db;

export function initFirebase(cfg) {
  if (!app) {
    app = initializeApp(cfg || firebaseConfig);
    db = getFirestore(app);
  }
}

export async function pushEntityToFirestore(collection, id, payload) {
  if (!db) initFirebase();
  const ref = doc(db, collection, String(id));
  await setDoc(ref, payload);
}
