import { CrearPalomaForm } from "@/components/CrearPalomaForm";
import { usePalomaStore } from "@/store/palomaStore";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditarPalomaScreen() {
  const params = useLocalSearchParams();
  const palomaId = typeof params.id === "string" ? params.id : "";
  const { palomas } = usePalomaStore();

  const paloma = palomas.find((p) => p.id === palomaId);

  if (!paloma) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          ✏️ Editar Paloma
        </Text>
      </View>
      <CrearPalomaForm palomaAEditar={paloma} />
    </SafeAreaView>
  );
}
