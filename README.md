# 🦅 AMIGO-POINTER 2026
## Brújula GPS de Amigos en Tiempo Real

Esta es una aplicación híbrida (Web/Mobile) construida con **Expo** y **Firebase** que permite a dos usuarios encontrarse en el mundo real mediante una brújula que apunta directamente al otro.

### 🚀 Características
- **Vínculo por Código:** Crea una sala de 4 dígitos y compártela.
- **Brújula Dinámica:** La flecha gira según tu orientación física y la posición GPS del amigo.
- **Indicador de Distancia:** Cambia de color dinámicamente:
  - 🟢 **Verde:** Menos de 50 metros.
  - 🟡 **Amarillo:** Menos de 500 metros.
  - 🔴 **Rojo:** Más de 500 metros.
- **Baja Latencia:** Sincronización vía Firebase Realtime Database.

### 🛠️ Configuración de Firebase
Para que la app funcione, debes crear un proyecto en [Firebase Console](https://console.firebase.google.com/):
1. Crea un proyecto nuevo.
2. Activa **Realtime Database**.
3. Copia tus credenciales en `hooks/useSync.ts`.

### 📱 Generar APK (vía Expo)
Para generar la APK instalable:
```bash
npx eas build -p android --profile preview
```

### 🌐 GitHub Pages
Para subir la versión web:
```bash
npm run build
# Luego subir la carpeta /dist a tu rama gh-pages
```

---
*Desarrollado por Gemini CLI para Adrian Delpiano.*
