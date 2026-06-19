import { useAuthStore } from "@/store/authStore";
import { usePalomaStore } from "@/store/palomaStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View, TextInput, ActivityIndicator, Image, Platform, Modal } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "@/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function PerfilScreen() {
  const { user, cerrarSesion, actualizarPerfil } = useAuthStore();
  const { palomas } = usePalomaStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editNombre, setEditNombre] = useState(user?.displayName || "");
  const [isUploading, setIsUploading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const confirmLogout = () => {
    setShowLogoutModal(false);
    
    // Esperar a que la animación del modal termine (unos 300ms) antes de desmontar las pantallas
    setTimeout(async () => {
      try {
        await cerrarSesion();
        router.replace("/auth/login");
      } catch (error) {
        console.error("Error detallado al cerrar sesión:", error);
        Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo cerrar sesión' });
      }
    }, 300);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const palomasActivas = palomas.filter((p) => p.estado === "activa").length;

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo seleccionar la imagen' });
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    if (!user) return;
    setIsUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const fileRef = ref(storage, `profiles/${user.uid}/avatar.jpg`);
      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);
      
      await actualizarPerfil(undefined, downloadURL);
      Toast.show({ type: 'success', text1: 'Éxito', text2: 'Foto de perfil actualizada' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Hubo un problema al subir la foto' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editNombre.trim()) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'El nombre no puede estar vacío' });
      return;
    }
    
    setIsUploading(true);
    try {
      await actualizarPerfil(editNombre.trim(), undefined);
      setIsEditing(false);
      Toast.show({ type: 'success', text1: 'Éxito', text2: 'Perfil actualizado correctamente' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo actualizar el perfil' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 pt-6">
        <Text className="text-3xl font-extrabold text-gray-800 mb-6">
          Mi Perfil
        </Text>

        {/* Tarjeta de Usuario */}
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 items-center mb-6">
          <TouchableOpacity onPress={handlePickImage} disabled={isUploading}>
            {user?.photoURL ? (
              <Image 
                source={{ uri: user.photoURL }} 
                className="w-24 h-24 rounded-full mb-4 bg-gray-200"
              />
            ) : (
              <View className="bg-blue-100 w-24 h-24 rounded-full justify-center items-center mb-4">
                <FontAwesome name="user" size={40} color="#3b82f6" />
              </View>
            )}
            {isUploading && (
              <View className="absolute inset-0 bg-white/50 justify-center items-center rounded-full">
                <ActivityIndicator size="small" color="#3b82f6" />
              </View>
            )}
            <View className="absolute bottom-4 right-0 bg-primary w-8 h-8 rounded-full justify-center items-center border-2 border-white">
              <FontAwesome name="camera" size={12} color="white" />
            </View>
          </TouchableOpacity>

          {isEditing ? (
            <View className="w-full flex-row items-center mt-2">
              <TextInput
                className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-gray-800"
                value={editNombre}
                onChangeText={setEditNombre}
                placeholder="Tu Nombre"
                autoCapitalize="words"
              />
              <TouchableOpacity 
                onPress={handleSaveProfile}
                disabled={isUploading}
                className="bg-green-500 px-4 py-3 rounded-lg ml-2"
              >
                <FontAwesome name="check" size={16} color="white" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  setEditNombre(user?.displayName || "");
                  setIsEditing(false);
                }}
                disabled={isUploading}
                className="bg-gray-300 px-4 py-3 rounded-lg ml-2"
              >
                <FontAwesome name="times" size={16} color="gray" />
              </TouchableOpacity>
            </View>
          ) : (
            <View className="items-center">
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-gray-800 mr-2">
                  {user?.displayName || "Criador"}
                </Text>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <FontAwesome name="pencil" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              <Text className="text-gray-500 mt-1">{user?.email}</Text>
            </View>
          )}
        </View>

        {/* Estadísticas Rápidas */}
        <Text className="text-lg font-bold text-gray-800 mb-3 px-2">
          Estadísticas
        </Text>
        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 items-center shadow-sm">
            <Text className="text-3xl font-extrabold text-blue-600">
              {palomas.length}
            </Text>
            <Text className="text-gray-500 font-medium mt-1 text-center">
              Palomas en total
            </Text>
          </View>
          <View className="flex-1 bg-white p-5 rounded-2xl border border-gray-100 items-center shadow-sm">
            <Text className="text-3xl font-extrabold text-green-500">
              {palomasActivas}
            </Text>
            <Text className="text-gray-500 font-medium mt-1 text-center">
              Palomas Activas
            </Text>
          </View>
        </View>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-50 border border-red-200 py-4 rounded-xl flex-row justify-center items-center mb-10"
        >
          <FontAwesome name="sign-out" size={20} color="#dc2626" />
          <Text className="text-red-600 font-bold ml-2 text-lg">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Personalizado de Cerrar Sesión */}
      <Modal
        transparent={true}
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-4">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-lg items-center">
            <View className="bg-red-100 w-16 h-16 rounded-full justify-center items-center mb-4">
              <FontAwesome name="sign-out" size={28} color="#dc2626" />
            </View>
            <Text className="text-xl font-bold text-gray-800 mb-2">
              Cerrar Sesión
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              ¿Estás seguro que deseas cerrar tu sesión actual? Tendrás que volver a ingresar tu correo y contraseña.
            </Text>
            
            <View className="flex-row w-full gap-3">
              <TouchableOpacity
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-100 py-3 rounded-xl border border-gray-200"
              >
                <Text className="text-center font-bold text-gray-700">
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={confirmLogout}
                className="flex-1 bg-red-600 py-3 rounded-xl"
              >
                <Text className="text-center font-bold text-white">
                  Sí, salir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
