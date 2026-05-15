# 🔐 Autenticación Firebase - Guía de Implementación

Este archivo muestra cómo agregar autenticación a tu app.

## 🚀 Pasos para Implementar

### 1. Habilitar Authentication en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Get Started**
4. Habilita **Email/Password**
5. (Opcional) Habilita **Google Sign-in**

### 2. Crear Store de Autenticación

Crea `store/authStore.ts`:

```typescript
import { create } from "zustand";
import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

interface AuthStore {
  user: User | null;
  cargando: boolean;
  error: string | null;

  // Actions
  registrarse: (email: string, password: string) => Promise<void>;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  cargando: false,
  error: null,

  registrarse: async (email, password) => {
    try {
      set({ cargando: true, error: null });
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      set({ user, cargando: false });
    } catch (error: any) {
      set({ error: error.message, cargando: false });
      throw error;
    }
  },

  iniciarSesion: async (email, password) => {
    try {
      set({ cargando: true, error: null });
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      set({ user, cargando: false });
    } catch (error: any) {
      set({ error: error.message, cargando: false });
      throw error;
    }
  },

  cerrarSesion: async () => {
    try {
      await signOut(auth);
      set({ user: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  setUser: (user) => set({ user }),
}));
```

### 3. Crear Página de Login

Crea `app/auth/login.tsx`:

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { iniciarSesion, registrarse, cargando, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await iniciarSesion(email, password);
      router.replace('/(tabs)/palomas');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await registrarse(email, password);
      Alert.alert('Éxito', 'Cuenta creada. Por favor inicia sesión.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-b from-primary to-primary-dark justify-center">
      <View className="px-6">
        {/* Logo/Título */}
        <Text className="text-4xl font-bold text-white text-center mb-8">
          🐦 Pigeon Apps
        </Text>

        {/* Email */}
        <TextInput
          className="bg-white px-4 py-3 rounded-lg mb-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!cargando}
        />

        {/* Password */}
        <TextInput
          className="bg-white px-4 py-3 rounded-lg mb-6"
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!cargando}
        />

        {/* Error */}
        {error && (
          <Text className="text-red-200 text-sm mb-4 text-center">{error}</Text>
        )}

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleLogin}
          disabled={cargando}
          className="bg-white py-3 rounded-lg mb-3"
        >
          {cargando ? (
            <ActivityIndicator color="#4F46E5" />
          ) : (
            <Text className="text-center font-bold text-primary text-lg">
              Iniciar Sesión
            </Text>
          )}
        </TouchableOpacity>

        {/* Register Button */}
        <TouchableOpacity
          onPress={handleRegister}
          disabled={cargando}
          className="bg-transparent border-2 border-white py-3 rounded-lg"
        >
          <Text className="text-center font-bold text-white text-lg">
            Crear Cuenta
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
```

### 4. Proteger Rutas

Actualiza `app/_layout.tsx`:

```typescript
import { Stack } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export default function RootLayout() {
  const { user } = useAuthStore();

  return (
    <Stack>
      {user ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="paloma/[id]" options={{ title: 'Detalles' }} />
          <Stack.Screen name="paloma/nueva" options={{ title: 'Nueva Paloma' }} />
        </>
      ) : (
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}
```

### 5. Agregar Logout en el Perfil

Actualiza `app/(tabs)/index.tsx` para agregar botón de logout:

```typescript
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { cerrarSesion, user } = useAuthStore();

  const handleLogout = async () => {
    await cerrarSesion();
    router.replace('/auth/login');
  };

  return (
    // ... Tu código existente
    <TouchableOpacity onPress={handleLogout} className="bg-red-500 p-3 rounded-lg">
      <Text className="text-white text-center font-bold">Logout</Text>
    </TouchableOpacity>
  );
}
```

## 🔑 Manejo de Errores Comunes

```typescript
// Firebase Error Codes
const errorMessages: Record<string, string> = {
  "auth/user-not-found": "Usuario no encontrado",
  "auth/wrong-password": "Contraseña incorrecta",
  "auth/email-already-in-use": "Email ya registrado",
  "auth/weak-password": "La contraseña es muy débil",
  "auth/invalid-email": "Email inválido",
};
```

## 💾 Sincronizar Datos con Usuario

En `services/palomaService.ts`, cambia las referencias de datos:

```typescript
// Antes:
const snapshot = await get(ref(database, `palomas`));

// Después:
const snapshot = await get(ref(database, `users/${userId}/palomas`));
```

## 🔒 Reglas de Firebase (Actualizado)

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "palomas": {
          ".read": "$uid === auth.uid",
          ".write": "$uid === auth.uid",
          "$palomaId": {
            ".validate": "newData.hasChildren(['nombre', 'anillo', 'raza'])"
          }
        }
      }
    }
  }
}
```

## 📱 Test rápido

1. Ejecuta `npm start`
2. Crea una cuenta de prueba
3. Verifica en Firebase Console que se creó el usuario
4. Las palomas se guardarán en `/users/{uid}/palomas`

## ✅ Checklist

- [ ] Autenticación habilitada en Firebase
- [ ] `authStore.ts` creado
- [ ] Página de login agregada
- [ ] Rutas protegidas
- [ ] Botón de logout en home
- [ ] Datos sincronizados por usuario
- [ ] Reglas de Firebase actualizadas

¡Listo! Tu app ahora tendrá autenticación segura. 🎉
