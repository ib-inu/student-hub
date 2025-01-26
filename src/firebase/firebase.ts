import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBehdghlnXPrTGvSxlsvNbb-n2utmobEEk",
    authDomain: "studenthub-bd01a.firebaseapp.com",
    projectId: "studenthub-bd01a",
    storageBucket: "studenthub-bd01a.firebasestorage.app",
    messagingSenderId: "461750977880",
    appId: "1:461750977880:web:7bff260b53c49e1e14912d",
    measurementId: "G-63JPBLDCZW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, app, auth, analytics, };
