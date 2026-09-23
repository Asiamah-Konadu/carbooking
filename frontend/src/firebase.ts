import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyCnzUPneU1bcZUK0POYSpy7j0F48hdW1Hk",
  authDomain: "carbooking-ad206.firebaseapp.com",
  projectId: "carbooking-ad206",
  storageBucket: "carbooking-ad206.firebasestorage.app",
  messagingSenderId: "929502672873",
  appId: "1:929502672873:web:9f0767e664b7f5099d3d78",
  measurementId: "G-Y4XR524TV3"
};

// Initialize Firebase App
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Firebase Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics (safe for SSR / testing environments)
export let analytics: any = null;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
