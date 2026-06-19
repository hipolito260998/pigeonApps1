import "../suppress-warnings";
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
import { LogBox } from "react-native";

// Ignorar advertencias inofensivas de deprecación de React Native Web
// generadas por librerías internas como React Navigation
LogBox.ignoreLogs([
  "props.pointerEvents is deprecated",
  '"shadow*" style props are deprecated',
]);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { user, verificarUsuario, cargando } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    verificarUsuario();
  }, [verificarUsuario]);

  // Guardián de Rutas (Protected Routes)
  useEffect(() => {
    if (!rootNavigationState?.key || cargando) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      // Usuario no autenticado intentando entrar a ruta privada -> Al login
      router.replace("/auth/login");
    } else if (user && inAuthGroup) {
      // Usuario autenticado intentando entrar al login -> A inicio
      router.replace("/");
    }
  }, [user, segments, cargando, rootNavigationState?.key]);

  if (cargando) {
    // Evitar renderizar la aplicación si todavía estamos verificando el token
    return null; 
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack
        screenOptions={{
          headerBackTitle: "Atrás",
          headerShown: false,
          headerTintColor: "#0d9488", // Tema Esmeralda
          headerStyle: {
            backgroundColor: "#ffffff", // Fondo blanco
          },
          headerTitleStyle: {
            color: "#1f2937", // Gris oscuro para el texto
            fontWeight: "bold",
          },
          headerShadowVisible: false, // Quitar la linea divisoria fea
        }}
      >
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
            headerShown: false,
            presentation: "transparentModal",
            animation: "fade",
          }}
        />
        <Stack.Screen
          name="paloma/editar/[id]"
          options={{
            headerShown: false,
            presentation: "transparentModal",
            animation: "fade",
          }}
        />
      </Stack>
      <StatusBar style="auto" />
      <Toast />
    </ThemeProvider>
  );
}
