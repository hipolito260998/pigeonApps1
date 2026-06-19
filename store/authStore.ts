import { auth, database } from '@/config/firebase';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    User,
} from 'firebase/auth';
import { ref, set as setDB, update } from 'firebase/database';
import { create } from 'zustand';

interface AuthStore {
  user: User | null;
  cargando: boolean;
  error: string | null;

  // Actions
  registrarse: (email: string, password: string, nombre: string) => Promise<void>;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  setUser: (user: User | null) => void;
  setCargando: (cargando: boolean) => void;
  setError: (error: string | null) => void;
  verificarUsuario: () => void;
  actualizarPerfil: (nombre?: string, photoURL?: string) => Promise<void>;
}

// Función auxiliar para traducir errores de Firebase
const getFirebaseErrorMessage = (error: any): string => {
  const code = error?.code || "";
  switch (code) {
    case "auth/email-already-in-use":
      return "Este correo ya está registrado en otra cuenta.";
    case "auth/user-not-found":
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Correo o contraseña incorrectos.";
    case "auth/weak-password":
      return "La contraseña es muy débil (mínimo 6 caracteres).";
    case "auth/invalid-email":
      return "El formato del correo electrónico no es válido.";
    case "auth/network-request-failed":
      return "Error de conexión. Revisa tu internet.";
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Intenta más tarde.";
    default:
      return "Ocurrió un error inesperado. Inténtalo de nuevo.";
  }
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  cargando: true,
  error: null,

  registrarse: async (email, password, nombre) => {
    try {
      set({ cargando: true, error: null });
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizamos el nombre en el perfil de Firebase inmediatamente después de registrar
      await updateProfile(user, { displayName: nombre });
      
      // Guardar el perfil en la Base de Datos para visibilidad del administrador
      await setDB(ref(database, `users/${user.uid}`), {
        email,
        nombre,
        fechaRegistro: new Date().toISOString(),
      });

      // Firebase a veces no actualiza el objeto `user` local de inmediato con el nuevo displayName,
      // pero igual lo guardamos en el estado. Reload() podría refrescarlo, pero no es estrictamente necesario aquí.
      set({ user: { ...user, displayName: nombre } as User, cargando: false });
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error);
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
      const errorMessage = getFirebaseErrorMessage(error);
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
      const errorMessage = getFirebaseErrorMessage(error);
      set({ error: errorMessage, cargando: false });
      throw error;
    }
  },

  actualizarPerfil: async (nombre, photoURL) => {
    try {
      set({ cargando: true, error: null });
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("No hay usuario autenticado");

      const actualizaciones: any = {};
      const dbUpdates: any = {};

      if (nombre !== undefined) {
        actualizaciones.displayName = nombre;
        dbUpdates.nombre = nombre;
      }
      if (photoURL !== undefined) {
        actualizaciones.photoURL = photoURL;
        dbUpdates.foto = photoURL;
      }

      await updateProfile(currentUser, actualizaciones);
      
      // Sincronizar también con la Base de Datos
      if (Object.keys(dbUpdates).length > 0) {
        await update(ref(database, `users/${currentUser.uid}`), dbUpdates);
      }
      
      // Actualizamos el estado global clonando el usuario con los nuevos datos
      set({ 
        user: { ...currentUser, ...actualizaciones } as User, 
        cargando: false 
      });
    } catch (error: any) {
      const errorMessage = getFirebaseErrorMessage(error);
      set({ error: errorMessage, cargando: false });
      throw error;
    }
  },

  setUser: (user) => set({ user }),
  setCargando: (cargando) => set({ cargando }),
  setError: (error) => set({ error }),

  verificarUsuario: () => {
    // Si ya estamos escuchando o cargando, evitamos suscribirnos doble
    set({ cargando: true });
    
    onAuthStateChanged(auth, (user) => {
      // Firebase llamará a esto automáticamente cuando recupere la sesión de AsyncStorage
      // y también si el usuario cierra sesión o expira su token.
      set({ user, cargando: false });
    });
  },
}));
