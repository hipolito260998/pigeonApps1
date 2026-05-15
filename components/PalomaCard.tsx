import { Paloma } from "@/types";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface PalomaCardProps {
  paloma: Paloma;
  onPress: (paloma: Paloma) => void;
}

export const PalomaCard: React.FC<PalomaCardProps> = ({ paloma, onPress }) => {
  const edad = Math.floor(
    (new Date().getTime() - paloma.fechaNacimiento.getTime()) /
      (365 * 24 * 60 * 60 * 1000),
  );

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "activa":
        return "bg-green-100 text-green-700";
      case "vendida":
        return "bg-blue-100 text-blue-700";
      case "fallecida":
        return "bg-red-100 text-red-700";
      case "retirada":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(paloma)}
      className="bg-white rounded-lg p-4 mb-4 border border-gray-200 shadow-sm"
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-800">
            {paloma.nombre}
          </Text>
          <Text className="text-sm text-gray-600">Anillo: {paloma.anillo}</Text>
          <Text className="text-sm text-gray-600">Raza: {paloma.raza}</Text>
          <Text className="text-sm text-gray-600">
            Sexo: {paloma.sexo === "macho" ? "🐦 Macho" : "🐦 Hembra"}
          </Text>
          <Text className="text-sm text-gray-600">Edad: {edad} años</Text>
        </View>

        <View
          className={`px-3 py-1 rounded-full ${getEstadoColor(paloma.estado)}`}
        >
          <Text className="text-xs font-semibold">{paloma.estado}</Text>
        </View>
      </View>

      <View className="mt-3 pt-3 border-t border-gray-200">
        <Text className="text-xs text-gray-500">Color: {paloma.color}</Text>
        {paloma.vacunas && paloma.vacunas.length > 0 && (
          <Text className="text-xs text-green-600 mt-1">
            💉 {paloma.vacunas.length} vacunas
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
