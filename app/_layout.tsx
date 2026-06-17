import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments, useRootNavigationState } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import Toast from "react-native-toast-message";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useAuthStore } from "@/store/authStore";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, verificarUsuario, cargando } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    verificarUsuario();
  }, [verificarUsuario]);



  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerBackTitle: "Atrás", headerShown: false }}>
        {/* Login */}
        <Stack.Screen
          name="auth/login"
          options={{
            headerShown: false,
            animation: "none",
          }}
        />
        {/* Rutas protegidas */}
        <Stack.Screen
          name="(tabs)"
          options={{ title: "Inicio" }}
        />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Modal",
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="paloma/[id]"
          options={{
            title: "Detalles",
            headerShown: true,
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="paloma/nueva"
          options={{
            title: "Nueva Paloma",
            headerShown: true,
            presentation: "card",
          }}
        />
        <Stack.Screen
          name="paloma/editar/[id]"
          options={{
            title: "Editar Paloma",
            headerShown: true,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
