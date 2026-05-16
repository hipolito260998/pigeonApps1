import { ArbolGenealogico, Paloma } from "@/types";
import { create } from "zustand";

interface PalomaStore {
  palomas: Paloma[];
  palomaSeleccionada: Paloma | null;
  cargando: boolean;
  error: string | null;

  // Actions
  setPalomas: (palomas: Paloma[]) => void;
  agregarPaloma: (paloma: Paloma) => void;
  actualizarPaloma: (paloma: Paloma) => void;
  eliminarPaloma: (id: string) => void;
  setPalomaSeleccionada: (paloma: Paloma | null) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  getPalomasPorPadre: (padreId: string) => Paloma[];
  getPalomasPorMadre: (madreId: string) => Paloma[];
  obtenerArbolGenealogico: (palomaId: string) => ArbolGenealogico | null;
}

export const usePalomaStore = create<PalomaStore>((set, get) => ({
  palomas: [],
  palomaSeleccionada: null,
  cargando: false,
  error: null,

  setPalomas: (palomas) => set({ palomas }),

  agregarPaloma: (paloma) =>
    set((state) => ({
      palomas: [...state.palomas, paloma],
    })),

  actualizarPaloma: (paloma) =>
    set((state) => ({
      palomas: state.palomas.map((p) => (p.id === paloma.id ? paloma : p)),
    })),

  eliminarPaloma: (id) =>
    set((state) => ({
      palomas: state.palomas.filter((p) => p.id !== id),
    })),

  setPalomaSeleccionada: (paloma) => set({ palomaSeleccionada: paloma }),

  setCargando: (cargando) => set({ cargando }),

  setError: (error) => set({ error }),

  getPalomasPorPadre: (padreId) => {
    const state = get();
    return state.palomas.filter((p) => p.padreId === padreId);
  },

  getPalomasPorMadre: (madreId) => {
    const state = get();
    return state.palomas.filter((p) => p.madreId === madreId);
  },

  obtenerArbolGenealogico: (palomaId) => {
    const state = get();
    const paloma = state.palomas.find((p) => p.id === palomaId);

    if (!paloma) return null;

    const padre = paloma.padreId
      ? state.palomas.find((p) => p.id === paloma.padreId)
      : null;

    const madre = paloma.madreId
      ? state.palomas.find((p) => p.id === paloma.madreId)
      : null;

    const hijos = state.palomas.filter(
      (p) => p.padreId === palomaId || p.madreId === palomaId
    );

    return {
      paloma,
      padre: padre ? { paloma: padre, hijos: [] } : undefined,
      madre: madre ? { paloma: madre, hijos: [] } : undefined,
      hijos: hijos.map((h) => ({
        paloma: h,
        hijos: [],
      })),
    };
  },
}));
