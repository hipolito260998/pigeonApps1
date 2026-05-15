import { PalomaLista } from "@/components/PalomaLista";
import { palomaService } from "@/services/palomaService";
import { usePalomaStore } from "@/store/palomaStore";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PalomasScreen() {
  const { palomas, setPalomas } = usePalomaStore();

  useEffect(() => {
    // Usamos el ID temporal "test-user" para descargar las palomas
    const unsubscribe = palomaService.escucharPalomas(
      "test-user",
      (datosFirebase) => {
        setPalomas(datosFirebase);
      },
    );

    // Limpiamos la conexión a Firebase cuando se cierra la pantalla
    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-2xl font-bold text-gray-800">
            🐦 Mis Palomas
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/paloma/nueva")}
            className="bg-primary px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold text-sm">+ Nueva</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3">
          <View className="flex-1 bg-blue-50 p-2 rounded-lg">
            <Text className="text-xs text-blue-600">Total</Text>
            <Text className="text-lg font-bold text-blue-700">
              {palomas.length}
            </Text>
          </View>
          <View className="flex-1 bg-pink-50 p-2 rounded-lg">
            <Text className="text-xs text-pink-600">Hembras</Text>
            <Text className="text-lg font-bold text-pink-700">
              {palomas.filter((p) => p.sexo === "hembra").length}
            </Text>
          </View>
          <View className="flex-1 bg-blue-100 p-2 rounded-lg">
            <Text className="text-xs text-blue-600">Machos</Text>
            <Text className="text-lg font-bold text-blue-700">
              {palomas.filter((p) => p.sexo === "macho").length}
            </Text>
          </View>
        </View>
      </View>

      {/* Lista de Palomas */}
      <PalomaLista filtro="todas" />
    </SafeAreaView>
  );
}
