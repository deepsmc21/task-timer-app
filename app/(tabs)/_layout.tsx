import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: true }}>
            <Tabs.Screen name="index" options={{ title: "Heute" }} />
            <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
            <Tabs.Screen name="settings" options={{ title: "Settings" }} />

            {/* versteckt */}
            <Tabs.Screen name="create" options={{ href: null, title: "Neuer Task" }} />
            <Tabs.Screen name="session" options={{ href: null, title: "Session" }} />
            <Tabs.Screen name="login" options={{ href: null, title: "Login" }} />
            <Tabs.Screen name="register" options={{ href: null, title: "Register" }} />
        </Tabs>
    );
}
