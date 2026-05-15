import { CrearPalomaForm } from "@/components/CrearPalomaForm";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";

export default function NuevaPalomaScreen() {
  const params = useLocalSearchParams();
  const padreId =
    typeof params.padreId === "string" ? params.padreId : undefined;
  const madreId =
    typeof params.madreId === "string" ? params.madreId : undefined;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-800">
          + Registrar Paloma
        </Text>
      </View>
      <CrearPalomaForm padreId={padreId} madreId={madreId} />
    </SafeAreaView>
  );
}
