import { Tabs } from "expo-router";
import React from "react";
import {Ionicons} from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{ headerShown: true }}>
            <Tabs.Screen name="index" options={{ title: "Heute" ,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="calendar-outline" size={size} color={color} />
                ), }} />
            <Tabs.Screen name="tasks" options={{ title: "Tasks",
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="list-outline" size={size} color={color} />
                ), }} />
            <Tabs.Screen name="settings" options={{ title: "Settings" ,
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="settings-outline" size={size} color={color} />
                ),}} />

            {/* versteckt */}
            <Tabs.Screen name="create" options={{ href: null, title: "Neuer Task" }} />
            <Tabs.Screen name="session" options={{ href: null, title: "Session" }} />
            <Tabs.Screen name="login" options={{ href: null, title: "Login" }} />
            <Tabs.Screen name="register" options={{ href: null, title: "Register" }} />
        </Tabs>
    );
}
