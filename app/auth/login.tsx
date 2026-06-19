import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const { iniciarSesion, registrarse, cargando, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa email y contraseña'
      });
      return;
    }

    try {
      if (isRegister) {
        if (!nombre) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Por favor ingresa tu nombre completo'
          });
          return;
        }
        await registrarse(email, password, nombre);
        Toast.show({
          type: 'success',
          text1: 'Éxito',
          text2: 'Cuenta creada correctamente'
        });
        setIsRegister(false);
      } else {
        await iniciarSesion(email, password);
        router.replace("/(tabs)/index");
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: useAuthStore.getState().error || "Ocurrió un error al autenticar"
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        className="px-4 py-10"
      >
        {/* Logo */}
        <View className="mb-10 items-center">
          <View className="bg-blue-50 p-5 rounded-full mb-4">
            <Text className="text-6xl">🐦</Text>
          </View>
          <Text className="text-4xl font-extrabold text-gray-800 tracking-tight text-center">
            Pigeon Apps
          </Text>
          <Text className="text-gray-500 mt-2 text-center text-base font-medium">
            Gestor inteligente para tu criadero
          </Text>
        </View>

        {/* Contenedor Principal superpuesto (Card) */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          {/* Título */}
          <Text className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
          </Text>

          {/* Nombre (solo registro) */}
          {isRegister && (
            <View className="mb-4">
              <Text className="text-sm font-semibold text-gray-700 mb-1">
                Nombre Completo
              </Text>
              <TextInput
                className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-800"
                placeholder="Ej: Juan Pérez"
                value={nombre}
                onChangeText={setNombre}
                autoCapitalize="words"
                editable={!cargando}
                placeholderTextColor="#9CA3AF"
              />
            </View>
          )}

          {/* Email */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Correo Electrónico
            </Text>
            <TextInput
              className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-800"
              placeholder="Ej: usuario@correo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!cargando}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Password */}
          <View className="mb-6">
            <Text className="text-sm font-semibold text-gray-700 mb-1">
              Contraseña
            </Text>
            <TextInput
              className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 text-gray-800"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!cargando}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={cargando}
            className="bg-primary py-4 rounded-xl mb-4 flex-row justify-center shadow-sm"
          >
            {cargando ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-center font-bold text-white text-lg">
                {isRegister ? "Crear Cuenta" : "Iniciar Sesión"}
              </Text>
            )}
          </TouchableOpacity>

          {/* Toggle Register/Login */}
          <TouchableOpacity
            onPress={() => setIsRegister(!isRegister)}
            disabled={cargando}
            className="py-2"
          >
            <Text className="text-center text-gray-600 text-sm">
              {isRegister ? "¿Ya tienes cuenta? " : "¿No tienes cuenta? "}
              <Text className="font-bold text-primary">
                {isRegister ? "Inicia Sesión" : "Regístrate"}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
