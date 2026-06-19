import { useAuthStore } from "@/store/authStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { router } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user } = useAuthStore();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header */}
        <View
          className="bg-primary px-6 pb-16 rounded-b-3xl shadow-md"
          style={{ paddingTop: insets.top + 20 }}
        >
          <Text className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            🐦 Pigeon Apps
          </Text>
          <Text className="text-blue-100 text-base font-medium">
            Gestor inteligente para tu criadero
          </Text>
        </View>

        {/* Contenedor Principal superpuesto */}
        <View className="px-4 -mt-8">
          {/* Welcome Card */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-50 p-3 rounded-full mr-4">
                <Text className="text-2xl">👋</Text>
              </View>
              <Text className="text-2xl font-bold text-gray-800">
                ¡Bienvenido!
              </Text>
            </View>
            <Text className="text-gray-600 mb-6 leading-relaxed">
              Registra tus palomas, mantén al día sus vacunas y visualiza su
              árbol genealógico de forma fácil y rápida.
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/palomas")}
              className="bg-primary px-6 py-4 rounded-xl shadow-sm flex-row justify-center items-center"
            >
              <Text className="text-white font-bold text-center text-lg">
                🐦 Ver Mis Palomas
              </Text>
            </TouchableOpacity>
          </View>

          {/* Acciones Rápidas */}
          <Text className="text-lg font-bold text-gray-800 mb-3 px-2">
            Acciones Rápidas
          </Text>
          <View className="flex-row gap-4 mb-6">
            <TouchableOpacity
              onPress={() => router.push("/paloma/nueva")}
              className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 items-center shadow-sm"
            >
              <View className="bg-green-50 p-4 rounded-full mb-3">
                <AntDesign name="plus" size={24} color="black" />
              </View>
              <Text className="font-bold text-gray-800 text-center">
                Registrar Paloma
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/perfil")}
              className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 items-center shadow-sm"
            >
              <View className="bg-purple-50 p-4 rounded-full mb-3">
                <FontAwesome6 name="user" size={24} color="black" />
              </View>
              <Text className="font-bold text-gray-800 text-center">
                Mi Perfil
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
