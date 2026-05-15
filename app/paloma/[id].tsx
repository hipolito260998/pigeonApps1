import { ArbolGenealogicoPaloma } from "@/components/ArbolGenealogicoPaloma";
import { usePalomaStore } from "@/store/palomaStore";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DetailsPalomaScreen() {
  const params = useLocalSearchParams();
  const palomaId = typeof params.id === "string" ? params.id : "";
  const { palomas, setPalomaSeleccionada } = usePalomaStore();

  const paloma = palomas.find((p) => p.id === palomaId);

  useEffect(() => {
    if (paloma) {
      setPalomaSeleccionada(paloma);
    }
  }, [paloma, setPalomaSeleccionada]);

  if (!paloma) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-red-600 text-lg">Paloma no encontrada</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-gray-800">
            {paloma.nombre}
          </Text>
          <Text className="text-sm text-gray-600">Anillo: {paloma.anillo}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/paloma/nueva")}
          className="bg-primary px-3 py-2 rounded-lg"
        >
          <Text className="text-white text-xs font-semibold">Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView className="flex-1">
        {/* Información Básica */}
        <View className="bg-white m-4 p-4 rounded-lg border border-gray-200">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            ℹ️ Información
          </Text>

          <View className="flex-row justify-between py-2 border-b border-gray-200">
            <Text className="text-gray-600">Raza:</Text>
            <Text className="font-semibold text-gray-800">{paloma.raza}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-gray-200">
            <Text className="text-gray-600">Sexo:</Text>
            <Text className="font-semibold text-gray-800">
              {paloma.sexo === "macho" ? "🐦 Macho" : "🐦 Hembra"}
            </Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-gray-200">
            <Text className="text-gray-600">Color:</Text>
            <Text className="font-semibold text-gray-800">{paloma.color}</Text>
          </View>

          <View className="flex-row justify-between py-2 border-b border-gray-200">
            <Text className="text-gray-600">Nacimiento:</Text>
            <Text className="font-semibold text-gray-800">
              {paloma.fechaNacimiento.toLocaleDateString()}
            </Text>
          </View>

          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Estado:</Text>
            <Text className="font-semibold text-gray-800">{paloma.estado}</Text>
          </View>
        </View>

        {/* Vacunas */}
        {paloma.vacunas.length > 0 && (
          <View className="bg-white m-4 p-4 rounded-lg border border-gray-200">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              💉 Vacunas ({paloma.vacunas.length})
            </Text>
            {paloma.vacunas.map((vacuna) => (
              <View key={vacuna.id} className="py-2 border-b border-gray-200">
                <Text className="font-semibold text-gray-800">
                  {vacuna.nombre}
                </Text>
                <Text className="text-sm text-gray-600">
                  {new Date(vacuna.fecha).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Notas */}
        {paloma.notas && (
          <View className="bg-white m-4 p-4 rounded-lg border border-gray-200">
            <Text className="text-lg font-bold text-gray-800 mb-2">
              📝 Notas
            </Text>
            <Text className="text-gray-700">{paloma.notas}</Text>
          </View>
        )}

        {/* Árbol Genealógico */}
        <View className="m-4">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            🌳 Árbol Genealógico
          </Text>
          <ArbolGenealogicoPaloma palomaId={palomaId} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
