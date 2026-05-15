import { usePalomaStore } from "@/store/palomaStore";
import { Paloma } from "@/types";
import { router } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ArbolGenealogicoPalomaProps {
  palomaId: string;
}

export const ArbolGenealogicoPaloma: React.FC<ArbolGenealogicoPalomaProps> = ({
  palomaId,
}) => {
  const { palomas } = usePalomaStore();

  const paloma = palomas.find((p) => p.id === palomaId);
  const padre = paloma?.padreId
    ? palomas.find((p) => p.id === paloma.padreId)
    : null;
  const madre = paloma?.madreId
    ? palomas.find((p) => p.id === paloma.madreId)
    : null;
  const hijos = palomas.filter(
    (p) => p.padreId === palomaId || p.madreId === palomaId,
  );

  const handlePalomaPress = (id: string) => {
    router.push({
      pathname: "/paloma/[id]",
      params: { id },
    });
  };

  const PalomaNode: React.FC<{
    paloma: Paloma;
    nivel: "abuelo" | "padre" | "actual" | "hijo";
  }> = ({ paloma, nivel }) => {
    const getSizeClasses = (nivel: string) => {
      switch (nivel) {
        case "abuelo":
          return "px-2 py-1 text-xs";
        case "padre":
          return "px-3 py-2 text-sm";
        case "actual":
          return "px-4 py-3 text-base";
        case "hijo":
          return "px-3 py-2 text-sm";
        default:
          return "px-3 py-2";
      }
    };

    const bgColor = paloma.sexo === "macho" ? "bg-blue-100" : "bg-pink-100";

    return (
      <TouchableOpacity
        onPress={() => handlePalomaPress(paloma.id)}
        className={`${bgColor} rounded-lg border-2 border-gray-300 ${getSizeClasses(nivel)} mb-3`}
      >
        <Text className="font-bold text-gray-800">{paloma.nombre}</Text>
        <Text className="text-xs text-gray-600">Anillo: {paloma.anillo}</Text>
        <Text className="text-xs text-gray-600">{paloma.raza}</Text>
      </TouchableOpacity>
    );
  };

  if (!paloma) {
    return <Text className="text-red-600">Paloma no encontrada</Text>;
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Abuelos */}
      {(padre || madre) && (
        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-600 mb-3">
            👴👵 Abuelos
          </Text>
          <View className="flex-row justify-around">
            {padre?.padreId && palomas.find((p) => p.id === padre.padreId) && (
              <View className="flex-1 mr-2">
                <PalomaNode
                  paloma={palomas.find((p) => p.id === padre.padreId)!}
                  nivel="abuelo"
                />
              </View>
            )}
            {madre?.padreId && palomas.find((p) => p.id === madre.padreId) && (
              <View className="flex-1 ml-2">
                <PalomaNode
                  paloma={palomas.find((p) => p.id === madre.padreId)!}
                  nivel="abuelo"
                />
              </View>
            )}
          </View>
        </View>
      )}

      {/* Padres */}
      {(padre || madre) && (
        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-600 mb-3">
            👨👩 Padres
          </Text>
          <View className="flex-row justify-around">
            {padre && (
              <View className="flex-1 mr-2">
                <PalomaNode paloma={padre} nivel="padre" />
              </View>
            )}
            {madre && (
              <View className="flex-1 ml-2">
                <PalomaNode paloma={madre} nivel="padre" />
              </View>
            )}
          </View>
        </View>
      )}

      {/* Paloma Actual */}
      <View className="mb-6 bg-white p-4 rounded-lg border-4 border-primary">
        <PalomaNode paloma={paloma} nivel="actual" />
      </View>

      {/* Hijos */}
      {hijos.length > 0 && (
        <View>
          <Text className="text-sm font-bold text-gray-600 mb-3">
            👶 Hijos ({hijos.length})
          </Text>
          {hijos.map((hijo) => (
            <View key={hijo.id} className="mb-2">
              <PalomaNode paloma={hijo} nivel="hijo" />
            </View>
          ))}
        </View>
      )}

      {!padre && !madre && hijos.length === 0 && (
        <View className="mt-6 p-4 bg-blue-50 rounded-lg">
          <Text className="text-sm text-blue-600 text-center">
            Esta paloma no tiene relaciones genealógicas registradas aún.
          </Text>
        </View>
      )}
    </ScrollView>
  );
};
