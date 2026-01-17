import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useRouter } from "expo-router";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [err, setErr] = useState("");

    async function onLogin() {
        setErr("");
        try {
            await signInWithEmailAndPassword(auth, email.trim(), pw);
            router.replace("/(tabs)");
        } catch (e: any) {
            setErr(e?.message ?? "Login fehlgeschlagen");
        }
    }

    return (
        <View style={{ flex: 1, padding: 20, justifyContent: "center", gap: 12 }}>
            <Text style={{ fontSize: 28, fontWeight: "700" }}>Login</Text>

            <TextInput placeholder="Email" autoCapitalize="none"
                       value={email} onChangeText={setEmail}
                       style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />

            <TextInput placeholder="Passwort" secureTextEntry
                       value={pw} onChangeText={setPw}
                       style={{ borderWidth: 1, padding: 10, borderRadius: 8 }} />

            {err ? <Text style={{ color: "red" }}>{err}</Text> : null}

            <Pressable onPress={onLogin} style={{ backgroundColor: "black", padding: 12, borderRadius: 10 }}>
                <Text style={{ color: "white", textAlign: "center" }}>Login</Text>
            </Pressable>

            <Pressable onPress={() => router.push("/(tabs)/register")} style={{ padding: 12 }}>
                <Text style={{ textAlign: "center" }}>Noch kein Konto? Registrieren</Text>
            </Pressable>
        </View>
    );
}
