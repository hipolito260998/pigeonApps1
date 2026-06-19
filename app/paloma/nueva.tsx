import { CrearPalomaForm } from "@/components/CrearPalomaForm";
import { router, useLocalSearchParams } from "expo-router";
import { Text, View, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function NuevaPalomaScreen() {
  const params = useLocalSearchParams();
  const padreId =
    typeof params.padreId === "string" ? params.padreId : undefined;
  const madreId =
    typeof params.madreId === "string" ? params.madreId : undefined;

  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 justify-center items-center"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingTop: insets.top > 0 ? insets.top + 10 : 20,
        paddingBottom: insets.bottom > 0 ? insets.bottom + 10 : 20,
      }}
    >
      <View className="bg-white w-11/12 max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex-1">
        <View className="px-6 py-5 border-b border-gray-100 flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-800">
            🕊️ Registrar Paloma
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-100 p-2 rounded-full w-10 h-10 justify-center items-center"
          >
            <Text className="text-gray-500 font-bold text-lg">✕</Text>
          </TouchableOpacity>
        </View>
        <CrearPalomaForm padreId={padreId} madreId={madreId} />
      </View>
    </View>
  );
}
