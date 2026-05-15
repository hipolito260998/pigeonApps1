# ✅ Checklist de Configuración - Pigeon Apps

Completa estos pasos para que tu app esté lista para usar.

## 📋 Fase 1: Configuración Inicial (15 minutos)

- [ ] **Firebase Setup**
  - [ ] Crear proyecto en [firebase.google.com](https://console.firebase.google.com)
  - [ ] Habilitar Realtime Database (modo test)
  - [ ] Copiar credenciales del proyecto
  - [ ] Crear archivo `.env.local` en la raíz
  - [ ] Llenar `.env.local` con credenciales

- [ ] **Verificar Instalación**
  - [ ] Ejecutar: `npm install`
  - [ ] Ejecutar: `npm run lint` (debería pasar sin errores)
  - [ ] Ejecutar: `npm start`
  - [ ] La app debería abrir en Expo Go

## 📱 Fase 2: Testear la App (10 minutos)

### En Expo Go (Recomendado para inicio)

```bash
npm start
# Presiona 'i' para iOS o 'a' para Android
# O escanea el QR con Expo Go desde tu teléfono
```

### Pruebas

- [ ] Abre la app
- [ ] Navega a la pestaña "Palomas" (🐦)
- [ ] Presiona "+ Nueva"
- [ ] Llena el formulario de ejemplo:
  ```
  Nombre: Palomita
  Anillo: 2024-001
  Raza: Carrier
  Sexo: Macho
  Color: Rojo
  Fecha: Hoy
  ```
- [ ] Presiona "Guardar"
- [ ] Verifica que aparece en la lista
- [ ] Toca el card para ver detalles
- [ ] Verifica el árbol genealógico vacío

## 🔐 Fase 3: Autenticación (OPCIONAL - 20 minutos)

Si quieres que tu papá inicie sesión:

- [ ] Leer [AUTH.md](./AUTH.md)
- [ ] Crear `store/authStore.ts`
- [ ] Crear página `app/auth/login.tsx`
- [ ] Actualizar `app/_layout.tsx`
- [ ] Habilitar Email/Password en Firebase Console
- [ ] Testear login/registro

## ☁️ Fase 4: Conectar Firebase (INTERMEDIO - 30 minutos)

Para que los datos se guarden en la nube:

- [ ] Descomentar/Implementar calls a Firebase en `services/palomaService.ts`
- [ ] En `app/(tabs)/palomas.tsx` usar `palomaService.obtenerPalomas(userId)`
- [ ] Agregar listener en tiempo real con `palomaService.escucharPalomas()`
- [ ] Guardar datos en Firebase en lugar de solo store local
- [ ] Testear crear paloma → Verificar en Firebase Console

### Paso a Paso (Dev)

```typescript
// En app/(tabs)/palomas.tsx
import { palomaService } from "@/services/palomaService";
import { useAuthStore } from "@/store/authStore"; // Si implementaste auth

useEffect(() => {
  const userId = "test-user"; // O auth.user.uid si tienes auth
  const unsubscribe = palomaService.escucharPalomas(userId, (palomas) => {
    setPalomas(palomas);
  });
  return unsubscribe;
}, []);
```

## 🎨 Fase 5: Personalización (OPCIONAL - Variable)

- [ ] Cambiar colores primarios en `tailwind.config.js`
  ```js
  primary: "#TU_COLOR",
  secondary: "#TU_COLOR",
  ```
- [ ] Actualizar home en `app/(tabs)/index.tsx`
- [ ] Personalizar explore en `app/(tabs)/explore.tsx`
- [ ] Agregar logo en `assets/images/`

## 🚀 Fase 6: Deploy (AVANZADO)

### Para iOS

```bash
npm run ios
# O con EAS Build
eas build --platform ios
```

### Para Android

```bash
npm run android
# O con EAS Build
eas build --platform android
```

### Para Web

```bash
npm run web
# Vercel: vercel deploy
```

## 🐛 Troubleshooting

| Problema                     | Solución                             |
| ---------------------------- | ------------------------------------ |
| "Cannot find module '@/...'" | Reinicia: `npm start --clear`        |
| Firebase no conecta          | Verifica `.env.local` y credenciales |
| App no inicia                | Ejecuta: `npm run reset-project`     |
| TypeScript errors            | Ejecuta: `npm run lint`              |
| Datos no guardan             | Verifica reglas de Firebase          |

## 📊 Verificación Final

Antes de entregar al usuario, verifica:

- [ ] ✅ App inicia sin errores
- [ ] ✅ Crear paloma funciona
- [ ] ✅ Ver detalles funciona
- [ ] ✅ Árbol genealógico se muestra
- [ ] ✅ Datos se guardan (Firebase u otro)
- [ ] ✅ No hay warnings en console
- [ ] ✅ Performance es fluido

## 📞 Soporte

### Si algo no funciona:

1. **Lee la documentación**
   - [QUICKSTART.md](./QUICKSTART.md)
   - [SETUP.md](./SETUP.md)
   - [AUTH.md](./AUTH.md)

2. **Verifica errores**

   ```bash
   npm run lint
   ```

3. **Limpia y reinicia**

   ```bash
   npm run reset-project
   npm install
   npm start --clear
   ```

4. **Revisa Firebase Console**
   - ¿Está habilitada Realtime Database?
   - ¿Son válidas las credenciales?
   - ¿Tienes datos en `/users/`?

## 🎉 ¡Listo!

Una vez que completes este checklist, tu app estará lista para que tu papá empiece a registrar sus palomas.

---

**Próximos pasos sugeridos:**

1. Implementar autenticación
2. Agregar fotos de palomas
3. Crear reportes
4. Agregar notificaciones de vacunas

¡Que disfrutes! 🐦✨
