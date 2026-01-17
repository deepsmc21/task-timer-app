import React, { useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function Settings() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.replace("/(tabs)/login");
    }, [user]);

    return (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <Text style={{ fontSize: 24, fontWeight: "700" }}>Settings</Text>

            <Pressable
                onPress={async () => {
                    await signOut(auth);
                    router.replace("/(tabs)/login");
                }}
                style={{ backgroundColor: "black", padding: 12, borderRadius: 10 }}
            >
                <Text style={{ color: "white", textAlign: "center" }}>Logout</Text>
            </Pressable>
        </View>
    );
}
