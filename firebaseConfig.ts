import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAjPfAjrQr321v4iCE1WYfW94qnXz6onJo",
    authDomain: "task-timer-2953f.firebaseapp.com",
    projectId: "task-timer-2953f",
    storageBucket: "task-timer-2953f.appspot.com", // kann so bleiben, Storage nutzen wir nicht
    messagingSenderId: "183613658149",
    appId: "1:183613658149:web:93764ccc7c2a13f5339bcc",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
