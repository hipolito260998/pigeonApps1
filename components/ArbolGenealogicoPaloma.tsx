import { usePalomaStore } from "@/store/palomaStore";
import { Paloma } from "@/types";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";

interface ArbolGenealogicoPalomaProps {
  palomaId: string;
}

export const ArbolGenealogicoPaloma: React.FC<ArbolGenealogicoPalomaProps> = ({
  palomaId,
}) => {
  const obtenerArbolGenealogico = usePalomaStore((state) => state.obtenerArbolGenealogico);

  const arbol = useMemo(() => obtenerArbolGenealogico(palomaId), [obtenerArbolGenealogico, palomaId]);

  const handlePalomaPress = (id: string) => {
    router.push({
      pathname: "/paloma/[id]",
      params: { id },
    });
  };

  const PalomaNode: React.FC<{
    paloma: Paloma;
    nivel: "abuelo" | "padre" | "actual" | "hijo";
    delay?: number;
  }> = ({ paloma, nivel, delay = 0 }) => {
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
      <Animated.View entering={FadeInDown.delay(delay).duration(400).springify()}>
        <TouchableOpacity
          onPress={() => handlePalomaPress(paloma.id)}
          className={`${bgColor} rounded-lg border-2 border-gray-300 ${getSizeClasses(nivel)} mb-3`}
        >
          <Text className="font-bold text-gray-800">{paloma.nombre}</Text>
          <Text className="text-xs text-gray-600">Anillo: {paloma.anillo}</Text>
          <Text className="text-xs text-gray-600">{paloma.raza}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (!arbol || !arbol.paloma) {
    return (
      <Animated.Text entering={FadeIn} className="text-red-600 p-4">
        Paloma no encontrada
      </Animated.Text>
    );
  }

  const { paloma, padre, madre, hijos } = arbol;

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {/* Abuelos */}
      {(padre || madre) && (
        <View className="mb-6">
          <Text className="text-sm font-bold text-gray-600 mb-3">
            👴👵 Abuelos
          </Text>
          <View className="flex-row justify-around">
            {padre?.padre && (
              <View className="flex-1 mr-2">
                <PalomaNode
                  paloma={padre.padre.paloma}
                  nivel="abuelo"
                  delay={100}
                />
              </View>
            )}
            {madre?.padre && (
              <View className="flex-1 ml-2">
                <PalomaNode
                  paloma={madre.padre.paloma}
                  nivel="abuelo"
                  delay={200}
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
                <PalomaNode paloma={padre.paloma} nivel="padre" delay={300} />
              </View>
            )}
            {madre && (
              <View className="flex-1 ml-2">
                <PalomaNode paloma={madre.paloma} nivel="padre" delay={400} />
              </View>
            )}
          </View>
        </View>
      )}

      {/* Paloma Actual */}
      <View className="mb-6 bg-white p-4 rounded-lg border-4 border-primary">
        <PalomaNode paloma={paloma} nivel="actual" delay={500} />
      </View>

      {/* Hijos */}
      {hijos.length > 0 && (
        <View>
          <Text className="text-sm font-bold text-gray-600 mb-3">
            👶 Hijos ({hijos.length})
          </Text>
          {hijos.map((hijo, idx) => (
            <View key={hijo.paloma.id} className="mb-2">
              <PalomaNode paloma={hijo.paloma} nivel="hijo" delay={600 + (idx * 100)} />
            </View>
          ))}
        </View>
      )}

      {!padre && !madre && hijos.length === 0 && (
        <Animated.View entering={FadeIn.delay(500)} className="mt-6 p-4 bg-blue-50 rounded-lg">
          <Text className="text-sm text-blue-600 text-center">
            Esta paloma no tiene relaciones genealógicas registradas aún.
          </Text>
        </Animated.View>
      )}
    </ScrollView>
  );
};
