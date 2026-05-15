import { usePalomaStore } from "@/store/palomaStore";
import { Paloma } from "@/types";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    Text,
    View,
} from "react-native";
import { PalomaCard } from "./PalomaCard";

interface PalomaListaProps {
  filtro?: "todas" | "padres" | "madres";
}

export const PalomaLista: React.FC<PalomaListaProps> = ({
  filtro = "todas",
}) => {
  const { palomas, cargando, error } = usePalomaStore();
  const [refreshing, setRefreshing] = useState(false);

  const palomasFilter = React.useMemo(() => {
    switch (filtro) {
      case "padres":
        return palomas.filter((p) => p.sexo === "macho");
      case "madres":
        return palomas.filter((p) => p.sexo === "hembra");
      default:
        return palomas;
    }
  }, [palomas, filtro]);

  const handlePalomaPress = (paloma: Paloma) => {
    router.push({
      pathname: "/paloma/[id]",
      params: { id: paloma.id },
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Implementar actualización de datos
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (cargando && palomasFilter.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600">{error}</Text>
      </View>
    );
  }

  if (palomasFilter.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500 text-center">
          No hay palomas registradas
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={palomasFilter}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PalomaCard paloma={item} onPress={handlePalomaPress} />
      )}
      contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    />
  );
};
