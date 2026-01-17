import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function Session() {
    const router = useRouter();
    const { taskId, title } = useLocalSearchParams<{ taskId?: string; title?: string }>();
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setSeconds((s) => s + 1), 1000);
        return () => clearInterval(t);
    }, []);

    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");

    return (
        <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
            <Text style={{ fontSize: 18, opacity: 0.7 }}>{title ?? "Task"}</Text>
            <Text style={{ fontSize: 24, fontWeight: "700" }}>Timer läuft</Text>
            <Text style={{ fontSize: 56, fontWeight: "700" }}>{mm}:{ss}</Text>

            <Text style={{ opacity: 0.6 }}>Task ID: {taskId ?? "-"}</Text>

            <Pressable onPress={() => router.back()} style={{ backgroundColor: "black", padding: 12, borderRadius: 10 }}>
                <Text style={{ color: "white", textAlign: "center" }}>Stop</Text>
            </Pressable>
        </View>
    );
}
