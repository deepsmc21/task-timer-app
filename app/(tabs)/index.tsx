import React, { useEffect, useMemo, useState } from "react";
import { View, Text, FlatList, Modal, Pressable } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";

type Task = {
    id: string;
    title: string;
    plannedMinutes: number;
    startAt: any;
    endAt: any;
    location?: { lat: number; lng: number } | null;
};

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function Today() {
    const { user } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [showReminder, setShowReminder] = useState(false);

    // Guard: wenn nicht eingeloggt -> login
    useEffect(() => {
        if (!user) router.replace("/(tabs)/login");
    }, [user]);

    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "tasks"), where("ownerUid", "==", user.uid));
        const unsub = onSnapshot(q, (snap) => {
            setTasks(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
        });
        return unsub;
    }, [user]);

    const todayTasks = useMemo(() => {
        const now = new Date();
        return tasks.filter((t) => {
            const start = t.startAt?.toDate?.() ? t.startAt.toDate() : null;
            return start ? isSameDay(start, now) : false;
        });
    }, [tasks]);

    useEffect(() => {
        // “Erinnerung” beim Öffnen: In-App Modal
        if (todayTasks.length > 0) setShowReminder(true);
    }, [todayTasks.length]);

    return (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "700" }}>Heute</Text>
                <Pressable onPress={() => router.push("/(tabs)/create")} style={{ padding: 10, borderWidth: 1, borderRadius: 10 }}>
                    <Text>+ Task</Text>
                </Pressable>
            </View>

            <Modal visible={showReminder} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 24 }}>
                    <View style={{ backgroundColor: "white", borderRadius: 14, padding: 16, gap: 10 }}>
                        <Text style={{ fontSize: 18, fontWeight: "700" }}>Heute anstehend</Text>
                        <Text>Du hast heute {todayTasks.length} Task(s).</Text>
                        <Pressable onPress={() => setShowReminder(false)} style={{ padding: 12, backgroundColor: "black", borderRadius: 10 }}>
                            <Text style={{ color: "white", textAlign: "center" }}>Ok</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <FlatList
                data={todayTasks}
                keyExtractor={(t) => t.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={<Text style={{ opacity: 0.7 }}>Keine Tasks für heute.</Text>}
                renderItem={({ item }) => {
                    const start = item.startAt?.toDate?.() ? item.startAt.toDate() : null;
                    const end = item.endAt?.toDate?.() ? item.endAt.toDate() : null;
                    return (
                        <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 6 }}>
                            <Text style={{ fontSize: 16, fontWeight: "700" }}>{item.title}</Text>
                            <Text>
                                {start ? start.toLocaleTimeString() : "-"} – {end ? end.toLocaleTimeString() : "-"} | {item.plannedMinutes} min
                            </Text>

                            <Pressable
                                onPress={() => router.push({ pathname: "/(tabs)/session", params: { taskId: item.id, title: item.title } })}
                                style={{ marginTop: 6, padding: 10, backgroundColor: "black", borderRadius: 10 }}
                            >
                                <Text style={{ color: "white", textAlign: "center" }}>Session starten (Timer)</Text>
                            </Pressable>
                        </View>
                    );
                }}
            />
        </View>
    );
}
