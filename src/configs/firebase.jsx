import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCCoaO1TQal9ld-uprZiVFGuVA_gM5qcYI",
  authDomain: "shopdunk-bba42.firebaseapp.com",
  databaseURL:
    "https://shopdunk-bba42-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shopdunk-bba42",
  storageBucket: "shopdunk-bba42.appspot.com",
  messagingSenderId: "1038759657584",
  appId: "1:1038759657584:web:5822876984fedfdc7bf4b5",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getDatabase(firebaseApp);

 