import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

export type TaskInput = {
    ownerUid: string;
    title: string;
    plannedMinutes: number;
    startAt: Date;
    endAt: Date;
    location: { lat: number; lng: number } | null;
};

export async function createTask(input: TaskInput) {
    await addDoc(collection(db, "tasks"), {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
}

export async function removeTask(taskId: string) {
    await deleteDoc(doc(db, "tasks", taskId));
}

export async function updateTask(taskId: string, patch: Record<string, any>) {
    await updateDoc(doc(db, "tasks", taskId), { ...patch, updatedAt: serverTimestamp() });
}
