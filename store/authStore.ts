import { auth } from '@/config/firebase';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
    User,
} from 'firebase/auth';
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  cargando: boolean;
  error: string | null;

  // Actions
  registrarse: (email: string, password: string) => Promise<void>;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  setUser: (user: User | null) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  verificarUsuario: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  cargando: false,
  error: null,

  registrarse: async (email, password) => {
    try {
      set({ cargando: true, error: null });
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      set({ user, cargando: false });
    } catch (error: any) {
      const errorMessage = error.message || 'Error en el registro';
      set({ error: errorMessage, cargando: false });
      throw error;
    }
  },

  iniciarSesion: async (email, password) => {
    try {
      set({ cargando: true, error: null });
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      set({ user, cargando: false });
    } catch (error: any) {
      const errorMessage = error.message || 'Error al iniciar sesión';
      set({ error: errorMessage, cargando: false });
      throw error;
    }
  },

  cerrarSesion: async () => {
    try {
      set({ cargando: true });
      await signOut(auth);
      set({ user: null, cargando: false });
    } catch (error: any) {
      set({ error: error.message, cargando: false });
      throw error;
    }
  },

  setUser: (user) => set({ user }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),

  verificarUsuario: () => {
    set({ cargando: true });
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      set({ user, cargando: false });
      unsubscribe();
    });
  },
}));
