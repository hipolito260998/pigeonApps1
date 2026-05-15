# 🐦 Pigeon Apps - Gestor de Palomas

Una aplicación React Native + Expo para gestionar un criadero de palomas. Permite registrar palomas, ver su árbol genealógico, vacunas y características.

## 🎯 Características Principales

- ✅ **Registrar Palomas**: Nombre, anillo, raza, sexo, color, fecha de nacimiento
- ✅ **Árbol Genealógico**: Visualizar padres, abuelos e hijos
- ✅ **Gestión de Vacunas**: Registrar vacunas y fechas de revacunación
- ✅ **Estado de Palomas**: Activa, vendida, fallecida, retirada
- ✅ **Búsqueda y Filtrado**: Por sexo, estado, raza
- ✅ **Sincronización en Tiempo Real**: Con Firebase
- 🔲 **Fotos**: (Próximamente)
- 🔲 **Reportes**: (Próximamente)

## 🛠 Stack Técnico

```
Frontend:
- React Native + Expo
- TypeScript
- NativeWind (Tailwind CSS para React Native)
- Expo Router (Navegación)

Estado Global:
- Zustand

Backend:
- Firebase Realtime Database
- Firebase Authentication

Herramientas:
- ESLint
- Prettier (Recomendado)
```

## 📋 Requisitos Previos

- Node.js 18+
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Cuenta de Firebase (gratis en https://firebase.google.com)

## 🚀 Instalación y Configuración

### 1. **Clonar o preparar el proyecto**

```bash
cd pigeonApps
npm install
```

### 2. **Configurar Firebase**

1. Ir a https://console.firebase.google.com
2. Crear un nuevo proyecto (o usar uno existente)
3. Habilitar "Realtime Database" en modo test (para desarrollo)
4. Habilitar "Authentication" con Email/Password
5. Copiar las credenciales de configuración

### 3. **Configurar variables de entorno**

```bash
# Copiar el archivo de ejemplo
cp .env.example .env.local

# Editar .env.local con tus credenciales de Firebase
```

**Archivo .env.local:**

```
EXPO_PUBLIC_FIREBASE_API_KEY=your_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:xyz
EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

### 4. **Ejecutar la aplicación**

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web

# Desarrollo (Expo Go)
npm start
```

## 📁 Estructura de Carpetas

```
pigeonApps/
├── app/                    # Rutas de Expo Router
│   ├── (tabs)/            # Rutas principales (pestañas)
│   │   ├── palomas.tsx    # Vista principal de palomas
│   │   ├── index.tsx      # Home
│   │   └── explore.tsx    # Explorar
│   ├── paloma/
│   │   ├── [id].tsx       # Detalles de paloma
│   │   └── nueva.tsx      # Crear paloma
│   └── _layout.tsx        # Layout principal
├── components/            # Componentes reutilizables
│   ├── PalomaCard.tsx     # Card de paloma
│   ├── PalomaLista.tsx    # Lista de palomas
│   ├── CrearPalomaForm.tsx
│   └── ArbolGenealogicoPaloma.tsx
├── config/                # Configuración
│   └── firebase.ts        # Inicialización de Firebase
├── store/                 # Zustand stores
│   └── palomaStore.ts     # Estado global de palomas
├── services/              # Servicios para APIs
│   └── palomaService.ts   # Funciones Firebase
├── types/                 # TypeScript types
│   └── index.ts           # Tipos principales
├── constants/             # Constantes
├── hooks/                 # Custom hooks
└── package.json
```

## 🔐 Seguridad en Firebase

### Reglas Recomendadas (Realtime Database)

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
            ".write": "$uid === auth.uid",
            ".validate": "newData.hasChildren(['nombre', 'anillo', 'raza', 'sexo', 'color', 'fechaNacimiento'])"
          }
        }
      }
    }
  }
}
```

## 📱 Funcionalidades por Implementar

### Fase 2:

- [ ] Editar palomas existentes
- [ ] Eliminar palomas
- [ ] Sincronización offline
- [ ] Buscar palomas

### Fase 3:

- [ ] Fotos de palomas
- [ ] Reportes en PDF
- [ ] Exportar datos
- [ ] Cálculo automático de edad
- [ ] Alerta de vacunas próximas

### Fase 4:

- [ ] Autenticación mejorada
- [ ] Múltiples usuarios en un criadero
- [ ] Sincronización de datos entre dispositivos

## 🤝 Componentes Principales

### `PalomaCard`

Muestra la información básica de una paloma en un card.

```tsx
<PalomaCard paloma={paloma} onPress={(p) => handlePress(p)} />
```

### `PalomaLista`

Lista de todas las palomas con filtros.

```tsx
<PalomaLista filtro="todas" /> // todas | padres | madres
```

### `ArbolGenealogicoPaloma`

Visualiza el árbol genealógico.

```tsx
<ArbolGenealogicoPaloma palomaId={id} />
```

### `CrearPalomaForm`

Formulario para registrar nuevas palomas.

```tsx
<CrearPalomaForm padreId={optional} madreId={optional} />
```

## 🧙 Zustand Store

```tsx
// Usar el store en cualquier componente
import { usePalomaStore } from "@/store/palomaStore";

const { palomas, agregarPaloma, actualizarPaloma, obtenerArbolGenealogico } =
  usePalomaStore();
```

### Métodos disponibles:

- `setPalomas(palomas)` - Establecer lista de palomas
- `agregarPaloma(paloma)` - Agregar nueva paloma
- `actualizarPaloma(paloma)` - Actualizar paloma
- `eliminarPaloma(id)` - Eliminar paloma
- `setPalomaSeleccionada(paloma)` - Seleccionar paloma actual
- `getPalomasPorPadre(padreId)` - Obtener hijos de un padre
- `getPalomasPorMadre(madreId)` - Obtener hijos de una madre
- `obtenerArbolGenealogico(palomaId)` - Árbol completo

## 🧪 Testing (Próximamente)

```bash
npm test
```

## 📚 Referencia de Tipos

```typescript
// Paloma
interface Paloma {
  id: string;
  nombre: string;
  anillo: string;
  raza: string;
  sexo: "macho" | "hembra";
  fechaNacimiento: Date;
  color: string;
  padreId?: string;
  madreId?: string;
  vacunas: Vacuna[];
  notas?: string;
  foto?: string;
  estado: "activa" | "vendida" | "fallecida" | "retirada";
  createdAt: Date;
  updatedAt: Date;
}

// Vacuna
interface Vacuna {
  id: string;
  nombre: string;
  fecha: Date;
  proximaVacunacion?: Date;
  notas?: string;
}
```

## 🐛 Troubleshooting

### "Cannot find module '@/...'"

Asegurate que `tsconfig.json` tiene los paths correctos:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Firebase no conecta

- Verifica que las variables de entorno están configuradas
- Asegurate que Realtime Database está habilitada
- Revisa las reglas de Firebase (security rules)

### App crashea al iniciar

- Ejecuta `npm install` de nuevo
- Limpia caché: `npm run reset-project`
- Reinicia Expo: `npm start --clear`

## 📖 Recursos

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [NativeWind](https://www.nativewind.dev)
- [Zustand](https://github.com/pmndrs/zustand)
- [Firebase Realtime Database](https://firebase.google.com/docs/database)
- [Expo Router](https://docs.expo.dev/routing/introduction/)

## 📝 License

Este proyecto es personal para uso familiar.

## 👨‍💼 Autor

Desarrollo realizado con ❤️ para la gestión del criadero de palomas.

---

**Última actualización:** Mayo 2026
**Versión:** 1.0.0
