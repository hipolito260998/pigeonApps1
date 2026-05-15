# 🐦 Pigeon Apps - Gestor Inteligente de Palomas

Una aplicación React Native + Expo diseñada para gestionar un criadero de palomas. Tu papá podrá registrar, organizar y visualizar el árbol genealógico completo de sus palomas con todos los detalles.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61dafb)
![Expo](https://img.shields.io/badge/Expo-54-000020)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)

## 🌟 Características Principales

### ✅ Ya Implementado

- **📋 Registro Completo de Palomas**
  - Nombre, anillo (ID), raza, sexo, color
  - Fecha de nacimiento
  - Estado (activa, vendida, fallecida, retirada)
  - Notas personalizadas

- **🌳 Árbol Genealógico Visual**
  - Ver padres, abuelos e hijos
  - Navegación entre generaciones
  - Vista organizada por niveles

- **💉 Gestión de Vacunas**
  - Registro de vacunas aplicadas
  - Fechas de vacunación

- **📊 Dashboard de Estadísticas**
  - Total de palomas
  - Contador de hembras y machos

- **🎨 Interfaz Moderna**
  - Diseño responsive con NativeWind (Tailwind CSS)
  - Navegación fluida con Expo Router

## 🛠 Stack Técnico

| Capa              | Tecnología                 |
| ----------------- | -------------------------- |
| **Frontend**      | React Native + Expo        |
| **Lenguaje**      | TypeScript                 |
| **Estilos**       | NativeWind (Tailwind CSS)  |
| **Navegación**    | Expo Router v6             |
| **Estado Global** | Zustand                    |
| **Base de Datos** | Firebase Realtime Database |

## 🚀 Inicio Rápido

### Requisitos

- Node.js 18+
- npm
- Cuenta Firebase gratis

### Instalación

```bash
npm install
npm start
```

Luego abre en:

- iOS: `npm run ios`
- Android: `npm run android`
- Web: `npm run web`

### Configuración Firebase

1. Ve a [firebase.google.com](https://console.firebase.google.com)
2. Crea un proyecto
3. Habilita Realtime Database
4. Copia las credenciales a `.env.local` (copia `.env.example`)

## 📁 Estructura del Proyecto

```
app/(tabs)/palomas.tsx          # Panel principal de palomas
app/paloma/[id].tsx             # Detalles + Árbol genealógico
app/paloma/nueva.tsx            # Crear nueva paloma

components/
  ├── PalomaCard.tsx            # Card individual
  ├── PalomaLista.tsx           # Lista de palomas
  ├── ArbolGenealogicoPaloma.tsx # Árbol genealógico
  └── CrearPalomaForm.tsx       # Formulario

store/palomaStore.ts            # Estado global (Zustand)
services/palomaService.ts       # Firebase integration
types/index.ts                  # TypeScript types
```

## 📚 Documentación

- [QUICKSTART.md](./QUICKSTART.md) - Guía rápida de 5 minutos
- [SETUP.md](./SETUP.md) - Configuración completa
- [AUTH.md](./AUTH.md) - Implementar autenticación

## 🧙 Usar el Store

```typescript
import { usePalomaStore } from "@/store/palomaStore";

const { palomas, agregarPaloma, obtenerArbolGenealogico } = usePalomaStore();
```

## 💻 Comandos

```bash
npm start        # Inicia la app
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
npm run lint     # ESLint
```

## 📖 Recursos

- [Expo Docs](https://docs.expo.dev)
- [React Native](https://reactnative.dev)
- [NativeWind](https://www.nativewind.dev)
- [Firebase](https://firebase.google.com)

---

**Desarrollado con ❤️ para el criadero de palomas** 🐦
