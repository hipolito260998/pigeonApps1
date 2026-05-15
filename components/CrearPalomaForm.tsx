import { usePalomaStore } from "@/store/palomaStore";
import { Paloma } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";
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

interface CrearPalomaFormProps {
  padreId?: string;
  madreId?: string;
}

export const CrearPalomaForm: React.FC<CrearPalomaFormProps> = ({
  padreId,
  madreId,
}) => {
  const [nombre, setNombre] = useState("");
  const [anillo, setAnillo] = useState("");
  const [raza, setRaza] = useState("");
  const [sexo, setSexo] = useState<"macho" | "hembra">("macho");
  const [color, setColor] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState(new Date());
  const [notas, setNotas] = useState("");
  const [cargando, setCargando] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { agregarPaloma } = usePalomaStore();

  const handleFechaChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }
    if (selectedDate) {
      setFechaNacimiento(selectedDate);
    }
    setShowDatePicker(false);
  };

  const validarFormulario = () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es requerido");
      return false;
    }
    if (!anillo.trim()) {
      Alert.alert("Error", "El anillo es requerido");
      return false;
    }
    if (!raza.trim()) {
      Alert.alert("Error", "La raza es requerida");
      return false;
    }
    if (!color.trim()) {
      Alert.alert("Error", "El color es requerido");
      return false;
    }
    return true;
  };

  const handleGuardar = async () => {
    if (!validarFormulario()) return;

    setCargando(true);
    try {
      const nuevaPaloma: Omit<Paloma, "id"> = {
        nombre,
        anillo,
        raza,
        sexo,
        color,
        fechaNacimiento,
        notas,
        padreId,
        madreId,
        vacunas: [],
        estado: "activa",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      agregarPaloma({ ...nuevaPaloma, id: `temp-${Date.now()}` });
      Alert.alert("Éxito", "Paloma registrada correctamente");
      router.back();
    } catch {
      Alert.alert("Error", "No se pudo registrar la paloma");
    } finally {
      setCargando(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Nombre */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Nombre</Text>
        <TextInput
          className="bg-white px-4 py-3 rounded-lg border border-gray-300"
          placeholder="Ej: Palomita"
          value={nombre}
          onChangeText={setNombre}
          editable={!cargando}
        />
      </View>

      {/* Anillo */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Anillo</Text>
        <TextInput
          className="bg-white px-4 py-3 rounded-lg border border-gray-300"
          placeholder="Ej: 2024-001"
          value={anillo}
          onChangeText={setAnillo}
          editable={!cargando}
        />
      </View>

      {/* Raza */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Raza</Text>
        <TextInput
          className="bg-white px-4 py-3 rounded-lg border border-gray-300"
          placeholder="Ej: Carrier"
          value={raza}
          onChangeText={setRaza}
          editable={!cargando}
        />
      </View>

      {/* Color */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Color</Text>
        <TextInput
          className="bg-white px-4 py-3 rounded-lg border border-gray-300"
          placeholder="Ej: Rojo y blanco"
          value={color}
          onChangeText={setColor}
          editable={!cargando}
        />
      </View>

      {/* Sexo */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Sexo</Text>
        <View className="flex-row bg-white rounded-lg border border-gray-300">
          <TouchableOpacity
            onPress={() => setSexo("macho")}
            className={`flex-1 py-3 px-4 rounded-l-lg border-r border-gray-300 ${
              sexo === "macho" ? "bg-blue-100" : ""
            }`}
            disabled={cargando}
          >
            <Text
              className={`text-center font-semibold ${sexo === "macho" ? "text-blue-700" : "text-gray-700"}`}
            >
              🐦 Macho
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSexo("hembra")}
            className={`flex-1 py-3 px-4 rounded-r-lg ${sexo === "hembra" ? "bg-pink-100" : ""}`}
            disabled={cargando}
          >
            <Text
              className={`text-center font-semibold ${sexo === "hembra" ? "text-pink-700" : "text-gray-700"}`}
            >
              🐦 Hembra
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fecha de Nacimiento */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">
          Fecha de Nacimiento
        </Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          disabled={cargando}
          className="bg-white px-4 py-3 rounded-lg border border-gray-300"
        >
          <Text className="text-gray-700">
            {fechaNacimiento.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={fechaNacimiento}
            mode="date"
            display="default"
            onChange={handleFechaChange}
          />
        )}
      </View>

      {/* Notas */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Notas</Text>
        <TextInput
          className="bg-white px-4 py-3 rounded-lg border border-gray-300 h-24"
          placeholder="Ej: Comportamiento, características especiales..."
          value={notas}
          onChangeText={setNotas}
          multiline
          editable={!cargando}
        />
      </View>

      {/* Info de Padres si existen */}
      {(padreId || madreId) && (
        <View className="mb-4 p-3 bg-blue-50 rounded-lg">
          <Text className="text-sm text-blue-700">
            ℹ️ Paloma registrada como hijo de los padres seleccionados
          </Text>
        </View>
      )}

      {/* Botones */}
      <View className="flex-row gap-3 mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          disabled={cargando}
          className="flex-1 bg-gray-300 py-3 rounded-lg"
        >
          <Text className="text-center font-semibold text-gray-700">
            Cancelar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleGuardar}
          disabled={cargando}
          className="flex-1 bg-primary py-3 rounded-lg flex-row justify-center items-center"
        >
          {cargando ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-center font-semibold text-white">
              Guardar
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
