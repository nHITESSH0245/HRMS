
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-firestore.js";

const firebaseConfig = {
  
  authDomain: "hrms-426e8.firebaseapp.com",
  projectId: "hrms-426e8",
  storageBucket: "hrms-426e8.firebasestorage.app",
  messagingSenderId: "923948167758",
  appId: "1:923948167758:web:f700241c420212173f891f",
  measurementId: "G-RW6BW73SHW"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
