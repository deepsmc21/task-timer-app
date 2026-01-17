import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function Register() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [err, setErr] = useState("");

    async function onRegister() {
        setErr("");
        try {
            await createUserWithEmailAndPassword(auth, email.trim(), pw);
            router.replace("/(tabs)");
        } catch (e: any) {
            setErr(e?.message ?? "Registrierung fehlgeschlagen");
        }
    }

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 12 }}>
            <Text style={{ fontSize: 28, fontWeight: "700" }}>Registrieren</Text>

            <TextInput placeholder="Email" autoCapitalize="none"
                       value={email} onChangeText={setEmail}
                       style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />

            <TextInput placeholder="Passwort" secureTextEntry
                       value={pw} onChangeText={setPw}
                       style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />

            {err ? <Text style={{ color: "red" }}>{err}</Text> : null}

            <Pressable onPress={onRegister} style={{ backgroundColor: "black", padding: 12, borderRadius: 10 }}>
                <Text style={{ color: "white", textAlign: "center" }}>Konto erstellen</Text>
            </Pressable>

            <Pressable onPress={() => router.back()} style={{ padding: 12 }}>
                <Text style={{ textAlign: "center" }}>Zurück</Text>
            </Pressable>
        </View>
    );
}
