import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDijQt7oGC5EJp0pKnTItHFMI6J42HBkd0",
  authDomain: "lauren-art.firebaseapp.com",
  projectId: "lauren-art",
  storageBucket: "lauren-art.appspot.com",
  messagingSenderId: "798398504988",
  appId: "1:798398504988:web:e5a1679eeca0c4ca65bfd9"
};

const app = initializeApp(firebaseConfig);

export default app;

export const database = getFirestore(app);
