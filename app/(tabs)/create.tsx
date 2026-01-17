import React, { useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { getCurrentLocation } from "../../lib/location";
import { createTask } from "../../lib/tasks";

function parseTimeToday(hhmm: string): Date | null {
    const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm.trim());
    if (!m) return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    const d = new Date();
    d.setHours(h, min, 0, 0);
    return d;
}

export default function CreateTask() {
    const { user } = useAuth();
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [plannedMinutes, setPlannedMinutes] = useState("30");
    const [startHHMM, setStartHHMM] = useState("18:00");
    const [endHHMM, setEndHHMM] = useState("18:30");
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [saving, setSaving] = useState(false);

    const canSave = useMemo(() => !!user && title.trim().length > 0, [user, title]);

    async function onAddLocation() {
        try {
            const loc = await getCurrentLocation();
            setLocation(loc);
            Alert.alert("Location gespeichert", `Lat: ${loc.lat.toFixed(5)}, Lng: ${loc.lng.toFixed(5)}`);
        } catch (e: any) {
            Alert.alert("Location Fehler", e?.message ?? "Konnte Location nicht holen");
        }
    }

    async function onSave() {
        if (!user) {
            router.replace("/(tabs)/login");
            return;
        }

        const startAt = parseTimeToday(startHHMM);
        const endAt = parseTimeToday(endHHMM);
        if (!startAt || !endAt) {
            Alert.alert("Zeitformat", "Bitte HH:MM (z.B. 18:00)");
            return;
        }

        const mins = Number(plannedMinutes);
        if (!Number.isFinite(mins) || mins <= 0) {
            Alert.alert("Dauer", "Bitte Minuten als Zahl (z.B. 30)");
            return;
        }

        setSaving(true);
        try {
            await createTask({
                ownerUid: user.uid,
                title: title.trim(),
                plannedMinutes: mins,
                startAt,
                endAt,
                location,
            });
            Alert.alert("Gespeichert", "Task wurde gespeichert.");
            router.back();
        } catch (e: any) {
            Alert.alert("Fehler", e?.message ?? "Speichern fehlgeschlagen");
        } finally {
            setSaving(false);
        }
    }

    return (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <Text style={{ fontSize: 24, fontWeight: "700" }}>Neuer Task</Text>

            <TextInput placeholder="Titel" value={title} onChangeText={setTitle}
                       style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />

            <TextInput placeholder="Dauer (Minuten)" keyboardType="numeric"
                       value={plannedMinutes} onChangeText={setPlannedMinutes}
                       style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />

            <TextInput placeholder="Start (HH:MM)" value={startHHMM} onChangeText={setStartHHMM}
                       style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />

            <TextInput placeholder="Ende (HH:MM)" value={endHHMM} onChangeText={setEndHHMM}
                       style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />

            <Pressable onPress={onAddLocation} style={{ padding: 12, borderRadius: 10, borderWidth: 1 }}>
                <Text style={{ textAlign: "center" }}>{location ? "Location gesetzt ✅" : "Location hinzufügen (GPS)"}</Text>
            </Pressable>

            <Pressable disabled={!canSave || saving} onPress={onSave}
                       style={{ backgroundColor: canSave ? "black" : "gray", padding: 12, borderRadius: 10 }}>
                <Text style={{ color: "white", textAlign: "center" }}>{saving ? "Speichern..." : "Speichern"}</Text>
            </Pressable>

            <Pressable onPress={() => router.back()} style={{ padding: 12 }}>
                <Text style={{ textAlign: "center" }}>Abbrechen</Text>
            </Pressable>
        </View>
    );
}

