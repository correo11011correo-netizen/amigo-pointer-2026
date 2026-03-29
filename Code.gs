/**
 * 🦅 AMIGO-POINTER 2026 | GOOGLE SERVER v2.0 (JSONP)
 * Motor optimizado para evitar errores de CORS y Latencia.
 */

var cache = CacheService.getScriptCache();

function doGet(e) {
  try {
    var sala = e.parameter.sala;
    var userId = e.parameter.userId;
    var lat = e.parameter.lat;
    var lon = e.parameter.lon;
    var callback = e.parameter.callback; // Para JSONP

    if (sala && userId && lat && lon) {
      // 1. Guardar mi posición
      var myCoords = JSON.stringify({lat: lat, lon: lon});
      cache.put(sala + "_" + userId, myCoords, 600);
      
      // 2. Obtener posición del amigo
      var friendId = (userId === "u1") ? "u2" : "u1";
      var friendCoords = cache.get(sala + "_" + friendId) || "null";
      
      // 3. Responder en formato JSONP para saltar el CORS
      var output = callback + "(" + friendCoords + ")";
      return ContentService.createTextOutput(output)
                           .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    
    return ContentService.createTextOutput("Radar Google Activo 🦅");
    
  } catch (err) {
    return ContentService.createTextOutput("Error: " + err.toString());
  }
}
