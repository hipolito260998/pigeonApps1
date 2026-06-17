import { storageService } from "@/services/storageService";
import { palomaService } from "@/services/palomaService";
import { useAuthStore } from "@/store/authStore";
import { usePalomaStore } from "@/store/palomaStore";
import { Paloma } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { z } from "zod";

const palomaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  anillo: z.string().min(1, "El anillo es requerido"),
  raza: z.string().min(1, "La raza es requerida"),
  sexo: z.enum(["macho", "hembra"]),
  color: z.string().min(1, "El color es requerido"),
  fechaNacimiento: z.date(),
  notas: z.string().optional(),
  estado: z.enum(["activa", "vendida", "fallecida", "retirada"]),
});

type PalomaFormData = z.infer<typeof palomaSchema>;

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
  const [fotos, setFotos] = useState<string[]>(
    palomaAEditar?.fotos || (palomaAEditar?.foto ? [palomaAEditar.foto] : []),
  );
  
  const [padreSeleccionado, setPadreSeleccionado] = useState<string | undefined>(
    palomaAEditar?.padreId || padreId,
  );
  const [madreSeleccionada, setMadreSeleccionada] = useState<string | undefined>(
    palomaAEditar?.madreId || madreId,
  );
  
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalPadresVisible, setModalPadresVisible] = useState(false);
  const [tipoPadre, setTipoPadre] = useState<"padre" | "madre">("padre");

  const { palomas } = usePalomaStore();
  const { user } = useAuthStore();

  const machos = palomas.filter((p) => p.sexo === "macho" && p.id !== palomaAEditar?.id);
  const hembras = palomas.filter((p) => p.sexo === "hembra" && p.id !== palomaAEditar?.id);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PalomaFormData>({
    resolver: zodResolver(palomaSchema),
    defaultValues: {
      nombre: palomaAEditar?.nombre || "",
      anillo: palomaAEditar?.anillo || "",
      raza: palomaAEditar?.raza || "",
      sexo: palomaAEditar?.sexo || "macho",
      color: palomaAEditar?.color || "",
      fechaNacimiento: palomaAEditar?.fechaNacimiento ? new Date(palomaAEditar.fechaNacimiento) : new Date(),
      notas: palomaAEditar?.notas || "",
      estado: palomaAEditar?.estado || "activa",
    },
  });

  const seleccionarFotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const nuevasUris = result.assets.map((a) => a.uri);
      setFotos((prev) => [...prev, ...nuevasUris]);
    }
  };

  const eliminarFoto = (index: number) => {
    setFotos((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PalomaFormData) => {
    if (!user?.uid) {
      Toast.show({
        type: "error",
        text1: "Error de sesión",
        text2: "No hay sesión activa.",
      });
      return;
    }

    try {
      const urlsFinales: string[] = [];

      for (let i = 0; i < fotos.length; i++) {
        const uri = fotos[i];
        if (uri.startsWith("http")) {
          urlsFinales.push(uri);
        } else {
          const urlDescarga = await storageService.subirImagen(uri, user.uid, i);
          urlsFinales.push(urlDescarga);
        }
      }

      if (palomaAEditar) {
        const palomaActualizada: any = {
          ...palomaAEditar,
          ...data,
          fotos: urlsFinales.length > 0 ? urlsFinales : null,
          foto: null,
          updatedAt: new Date(),
        };

        palomaActualizada.padreId = padreSeleccionado || null;
        palomaActualizada.madreId = madreSeleccionada || null;

        await palomaService.actualizarPaloma(user.uid, palomaActualizada);

        const fotosAntiguas = palomaAEditar.fotos || (palomaAEditar.foto ? [palomaAEditar.foto] : []);
        const fotosEliminadas = fotosAntiguas.filter((url) => !urlsFinales.includes(url));
        
        for (const url of fotosEliminadas) {
          await storageService.eliminarImagen(url);
        }

        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Paloma actualizada correctamente",
        });
      } else {
        const nuevaPaloma: Omit<Paloma, "id"> = {
          ...data,
          ...(urlsFinales.length > 0 ? { fotos: urlsFinales } : {}),
          vacunas: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        if (padreSeleccionado) nuevaPaloma.padreId = padreSeleccionado;
        if (madreSeleccionada) nuevaPaloma.madreId = madreSeleccionada;

        await palomaService.crearPaloma(user.uid, nuevaPaloma);
        
        Toast.show({
          type: "success",
          text1: "Éxito",
          text2: "Paloma registrada correctamente",
        });
      }

      router.back();
    } catch (error) {
      console.error("Error al guardar:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "No se pudo guardar la paloma",
      });
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4" contentContainerStyle={{ flexGrow: 1 }}>
      {/* Selector de Foto */}
      <View className="mb-6">
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          Fotos de la Paloma ({fotos.length})
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {fotos.map((uri, idx) => (
            <View key={idx} className="mr-3 relative">
              <Image source={{ uri }} className="w-32 h-32 rounded-xl bg-gray-200" resizeMode="cover" />
              <TouchableOpacity
                onPress={() => eliminarFoto(idx)}
                disabled={isSubmitting}
                className="absolute top-1 right-1 bg-red-500 w-8 h-8 rounded-full items-center justify-center shadow"
              >
                <Text className="text-white font-bold">✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={seleccionarFotos}
            disabled={isSubmitting}
            className="w-32 h-32 bg-gray-100 rounded-xl justify-center items-center border-2 border-dashed border-gray-400"
          >
            <Text className="text-3xl mb-1">➕</Text>
            <Text className="text-xs text-gray-500 font-medium">Añadir foto</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Nombre */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Nombre</Text>
        <Controller
          control={control}
          name="nombre"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`bg-white px-4 py-3 rounded-lg border ${errors.nombre ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ej: Palomita"
              value={value}
              onChangeText={onChange}
              editable={!isSubmitting}
            />
          )}
        />
        {errors.nombre && <Text className="text-xs text-red-500 mt-1">{errors.nombre.message}</Text>}
      </View>

      {/* Anillo */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Anillo</Text>
        <Controller
          control={control}
          name="anillo"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`bg-white px-4 py-3 rounded-lg border ${errors.anillo ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ej: 2024-001"
              value={value}
              onChangeText={onChange}
              editable={!isSubmitting}
            />
          )}
        />
        {errors.anillo && <Text className="text-xs text-red-500 mt-1">{errors.anillo.message}</Text>}
      </View>

      {/* Raza */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Raza</Text>
        <Controller
          control={control}
          name="raza"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`bg-white px-4 py-3 rounded-lg border ${errors.raza ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ej: Carrier"
              value={value}
              onChangeText={onChange}
              editable={!isSubmitting}
            />
          )}
        />
        {errors.raza && <Text className="text-xs text-red-500 mt-1">{errors.raza.message}</Text>}
      </View>

      {/* Color */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Color</Text>
        <Controller
          control={control}
          name="color"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className={`bg-white px-4 py-3 rounded-lg border ${errors.color ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Ej: Rojo y blanco"
              value={value}
              onChangeText={onChange}
              editable={!isSubmitting}
            />
          )}
        />
        {errors.color && <Text className="text-xs text-red-500 mt-1">{errors.color.message}</Text>}
      </View>

      {/* Sexo */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Sexo</Text>
        <Controller
          control={control}
          name="sexo"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row bg-white rounded-lg border border-gray-300">
              <TouchableOpacity
                onPress={() => onChange("macho")}
                className={`flex-1 py-3 px-4 rounded-l-lg border-r border-gray-300 ${value === "macho" ? "bg-blue-100" : ""}`}
                disabled={isSubmitting}
              >
                <Text className={`text-center font-semibold ${value === "macho" ? "text-blue-700" : "text-gray-700"}`}>
                  🐦 Macho
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => onChange("hembra")}
                className={`flex-1 py-3 px-4 rounded-r-lg ${value === "hembra" ? "bg-pink-100" : ""}`}
                disabled={isSubmitting}
              >
                <Text className={`text-center font-semibold ${value === "hembra" ? "text-pink-700" : "text-gray-700"}`}>
                  🐦 Hembra
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Fecha de Nacimiento */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Fecha de Nacimiento</Text>
        <Controller
          control={control}
          name="fechaNacimiento"
          render={({ field: { onChange, value } }) => (
            <>
              {Platform.OS === "ios" ? (
                <View className="items-start">
                  <DateTimePicker
                    value={value}
                    mode="date"
                    display="default"
                    onValueChange={(event: any, selectedDate?: Date) => {
                      if (selectedDate) onChange(selectedDate);
                    }}
                  />
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    disabled={isSubmitting}
                    className="bg-white px-4 py-3 rounded-lg border border-gray-300"
                  >
                    <Text className="text-gray-700">{value.toLocaleDateString()}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={value}
                      mode="date"
                      display="default"
                      onValueChange={(event: any, selectedDate?: Date) => {
                        if (selectedDate) onChange(selectedDate);
                        setShowDatePicker(false);
                      }}
                      onDismiss={() => setShowDatePicker(false)}
                    />
                  )}
                </>
              )}
            </>
          )}
        />
      </View>

      {/* Estado */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Estado</Text>
        <Controller
          control={control}
          name="estado"
          render={({ field: { onChange, value } }) => (
            <View className="flex-row flex-wrap gap-2">
              {[
                { val: "activa", label: "✅ Activa" },
                { val: "vendida", label: "💰 Vendida" },
                { val: "fallecida", label: "🪦 Fallecida" },
                { val: "retirada", label: "🏠 Retirada" },
              ].map((opcion) => (
                <TouchableOpacity
                  key={opcion.val}
                  onPress={() => onChange(opcion.val)}
                  disabled={isSubmitting}
                  className={`py-2 px-3 rounded-lg border ${value === opcion.val ? "bg-blue-100 border-blue-400" : "bg-white border-gray-300"}`}
                >
                  <Text className={`font-semibold ${value === opcion.val ? "text-blue-700" : "text-gray-700"}`}>
                    {opcion.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        />
      </View>

      {/* Notas */}
      <View className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-1">Notas</Text>
        <Controller
          control={control}
          name="notas"
          render={({ field: { onChange, value } }) => (
            <TextInput
              className="bg-white px-4 py-3 rounded-lg border border-gray-300 h-24"
              placeholder="Ej: Comportamiento, características especiales..."
              value={value}
              onChangeText={onChange}
              multiline
              editable={!isSubmitting}
            />
          )}
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
          <Text className={padreSeleccionado ? "text-gray-800" : "text-gray-400"}>
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
          <Text className={madreSeleccionada ? "text-gray-800" : "text-gray-400"}>
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
          disabled={isSubmitting}
          className="flex-1 bg-gray-300 py-3 rounded-lg"
        >
          <Text className="text-center font-semibold text-gray-700">Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="flex-1 bg-primary py-3 rounded-lg flex-row justify-center items-center"
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-center font-semibold text-white">Guardar</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal para seleccionar padres */}
      <Modal visible={modalPadresVisible} animationType="slide" transparent={true}>
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
                  tipoPadre === "padre" ? setPadreSeleccionado(undefined) : setMadreSeleccionada(undefined);
                  setModalPadresVisible(false);
                }}
                className="py-3 border-b border-gray-100"
              >
                <Text className="text-gray-500 italic">Ninguno / Quitar relación</Text>
              </TouchableOpacity>
              {(tipoPadre === "padre" ? machos : hembras).map((p) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => {
                    tipoPadre === "padre" ? setPadreSeleccionado(p.id) : setMadreSeleccionada(p.id);
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
