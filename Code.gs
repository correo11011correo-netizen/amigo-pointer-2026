/**
 * 🦅 AMIGO-POINTER 2026 | GOOGLE SERVER (Code.gs)
 * Este script actúa como el "puente" entre los dos teléfonos.
 */

var cache = CacheService.getScriptCache();

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sala = data.sala;
    var userId = data.userId;
    var myCoords = JSON.stringify(data.coords);
    
    // 1. Guardamos mi posición en la memoria de Google (durante 10 minutos)
    // Usamos el ID de la sala y el ID de usuario como clave
    cache.put(sala + "_" + userId, myCoords, 600);
    
    // 2. Buscamos la posición del amigo
    var friendId = (userId === "u1") ? "u2" : "u1";
    var friendCoords = cache.get(sala + "_" + friendId);
    
    // 3. Respondemos con la posición del amigo (o null si no está)
    return ContentService.createTextOutput(friendCoords || "null")
                         .setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({error: err.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para limpiar la sala manualmente si es necesario
function doGet(e) {
  return ContentService.createTextOutput("Servidor de Brújula Google Activo 🦅");
}
