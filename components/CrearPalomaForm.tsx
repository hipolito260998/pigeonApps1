import { palomaService } from "@/services/palomaService";
import { usePalomaStore } from "@/store/palomaStore";
import { Paloma } from "@/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CrearPalomaFormProps {
  padreId?: string;
  madreId?: string;
  palomaAEditar?: Paloma;
}

export const CrearPalomaForm: React.FC<CrearPalomaFormProps> = ({
  padreId,
  madreId,
  palomaAEditar,
}) => {
  const [nombre, setNombre] = useState(palomaAEditar?.nombre || "");
  const [anillo, setAnillo] = useState(palomaAEditar?.anillo || "");
  const [raza, setRaza] = useState(palomaAEditar?.raza || "");
  const [sexo, setSexo] = useState<"macho" | "hembra">(
    palomaAEditar?.sexo || "macho",
  );
  const [color, setColor] = useState(palomaAEditar?.color || "");
  const [fechaNacimiento, setFechaNacimiento] = useState(
    palomaAEditar?.fechaNacimiento || new Date(),
  );
  const [notas, setNotas] = useState(palomaAEditar?.notas || "");
  const [padreSeleccionado, setPadreSeleccionado] = useState<
    string | undefined
  >(palomaAEditar?.padreId || padreId);
  const [madreSeleccionada, setMadreSeleccionada] = useState<
    string | undefined
  >(palomaAEditar?.madreId || madreId);
  const [cargando, setCargando] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalPadresVisible, setModalPadresVisible] = useState(false);
  const [tipoPadre, setTipoPadre] = useState<"padre" | "madre">("padre");

  const { palomas } = usePalomaStore();

  const machos = palomas.filter(
    (p) => p.sexo === "macho" && p.id !== palomaAEditar?.id,
  );
  const hembras = palomas.filter(
    (p) => p.sexo === "hembra" && p.id !== palomaAEditar?.id,
  );

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
      if (palomaAEditar) {
        const palomaActualizada: any = {
          ...palomaAEditar,
          nombre,
          anillo,
          raza,
          sexo,
          color,
          fechaNacimiento,
          notas,
          updatedAt: new Date(),
        };

        if (padreSeleccionado) palomaActualizada.padreId = padreSeleccionado;
        else palomaActualizada.padreId = null; // null le dice a Firebase que borre este campo

        if (madreSeleccionada) palomaActualizada.madreId = madreSeleccionada;
        else palomaActualizada.madreId = null;

        await palomaService.actualizarPaloma("test-user", palomaActualizada);
        Alert.alert("Éxito", "Paloma actualizada correctamente");
      } else {
        const nuevaPaloma: Omit<Paloma, "id"> = {
          nombre,
          anillo,
          raza,
          sexo,
          color,
          fechaNacimiento,
          notas,
          vacunas: [],
          estado: "activa",
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        if (padreSeleccionado) nuevaPaloma.padreId = padreSeleccionado;
        if (madreSeleccionada) nuevaPaloma.madreId = madreSeleccionada;

        await palomaService.crearPaloma("test-user", nuevaPaloma);
        Alert.alert("Éxito", "Paloma registrada correctamente");
      }

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
            onValueChange={(event: any, selectedDate?: Date) => {
              if (selectedDate) {
                setFechaNacimiento(selectedDate);
              }
              setShowDatePicker(false);
            }}
            onDismiss={() => setShowDatePicker(false)}
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

      {/* Selector de Padre */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Padre</Text>
        <TouchableOpacity
          onPress={() => {
            setTipoPadre("padre");
            setModalPadresVisible(true);
          }}
          className="bg-white px-4 py-3 rounded-lg border border-gray-300"
        >
          <Text
            className={padreSeleccionado ? "text-gray-800" : "text-gray-400"}
          >
            {padreSeleccionado
              ? palomas.find((p) => p.id === padreSeleccionado)?.nombre
              : "Seleccionar padre (opcional)"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Selector de Madre */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Madre</Text>
        <TouchableOpacity
          onPress={() => {
            setTipoPadre("madre");
            setModalPadresVisible(true);
          }}
          className="bg-white px-4 py-3 rounded-lg border border-gray-300"
        >
          <Text
            className={madreSeleccionada ? "text-gray-800" : "text-gray-400"}
          >
            {madreSeleccionada
              ? palomas.find((p) => p.id === madreSeleccionada)?.nombre
              : "Seleccionar madre (opcional)"}
          </Text>
        </TouchableOpacity>
      </View>

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

      {/* Modal para seleccionar padres */}
      <Modal
        visible={modalPadresVisible}
        animationType="slide"
        transparent={true}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View className="bg-white rounded-t-2xl max-h-[80%]">
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-lg font-bold">Seleccionar {tipoPadre}</Text>
              <TouchableOpacity onPress={() => setModalPadresVisible(false)}>
                <Text className="text-red-500 font-semibold">Cerrar</Text>
              </TouchableOpacity>
            </View>
            <ScrollView className="p-4">
              <TouchableOpacity
                onPress={() => {
                  tipoPadre === "padre"
                    ? setPadreSeleccionado(undefined)
                    : setMadreSeleccionada(undefined);
                  setModalPadresVisible(false);
                }}
                className="py-3 border-b border-gray-100"
              >
                <Text className="text-gray-500 italic">
                  Ninguno / Quitar relación
                </Text>
              </TouchableOpacity>
              {(tipoPadre === "padre" ? machos : hembras).map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => {
                    tipoPadre === "padre"
                      ? setPadreSeleccionado(p.id)
                      : setMadreSeleccionada(p.id);
                    setModalPadresVisible(false);
                  }}
                  className="py-3 border-b border-gray-100"
                >
                  <Text className="font-semibold text-gray-800">
                    {p.nombre} (Anillo: {p.anillo})
                  </Text>
                </TouchableOpacity>
              ))}
              <View className="h-20" />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
