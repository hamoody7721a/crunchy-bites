import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAuO2Kxhl7vkALooxW7AEL1cAHdXOIqKDY",
  authDomain: "crunchy-bites-2b477.firebaseapp.com",
  projectId: "crunchy-bites-2b477",
  storageBucket: "crunchy-bites-2b477.firebasestorage.app",
  messagingSenderId: "927847879086",
  appId: "1:927847879086:web:7adbf2b20cd44346deb83f"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)