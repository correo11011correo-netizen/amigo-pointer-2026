#  AMIGO-POINTER 2026 | MANUAL TÉCNICO

## 🎯 PROPÓSITO
Sistema de localización táctica en tiempo real diseñado para encontrar amigos en entornos dinámicos (fiestas, festivales, exteriores) mediante una brújula de alta precisión.

## 🏗️ ARQUITECTURA (SINCRO ATÓMICA)
1. **Frontend:** Web App Pro (HTML5/CSS3/JS) con motor de renderizado AMOLED.
2. **Backend:** Google Apps Script (GAS) funcionando como servidor de relevo (Relay Server).
3. **Comunicación:** Protocolo JSONP v4.0 para eludir restricciones de CORS y asegurar baja latencia.

## 📊 MOTOR BLACK BOX
El sistema incluye un módulo de diagnóstico obligatorio que registra:
- **OUTGOING_PULSE:** Datos de ubicación enviados al servidor.
- **INCOMING_RAW_DATA:** Respuesta JSON cruda del servidor de Google.
- **SIGNAL_LOCK:** Estado del hardware GPS del dispositivo.

## 🔐 SEGURIDAD Y BACKUP
- **Google Script ID:** `1ZmQ6KgqXty3bCjVp0ROBecmhE0JuPLJwDFiZRKXyZcKLredOOCluKp4k`
- **Backup Local:** `Desarrollo_Apps_Web_Mobile/Mobile_Apps/amigo-pointer/Code.gs`

## 🚀 VERSIONES
- **v1.0 - v5.0:** Evolución de prototipos y debug de red.
- **v6.0 - v7.0:** Estética táctica y botón de abortar.
- **v8.0 - v9.0:** Cyber-Party Edition (Neon-Violet).

---
*Desarrollado para el Workspace de Adrian Delpiano (Marzo 2026).*
