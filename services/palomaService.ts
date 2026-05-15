import {
  ref,
  set,
  get,
  remove,
  push,
  update,
  onValue,
  off,
} from "firebase/database";
import { database } from "@/config/firebase";
import { Paloma } from "@/types";

const PALOMAS_REF = "palomas";

export const palomaService = {
  // Obtener todas las palomas
  async obtenerPalomas(userId: string): Promise<Paloma[]> {
    try {
      const snapshot = await get(ref(database, `users/${userId}/${PALOMAS_REF}`));
      if (snapshot.exists()) {
        const data = snapshot.val();
        return Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
          fechaNacimiento: new Date(data[key].fechaNacimiento),
          createdAt: new Date(data[key].createdAt),
          updatedAt: new Date(data[key].updatedAt),
        }));
      }
      return [];
    } catch (error) {
      console.error("Error obteniendo palomas:", error);
      throw error;
    }
  },

  // Crear nueva paloma
  async crearPaloma(userId: string, paloma: Omit<Paloma, "id">): Promise<Paloma> {
    try {
      const newPalomaRef = push(ref(database, `users/${userId}/${PALOMAS_REF}`));
      const palomaConId = {
        ...paloma,
        fechaNacimiento: paloma.fechaNacimiento.toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await set(newPalomaRef, palomaConId);
      return {
        ...paloma,
        id: newPalomaRef.key || "",
      };
    } catch (error) {
      console.error("Error creando paloma:", error);
      throw error;
    }
  },

  // Actualizar paloma
  async actualizarPaloma(userId: string, paloma: Paloma): Promise<void> {
    try {
      const palomaRef = ref(database, `users/${userId}/${PALOMAS_REF}/${paloma.id}`);
      const palomaActualizada = {
        ...paloma,
        fechaNacimiento: paloma.fechaNacimiento.toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await update(palomaRef, palomaActualizada);
    } catch (error) {
      console.error("Error actualizando paloma:", error);
      throw error;
    }
  },

  // Eliminar paloma
  async eliminarPaloma(userId: string, palomaId: string): Promise<void> {
    try {
      await remove(ref(database, `users/${userId}/${PALOMAS_REF}/${palomaId}`));
    } catch (error) {
      console.error("Error eliminando paloma:", error);
      throw error;
    }
  },

  // Escuchar cambios en tiempo real
  escucharPalomas(
    userId: string,
    callback: (palomas: Paloma[]) => void
  ): (() => void) => {
    const palomasRef = ref(database, `users/${userId}/${PALOMAS_REF}`);

    const unsubscribe = onValue(palomasRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const palomas = Object.keys(data).map((key) => ({
          ...data[key],
          id: key,
          fechaNacimiento: new Date(data[key].fechaNacimiento),
          createdAt: new Date(data[key].createdAt),
          updatedAt: new Date(data[key].updatedAt),
        }));
        callback(palomas);
      } else {
        callback([]);
      }
    });

    return () => off(palomasRef);
  },
};
