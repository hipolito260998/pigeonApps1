# 🚀 Quick Start - Pigeon Apps

## ¡Tu proyecto está listo! 🎉

El proyecto ha sido configurado completamente con toda la estructura necesaria para empezar a trabajar.

## 📝 Pasos Siguientes (IMPORTANTE)

### 1️⃣ **Configurar Firebase** (5 minutos)

1. Ve a [firebase.google.com](https://console.firebase.google.com)
2. Crea un nuevo proyecto (puedes nombrarlo "pigeonApps")
3. En el proyecto, ve a **Realtime Database** y crea una base de datos en modo "test"
4. Copia las credenciales de tu proyecto

### 2️⃣ **Configura las variables de entorno**

```bash
# En la raíz del proyecto, crea .env.local
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_KEY_HERE
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xyz
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

### 3️⃣ **Instala Expo Go en tu teléfono** (si quieres probar en mobile)

- iOS: [App Store](https://apps.apple.com/app/expo-go/id1197918424)
- Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

### 4️⃣ **Ejecuta el proyecto**

```bash
# Para ver en el navegador/Expo Go
npm start

# O directamente en iOS
npm run ios

# O en Android
npm run android

# O en Web
npm run web
```

## 📱 Qué Puedes Hacer Ahora

### Página Principal: `/` (Tabs)

- **Home**: Página de bienvenida (personalizable)
- **Explore**: Página de exploración (personalizable)
- **🐦 Palomas**: Tu zona principal para gestionar palomas

### Funcionalidades Implementadas

✅ **Ver todas tus palomas**

- Card con nombre, anillo, raza, sexo, color, estado
- Indicador de vacunas

✅ **Crear nueva paloma**

- Formulario completo con validación
- Campos: nombre, anillo, raza, sexo, color, fecha, notas
- Opción de asignar padres

✅ **Ver detalles de paloma**

- Información completa
- Listado de vacunas
- **Árbol genealógico visual** (padres, abuelos, hijos)
- Historial de notas

## 🛠 Stack que Instalamos

```
✅ React Native 0.81.5
✅ Expo 54 + Expo Router 6
✅ TypeScript
✅ NativeWind (Tailwind CSS)
✅ Zustand (Estado Global)
✅ Firebase Realtime Database
✅ DateTimePicker
✅ ESLint + Prettier
```

## 📊 Estructura del Proyecto

```
app/(tabs)/
  └── palomas.tsx          ← Tu panel principal

app/paloma/
  ├── [id].tsx            ← Ver detalles + árbol genealógico
  └── nueva.tsx           ← Crear nueva paloma

components/
  ├── PalomaCard.tsx      ← Card individual
  ├── PalomaLista.tsx     ← Lista con filtros
  ├── ArbolGenealogicoPaloma.tsx  ← Árbol genealógico
  └── CrearPalomaForm.tsx ← Formulario

store/
  └── palomaStore.ts      ← Estado global (Zustand)

services/
  └── palomaService.ts    ← Funciones Firebase

config/
  └── firebase.ts         ← Configuración Firebase

types/
  └── index.ts            ← Tipos TypeScript
```

## 💡 Tips Importantes

1. **Estado Global con Zustand**:

   ```tsx
   import { usePalomaStore } from "@/store/palomaStore";
   const { palomas, agregarPaloma } = usePalomaStore();
   ```

2. **Navegación**:

   ```tsx
   import { router } from "expo-router";
   router.push("/paloma/nueva");
   router.push({ pathname: "/paloma/[id]", params: { id: "123" } });
   ```

3. **Estilos con NativeWind** (Tailwind):
   ```tsx
   <View className="flex-1 bg-blue-50 p-4 rounded-lg">
     <Text className="text-lg font-bold text-blue-700">Título</Text>
   </View>
   ```

## 🔐 Reglas Firebase Recomendadas

En Realtime Database → Rules (para desarrollo):

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        "palomas": {
          "$palomaId": {
            ".read": "$uid === auth.uid",
            ".write": "$uid === auth.uid"
          }
        }
      }
    }
  }
}
```

## 🎯 Próximas Características a Implementar

- [ ] Autenticación (Google, Email/Password)
- [ ] Editar palomas existentes
- [ ] Eliminar palomas
- [ ] Fotos de palomas
- [ ] Sincronización offline
- [ ] Búsqueda avanzada
- [ ] Reportes/PDF
- [ ] Alertas de vacunas

## ❓ Problemas Comunes

### "Cannot connect to Firebase"

→ Verifica `.env.local` y que Realtime Database está habilitada

### App no abre

→ Ejecuta: `npm install && npm start --clear`

### TypeScript errors

→ ESLint debería estar limpio. Ejecuta: `npm run lint`

## 📞 Ayuda Rápida

Comandos útiles:

```bash
# Instalar dependencias
npm install

# Correr linter
npm run lint

# Limpiar cache
npm run reset-project

# Iniciar en modo desarrollo
npm start

# Probar en iOS
npm run ios

# Probar en Android
npm run android

# Web
npm run web
```

## 🎓 Recursos

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [NativeWind Docs](https://www.nativewind.dev)
- [Zustand](https://github.com/pmndrs/zustand)
- [Firebase Realtime DB](https://firebase.google.com/docs/database)

---

## ✨ ¡Listo para Comenzar!

Ya tienes todo lo que necesitas para:

1. Registrar palomas 🐦
2. Ver su árbol genealógico 🌳
3. Gestionar vacunas 💉
4. Sincronizar en la nube ☁️

**¡Ahora a crear la mejor app para tu papá! 💪**

¿Preguntas? Revisa [SETUP.md](./SETUP.md) para más detalles.
