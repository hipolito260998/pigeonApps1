import { ArbolGenealogicoPaloma } from "@/components/ArbolGenealogicoPaloma";
import { palomaService } from "@/services/palomaService";
import { useAuthStore } from "@/store/authStore";
import { usePalomaStore } from "@/store/palomaStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DetailsPalomaScreen() {
  const params = useLocalSearchParams();
  const palomaId = typeof params.id === "string" ? params.id : "";
  const { palomas, setPalomaSeleccionada } = usePalomaStore();
  const { user } = useAuthStore();
  const [modalVacuna, setModalVacuna] = useState(false);
  const [nombreVacuna, setNombreVacuna] = useState("");
  const [fechaVacuna, setFechaVacuna] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalFotoVisible, setModalFotoVisible] = useState(false);
  const [fotoSeleccionada, setFotoSeleccionada] = useState<string | null>(null);
  const screenWidth = Dimensions.get("window").width;

  const paloma = palomas.find((p) => p.id === palomaId);

  useEffect(() => {
    if (paloma) {
      setPalomaSeleccionada(paloma);
    }
  }, [paloma, setPalomaSeleccionada]);

  const agregarVacuna = async () => {
    if (!nombreVacuna.trim() || !paloma) return;
    if (!user?.uid) return;

    try {
      const nuevaVacuna = {
        id: Date.now().toString(),
        nombre: nombreVacuna,
        fecha: fechaVacuna.toISOString() as unknown as Date,
      };
      const vacunasActualizadas = [...(paloma.vacunas || []), nuevaVacuna];
      await palomaService.actualizarPaloma(user.uid, {
        ...paloma,
        vacunas: vacunasActualizadas,
      });
      setModalVacuna(false);
      setNombreVacuna("");
      setFechaVacuna(new Date());
    } catch (error) {
      console.error(error);
    }
  };

  if (!paloma) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-red-600 text-lg">Paloma no encontrada</Text>
      </View>
    );
  }

  const fotosArray =
    paloma.fotos && paloma.fotos.length > 0
      ? paloma.fotos
      : paloma.foto
        ? [paloma.foto]
        : [];

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-4 bg-white border-b border-gray-200 flex-row justify-between items-center">
        <View>
          <Text className="text-2xl font-bold text-gray-800">
            {paloma.nombre}
          </Text>
          <Text className="text-sm text-gray-600">Anillo: {paloma.anillo}</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/paloma/editar/${paloma.id}` as any)}
          className="bg-primary px-3 py-2 rounded-lg"
        >
          <Text className="text-white text-xs font-semibold">Editar</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <ScrollView className="flex-1">
        {/* Foto de la Paloma */}
        {fotosArray.length > 0 ? (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              className="h-64 bg-black"
            >
              {fotosArray.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.9}
                  onPress={() => {
                    setFotoSeleccionada(url);
                    setModalFotoVisible(true);
                  }}
                  style={{ width: screenWidth, height: 256 }}
                >
                  <Image
                    source={{ uri: url }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            {fotosArray.length > 1 && (
              <Text className="absolute bottom-2 right-2 text-white bg-black/50 px-2 py-1 rounded-md text-xs font-bold">
                Desliza para ver más ({fotosArray.length})
              </Text>
            )}
          </View>
        ) : (
          <View className="w-full h-48 bg-gray-200 justify-center items-center">
            <Text className="text-6xl mb-2">🐦</Text>
            <Text className="text-gray-500 font-medium">
              Sin foto registrada
            </Text>
          </View>
        )}

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
        <View className="bg-white m-4 p-4 rounded-lg border border-gray-200">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-bold text-gray-800">
              💉 Vacunas ({paloma.vacunas?.length || 0})
            </Text>
            <TouchableOpacity
              onPress={() => setModalVacuna(true)}
              className="bg-blue-100 px-3 py-1 rounded-full"
            >
              <Text className="text-blue-700 text-xs font-bold">+ Añadir</Text>
            </TouchableOpacity>
          </View>

          {paloma.vacunas && paloma.vacunas.length > 0 ? (
            paloma.vacunas.map((vacuna) => (
              <View key={vacuna.id} className="py-2 border-b border-gray-200">
                <Text className="font-semibold text-gray-800">
                  {vacuna.nombre}
                </Text>
                <Text className="text-sm text-gray-600">
                  {new Date(vacuna.fecha).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 italic">
              No hay vacunas registradas
            </Text>
          )}
        </View>

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

      {/* Modal para Nueva Vacuna */}
      <Modal visible={modalVacuna} animationType="fade" transparent={true}>
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="bg-white w-11/12 rounded-xl p-5">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              💉 Registrar Vacuna
            </Text>
            <TextInput
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="Nombre de la vacuna (Ej: Newcastle)"
              value={nombreVacuna}
              onChangeText={setNombreVacuna}
              autoFocus
            />

            <View className="mb-5">
              <Text className="text-sm font-semibold text-gray-700 mb-1">
                Fecha de Aplicación
              </Text>
              {Platform.OS === "ios" ? (
                <View className="items-baseline">
                  <DateTimePicker
                    value={fechaVacuna}
                    mode="date"
                    display="default"
                    onValueChange={(event: any, selectedDate?: Date) => {
                      if (selectedDate) setFechaVacuna(selectedDate);
                    }}
                  />
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-300"
                  >
                    <Text className="text-gray-700">
                      {fechaVacuna.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={fechaVacuna}
                      mode="date"
                      display="default"
                      onValueChange={(event: any, selectedDate?: Date) => {
                        if (selectedDate) setFechaVacuna(selectedDate);
                        setShowDatePicker(false);
                      }}
                      onDismiss={() => setShowDatePicker(false)}
                    />
                  )}
                </>
              )}
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setModalVacuna(false);
                  setNombreVacuna("");
                  setFechaVacuna(new Date());
                }}
                className="flex-1 bg-gray-200 py-3 rounded-lg"
              >
                <Text className="text-center font-semibold text-gray-700">
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={agregarVacuna}
                className="flex-1 bg-primary py-3 rounded-lg"
              >
                <Text className="text-center font-semibold text-white">
                  Guardar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para ver Foto en Pantalla Completa */}
      <Modal
        visible={modalFotoVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setModalFotoVisible(false)}
      >
        <View className="flex-1 bg-black justify-center items-center">
          <TouchableOpacity
            onPress={() => setModalFotoVisible(false)}
            className="absolute top-12 right-4 z-10 bg-white/20 px-4 py-2 rounded-full"
          >
            <Text className="text-white font-bold">✕ Cerrar</Text>
          </TouchableOpacity>

          {fotoSeleccionada && (
            <Image
              source={{ uri: fotoSeleccionada }}
              className="w-full h-full"
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </View>
  );
}
