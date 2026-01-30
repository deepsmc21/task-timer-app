import React, { useEffect, useState } from "react";
import {View, Text, FlatList, Pressable, Alert} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { removeTask } from "../../lib/tasks";

type Task = {
    id: string;
    title: string;
    plannedMinutes: number;
    startAt: any;
    endAt: any;
    location?: { lat: number; lng: number } | null;
};

export default function TasksTab() {
    const { user } = useAuth();
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);

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

    return (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "700" }}>Tasks</Text>
                <Pressable onPress={() => router.push("/(tabs)/create")} style={{ padding: 10, borderWidth: 1, borderRadius: 10 }}>
                    <Text>+ Task</Text>
                </Pressable>
            </View>

            <FlatList
                data={tasks}
                keyExtractor={(t) => t.id}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                ListEmptyComponent={<Text style={{ opacity: 0.7 }}>Noch keine Tasks.</Text>}
                renderItem={({ item }) => {
                    const start = item.startAt?.toDate?.() ? item.startAt.toDate() : null;
                    return (
                        <View style={{ borderWidth: 1, borderRadius: 12, padding: 12, gap: 6 }}>
                            <Text style={{ fontSize: 16, fontWeight: "700" }}>{item.title}</Text>
                            <Text>Start: {start ? start.toLocaleString() : "-"}</Text>
                            {item.location ? (
                                <Text style={{ opacity: 0.8 }}>
                                    Ort: {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                                </Text>
                            ) : (
                                <Text style={{ opacity: 0.6 }}>Kein Ort</Text>
                            )}
                            <Pressable
                                onPress={() => router.push({ pathname: "/(tabs)/session", params: { taskId: item.id, title: item.title } })}
                                style={{ marginTop: 6, padding: 10, backgroundColor: "black", borderRadius: 10 }}
                            >
                                <Text style={{ color: "white", textAlign: "center" }}>Session starten (Timer)</Text>
                            </Pressable>
                            <Pressable
                                onPress={() =>
                                    Alert.alert(
                                        "Task löschen?",
                                        "Willst du diesen Task wirklich löschen?",
                                        [
                                            { text: "Abbrechen", style: "cancel" },
                                            {
                                                text: "Löschen",
                                                style: "destructive",
                                                onPress: async () => {
                                                    await removeTask(item.id);

                                                },
                                            },
                                        ]
                                    )
                                }
                                style={{
                                    marginTop: 6,
                                    padding: 10,
                                    borderRadius: 10,
                                    borderWidth: 1,
                                }}
                            >
                                <Text style={{ textAlign: "center" }}>🗑️ Task löschen</Text>
                            </Pressable>
                        </View>
                    );
                }}
            />
        </View>
    );
}
