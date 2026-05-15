import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
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
    </ThemeProvider>
  );
}
