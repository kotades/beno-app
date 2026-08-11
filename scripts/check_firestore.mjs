import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBs0K0T_CaY1ykaqOUk9jpXdZnuXLRraas",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "velo-d3b31.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "velo-d3b31",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "velo-d3b31.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "711913337698",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:711913337698:web:b27dbc18dcf2513259723b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkBookings() {
  console.log("Checking Firestore project:", firebaseConfig.projectId);
  try {
    const snap = await getDocs(collection(db, 'bookings'));
    console.log(`\n=== FIRESTORE BOOKINGS RESULT ===`);
    console.log(`Total Bookings Count: ${snap.size}`);
    if (snap.size === 0) {
      console.log("No bookings have been logged in Firestore yet.");
    } else {
      snap.forEach(doc => {
        console.log(`\n[Booking ID: ${doc.id}]`);
        console.log(JSON.stringify(doc.data(), null, 2));
      });
    }
  } catch (err) {
    console.error("Error fetching bookings from Firestore:", err);
  }
}

checkBookings().then(() => process.exit(0));
