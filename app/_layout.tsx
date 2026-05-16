import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/authStore";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, verificarUsuario, cargando } = useAuthStore();

  useEffect(() => {
    verificarUsuario();
  }, [verificarUsuario]);

  if (cargando) {
    return null; // O mostrar loading screen
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerBackTitle: "Atrás", headerShown: false }}>
        {user ? (
          [
            // Rutas protegidas - Solo si hay usuario
            <Stack.Screen
              key="tabs"
              name="(tabs)"
              options={{ title: "Inicio" }}
            />,
            <Stack.Screen
              key="modal"
              name="modal"
              options={{
                presentation: "modal",
                title: "Modal",
                headerShown: true,
              }}
            />,
            <Stack.Screen
              key="detalles"
              name="paloma/[id]"
              options={{
                title: "Detalles",
                headerShown: true,
                presentation: "card",
              }}
            />,
            <Stack.Screen
              key="nueva"
              name="paloma/nueva"
              options={{
                title: "Nueva Paloma",
                headerShown: true,
                presentation: "card",
              }}
            />,
            <Stack.Screen
              key="editar"
              name="paloma/editar/[id]"
              options={{
                title: "Editar Paloma",
                headerShown: true,
              }}
            />,
          ]
        ) : (
          // Login - Si no hay usuario
          <Stack.Screen
            name="auth/login"
            options={{
              headerShown: false,
              animation: "none",
            }}
          />
        )}
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
