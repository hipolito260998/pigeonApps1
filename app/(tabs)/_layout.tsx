import { Tabs, Redirect } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/authStore";

import { Platform } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { user, cargando } = useAuthStore();

  if (cargando) return null;
  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#0d9488", // Esmeralda Iridiscente para el tab activo
        tabBarInactiveTintColor: "#9CA3AF", // Gris para los inactivos
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#ffffff", // Fondo blanco limpio
          borderTopWidth: 1,
          borderTopColor: "#F3F4F6", // Borde sutil
          paddingBottom: Platform.OS === "ios" ? 25 : 10,
          paddingTop: 10,
          minHeight: Platform.OS === "ios" ? 85 : 70,
          ...Platform.select({
            web: {
              boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.1)" as any,
            },
            default: {
              elevation: 10, // Sombra en Android
              shadowColor: "#000", // Sombra en iOS
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="palomas"
        options={{
          title: "Palomas",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="bird.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
