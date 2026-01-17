import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function Index() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        router.replace(user ? "/(tabs)" : "/(tabs)/login");
    }, [user, loading]);

    return (
        <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator />
        </View>
    );
}
