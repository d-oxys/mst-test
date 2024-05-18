import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBspnnXdcfPM8WJrtdHGrSaFdDR52dk97A',
  authDomain: 'mst-test-b1e93.firebaseapp.com',
  projectId: 'mst-test-b1e93',
  storageBucket: 'mst-test-b1e93.appspot.com',
  messagingSenderId: '587607927008',
  appId: '1:587607927008:web:c8f17053db635802eb8885',
  measurementId: 'G-QCZ1GN2DKQ',
};

let app: FirebaseApp;
let db: Firestore;
let storage;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  app = getApp();
  db = getFirestore(app);
  storage = getStorage(app);
}

export { db, storage };
