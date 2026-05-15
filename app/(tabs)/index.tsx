import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-blue-50 to-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View className="bg-primary p-6 pb-12">
          <Text className="text-4xl font-bold text-red-500 mb-2">
            🐦 Pigeon Apps
          </Text>
          <Text className="text-blue-100">Gestor inteligente de palomas</Text>
        </View>

        {/* Welcome Card */}
        <View className="px-4 mt-6">
          <View className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-6">
            <Text className="text-2xl font-bold text-gray-800 mb-3">
              ¡Bienvenido!
            </Text>
            <Text className="text-gray-600 mb-4">
              Aquí puedes registrar todas tus palomas, ver su árbol genealógico
              y gestionar sus vacunas.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/palomas")}
              className="bg-primary px-6 py-3 rounded-lg"
            >
              <Text className="text-white font-bold text-center">
                Ir a Mis Palomas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
